import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const generatePoNo = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const lastPo = await prisma.poHeader.findFirst({
    where: { poNo: { startsWith: `PO-${year}${month}-` } },
    orderBy: { id: 'desc' },
  });

  let seq = 1;
  if (lastPo) {
    const lastSeq = parseInt(lastPo.poNo.split('-')[2]);
    seq = lastSeq + 1;
  }
  return `PO-${year}${month}-${seq.toString().padStart(4, '0')}`;
};

const poLineSchema = z.object({
  prLineId: z.number().optional(),
  itemType: z.string(),
  itemId: z.number().optional(),
  itemDescription: z.string().min(1),
  orderedQty: z.number().positive(),
  uomCode: z.string().optional(),
  unitPrice: z.number().nonnegative(),
  taxAmount: z.number().nonnegative().default(0),
  discountAmount: z.number().nonnegative().default(0),
  costCenterId: z.number().optional(),
  assetClassCode: z.string().optional(),
});

const createPoSchema = z.object({
  vendorId: z.number(),
  poType: z.enum(['ASSET', 'SPARE', 'SERVICE', 'AMC']),
  expectedDeliveryDate: z.string().optional(),
  paymentTerms: z.string().optional(),
  currencyCode: z.string().default('BDT'),
  notes: z.string().optional(),
  lines: z.array(poLineSchema).min(1),
});

export const poController = {
  createPo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createPoSchema.parse(req.body);

      // System Control: No PO without approved PR
      const prLineIds = data.lines.map(l => l.prLineId).filter(id => id != null);
      if (prLineIds.length > 0) {
        const prLines = await prisma.prLine.findMany({
          where: { id: { in: prLineIds as number[] } },
          include: { pr: true }
        });
        
        for (const line of prLines) {
          if (line.pr.approvalStatus !== 'APPROVED') {
            throw new AppError(`Cannot create PO: PR ${line.pr.prNo} is not APPROVED. Current status: ${line.pr.approvalStatus}`, 400);
          }
        }
      }

      const poNo = await generatePoNo();
      
      let totalAmount = 0;
      const lines = data.lines.map((l, index) => {
        const lineTotal = (l.orderedQty * l.unitPrice) + l.taxAmount - l.discountAmount;
        totalAmount += lineTotal;
        return { ...l, lineNo: index + 1 };
      });

      const po = await prisma.$transaction(async (tx) => {
        const newPo = await tx.poHeader.create({
          data: {
            poNo,
            vendorId: data.vendorId,
            poType: data.poType,
            expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : undefined,
            paymentTerms: data.paymentTerms,
            currencyCode: data.currencyCode,
            notes: data.notes,
            totalAmount,
            createdById: (req as any).user?.id,
            lines: { create: lines },
          },
          include: { lines: true },
        });

        // Update PR lines if linked
        for (const line of lines) {
          if (line.prLineId) {
            await tx.prLine.update({
              where: { id: line.prLineId },
              data: { lineStatus: 'CONVERTED' },
            });

            // Update AssetProcurementLink
            const prLineData = await tx.prLine.findUnique({ where: { id: line.prLineId } });
            if (prLineData) {
              await tx.assetProcurementLink.updateMany({
                where: { prId: prLineData.prId },
                data: { poId: newPo.id, poNo: newPo.poNo }
              });
            }
          }
        }

        return newPo;
      });

      res.status(201).json({ success: true, data: po });
    } catch (error) {
      next(error);
    }
  },

  getPos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pos = await prisma.poHeader.findMany({
        orderBy: { poDate: 'desc' },
        include: { vendor: { select: { name: true } } },
      });
      res.json({ success: true, data: pos });
    } catch (error) {
      next(error);
    }
  },

  getPoById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const po = await prisma.poHeader.findUnique({
        where: { id: Number(id) },
        include: {
          vendor: true,
          lines: true,
        },
      });
      if (!po) throw new AppError('PO not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: po });
    } catch (error) {
      next(error);
    }
  },

  approvePo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const po = await prisma.poHeader.update({
        where: { id: Number(id) },
        data: { approvalStatus: 'APPROVED', poStatus: 'OPEN' },
      });
      res.json({ success: true, data: po, message: 'PO approved' });
    } catch (error) {
      next(error);
    }
  },
};
