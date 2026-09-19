import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const amcController = {
  payAdvance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, amcId, description } = req.body;

      const journal = await prisma.journalHeader.create({
        data: {
          journalNo: `JRN-AMC-ADV-${Date.now()}`,
          sourceModule: 'FINANCE',
          sourceDocType: 'AMC_ADVANCE',
          sourceDocId: amcId || 0,
          narration: description || `AMC Advance Payment`,
          totalDebit: amount,
          totalCredit: amount,
          postingStatus: 'POSTED',
          postingDate: new Date(),
          lines: {
            create: [
              // Debit Prepaid AMC (e.g. 15010)
              { lineNo: 1, glCode: '15010', debitAmount: amount, creditAmount: 0 },
              // Credit Bank/Cash (e.g. 10001)
              { lineNo: 2, glCode: '10001', debitAmount: 0, creditAmount: amount }
            ]
          }
        }
      });

      res.status(201).json({ success: true, data: journal });
    } catch (error) { next(error); }
  },

  postMonthlyExpense: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, amcId, description, month, year } = req.body;

      const journal = await prisma.journalHeader.create({
        data: {
          journalNo: `JRN-AMC-EXP-${Date.now()}`,
          sourceModule: 'FINANCE',
          sourceDocType: 'AMC_EXPENSE',
          sourceDocId: amcId || 0,
          narration: description || `AMC Monthly Expense for ${month}/${year}`,
          totalDebit: amount,
          totalCredit: amount,
          postingStatus: 'POSTED',
          postingDate: new Date(),
          lines: {
            create: [
              // Debit Maintenance Expense (e.g. 50010)
              { lineNo: 1, glCode: '50010', debitAmount: amount, creditAmount: 0 },
              // Credit Prepaid AMC (e.g. 15010)
              { lineNo: 2, glCode: '15010', debitAmount: 0, creditAmount: amount }
            ]
          }
        }
      });

      res.status(201).json({ success: true, data: journal });
    } catch (error) { next(error); }
  }
};
