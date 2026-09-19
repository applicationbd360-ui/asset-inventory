import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';

const prisma = new PrismaClient();

export const depreciationController = {
  runDepreciation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, month } = req.body; // e.g., year: 2026, month: 7

      if (!year || !month) {
        throw new AppError('Year and month are required', 400);
      }

      // Find all pending schedules for this period or earlier
      const pendingSchedules = await prisma.depreciationSchedule.findMany({
        where: {
          runStatus: 'PENDING',
          OR: [
            { fiscalYear: { lt: year } },
            { fiscalYear: year, fiscalMonth: { lte: month } }
          ]
        },
        include: { fixedAsset: { include: { assetClass: true } } }
      });

      if (pendingSchedules.length === 0) {
        return res.json({ success: true, message: 'No pending depreciation found for this period.', count: 0 });
      }

      let processedCount = 0;

      await prisma.$transaction(async (tx) => {
        for (const sched of pendingSchedules) {
          const asset = sched.fixedAsset;

          // 1. Mark schedule as POSTED
          await tx.depreciationSchedule.update({
            where: { id: sched.id },
            data: {
              runStatus: 'POSTED',
              runDate: new Date()
            }
          });

          // 2. Update Fixed Asset accumDeprn and bookValue
          await tx.fixedAsset.update({
            where: { id: asset.id },
            data: {
              accumulatedDeprn: { increment: sched.deprnAmount },
              bookValue: sched.closingBookValue
            }
          });

          // 3. Create Journal Entry
          const journal = await tx.journalHeader.create({
            data: {
              journalNo: `JV-DEP-${Date.now().toString().slice(-6)}-${sched.id}`,
              sourceModule: 'FIXED_ASSET',
              sourceDocType: 'DEPRECIATION',
              sourceDocId: asset.id,
              postingDate: new Date(),
              narration: `Depreciation for ${asset.faNo} - ${sched.fiscalYear}/${sched.fiscalMonth}`,
              totalDebit: sched.deprnAmount,
              totalCredit: sched.deprnAmount,
              postingStatus: 'POSTED',
              lines: {
                create: [
                  // Debit Depreciation Expense
                  { lineNo: 1, glCode: asset.assetClass.depreciationExpenseGlCode, debitAmount: sched.deprnAmount, creditAmount: 0 },
                  // Credit Accumulated Depreciation
                  { lineNo: 2, glCode: asset.assetClass.accumDepreciationGlCode, debitAmount: 0, creditAmount: sched.deprnAmount }
                ]
              }
            }
          });

          // Update schedule with journal id
          await tx.depreciationSchedule.update({
            where: { id: sched.id },
            data: { journalId: journal.id }
          });

          processedCount++;
        }
      });

      res.json({ success: true, message: `Successfully ran depreciation for ${processedCount} schedules.`, count: processedCount });
    } catch (error) {
      next(error);
    }
  }
};
