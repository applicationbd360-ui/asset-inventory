import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import QRCode from 'qrcode';
import { z } from 'zod';

const prisma = new PrismaClient();

const generateAssetCode = async (classCode: string) => {
  const lastAsset = await prisma.fixedAsset.findFirst({
    where: { faNo: { startsWith: `${classCode}-` } },
    orderBy: { id: 'desc' },
  });

  let seq = 1;
  if (lastAsset) {
    const lastSeq = parseInt(lastAsset.faNo.split('-')[1]);
    seq = lastSeq + 1;
  }
  return `${classCode}-${seq.toString().padStart(5, '0')}`;
};

const capitalizationSchema = z.object({
  grnLineId: z.number(),
  assetClassId: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  acquisitionCost: z.number().positive(),
  usefulLifeYears: z.number().positive().default(5),
  salvageValue: z.number().min(0).default(0),
  depreciationMethod: z.string().default('STRAIGHT_LINE'),
  createEquipment: z.boolean().default(true),
  equipmentCategoryId: z.number().optional(),
  costCenterId: z.number().optional(),
});

export const assetController = {
  getAssets: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assets = await prisma.fixedAsset.findMany({
        include: {
          assetClass: true,
          equipment: { select: { id: true, code: true } },
        },
        orderBy: { capitalizationDate: 'desc' },
      });
      res.json({ success: true, data: assets });
    } catch (error) {
      next(error);
    }
  },

  getPendingCapitalizationAssets: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pendingLines = await prisma.grnLine.findMany({
        where: {
          itemType: 'ASSET',
          inspectionStatus: 'PASSED',
          fixedAsset: null
        },
        include: {
          grn: {
            include: { po: true, vendor: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      });
      res.json({ success: true, data: pendingLines });
    } catch (error) {
      next(error);
    }
  },

  getAssetById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const asset = await prisma.fixedAsset.findUnique({
        where: { id: Number(id) },
        include: {
          assetClass: true,
          deprnSchedule: true,
          journalLines: {
            include: { journal: true },
          },
          equipment: true,
        },
      });
      if (!asset) throw new AppError('Asset not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: asset });
    } catch (error) {
      next(error);
    }
  },

  capitalizeAsset: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = capitalizationSchema.parse(req.body);
      
      // System Control: No finance capitalization without cost center
      if (!data.costCenterId) {
        throw new AppError('Cost Center is mandatory for Asset Capitalization', 400);
      }

      // System Control: No asset creation without accepted GRN
      if (!data.grnLineId) {
        throw new AppError('Asset Capitalization requires a valid GRN Line reference', 400);
      }
      
      const grnLine = await prisma.grnLine.findUnique({ where: { id: data.grnLineId } });
      if (!grnLine || (grnLine.inspectionStatus !== 'ACCEPTED' && grnLine.inspectionStatus !== 'PASSED')) {
        throw new AppError('Cannot capitalize asset: Linked GRN must be Accepted/Passed inspection', 400);
      }
      
      const assetClass = await prisma.assetClass.findUnique({ where: { id: data.assetClassId } });
      if (!assetClass) throw new AppError('Asset Class not found', 404);

      const faNo = await generateAssetCode(assetClass.code);

      const result = await prisma.$transaction(async (tx) => {
        // Create Fixed Asset
        const asset = await tx.fixedAsset.create({
          data: {
            faNo,
            assetName: data.name,
            assetClassId: data.assetClassId,
            assetStatus: 'ACTIVE',
            grnLineId: data.grnLineId,
            acquisitionDate: new Date(),
            acquisitionValue: data.acquisitionCost,
            bookValue: data.acquisitionCost,
            capitalizationDate: new Date(),
            usefulLifeMonths: data.usefulLifeYears * 12,
            salvageValue: data.salvageValue,
            depreciationMethod: data.depreciationMethod,
          }
        });

        // Generate Depreciation Schedule (Simple straight line for demo)
        const yearlyDeprn = (data.acquisitionCost - data.salvageValue) / data.usefulLifeYears;
        const monthlyDeprn = yearlyDeprn / 12;
        const schedules = [];
        
        const currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth() + 1;
        let bookVal = data.acquisitionCost;

        for (let i = 1; i <= data.usefulLifeYears * 12; i++) {
          schedules.push({
            fixedAssetId: asset.id,
            fiscalYear: currentMonth > 12 ? currentYear + Math.floor((currentMonth - 1) / 12) : currentYear,
            fiscalMonth: ((currentMonth - 1) % 12) + 1,
            openingBookValue: bookVal,
            deprnAmount: monthlyDeprn,
            closingBookValue: bookVal - monthlyDeprn,
            runStatus: 'PENDING'
          });
          bookVal -= monthlyDeprn;
          currentMonth++;
        }
        await tx.depreciationSchedule.createMany({ data: schedules });

        // Optionally Create Equipment Master (EAM integration)
        if (data.createEquipment && data.equipmentCategoryId) {
          const cat = await tx.equipmentCategory.findUnique({ where: { id: data.equipmentCategoryId } });
          let seq = await tx.equipment.count({ where: { categoryId: data.equipmentCategoryId } }) + 1;
          const eqCode = `${cat?.code || 'EQ'}-${seq.toString().padStart(4, '0')}`;
          
          const newEq = await tx.equipment.create({
            data: {
              code: eqCode,
              name: data.name,
              categoryId: data.equipmentCategoryId,
              fixedAssetId: asset.id,
              costCenterId: data.costCenterId,
              status: 'CREATED',
              criticality: 'MEDIUM',
            }
          });
          
          if (data.grnLineId) {
            const grnLineData = await tx.grnLine.findUnique({ where: { id: data.grnLineId } });
            if (grnLineData) {
              await tx.assetProcurementLink.updateMany({
                where: { grnId: grnLineData.grnId },
                data: { fixedAssetId: asset.id, fixedAssetNo: faNo, equipmentId: newEq.id }
              });
            }
          }
        } else if (data.grnLineId) {
            const grnLineData = await tx.grnLine.findUnique({ where: { id: data.grnLineId } });
            if (grnLineData) {
              await tx.assetProcurementLink.updateMany({
                where: { grnId: grnLineData.grnId }, 
                data: { fixedAssetId: asset.id, fixedAssetNo: faNo }
              });
            }
        }

        // Generate Journal Entry
        const journal = await tx.journalHeader.create({
          data: {
            journalNo: `JV-AST-${Date.now().toString().slice(-6)}`,
            postingDate: new Date(),
            sourceModule: 'FIXED_ASSET',
            sourceDocType: 'ASSET_CAPITALIZATION',
            sourceDocId: asset.id,
            narration: `Capitalization of Asset ${faNo}`,
            totalDebit: data.acquisitionCost,
            totalCredit: data.acquisitionCost,
            postingStatus: 'POSTED',
            lines: {
              create: [
                // Debit Asset Account
                { lineNo: 1, glCode: assetClass.assetGlCode, debitAmount: data.acquisitionCost, creditAmount: 0 },
                // Credit AP or GRIR
                { lineNo: 2, glCode: '20010', debitAmount: 0, creditAmount: data.acquisitionCost }
              ]
            }
          }
        });

        // Update GRN Line Inspection Status
        if (data.grnLineId) {
          await tx.grnLine.update({
            where: { id: data.grnLineId },
            data: { inspectionStatus: 'CAPITALIZED' }
          });
        }

        return { asset, journal };
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  getAssetQrCode: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const asset = await prisma.fixedAsset.findUnique({
        where: { id: parseInt(id as string) },
        select: { faNo: true, assetName: true }
      });
      if (!asset) {
        return next(new AppError('Asset not found', 404));
      }
      const qrData = JSON.stringify({ id, faNo: asset.faNo, name: asset.assetName });
      const qrCodeBase64 = await QRCode.toDataURL(qrData);
      res.json({ success: true, data: { qrCode: qrCodeBase64 } });
    } catch (error) {
      next(error);
    }
  },
};
