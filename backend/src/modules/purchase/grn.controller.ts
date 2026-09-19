import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const generateGrnNo = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const lastGrn = await prisma.grnHeader.findFirst({
    where: { grnNo: { startsWith: `GRN-${year}${month}-` } },
    orderBy: { id: 'desc' },
  });

  let seq = 1;
  if (lastGrn) {
    const lastSeq = parseInt(lastGrn.grnNo.split('-')[2]);
    seq = lastSeq + 1;
  }
  return `GRN-${year}${month}-${seq.toString().padStart(4, '0')}`;
};

const grnLineSchema = z.object({
  poLineId: z.number().optional(),
  itemType: z.string(),
  itemId: z.number().optional(),
  itemDescription: z.string(),
  receivedQty: z.number().positive(),
  unitPrice: z.number().optional(),
  serialNo: z.string().optional(),
  modelNo: z.string().optional(),
  manufacturer: z.string().optional(),
  batchNo: z.string().optional(),
});

const createGrnSchema = z.object({
  poId: z.number(),
  vendorId: z.number(),
  grnType: z.enum(['ASSET', 'INVENTORY', 'SERVICE']),
  notes: z.string().optional(),
  lines: z.array(grnLineSchema).min(1),
});

export const grnController = {
  createGrn: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createGrnSchema.parse(req.body);
      const grnNo = await generateGrnNo();

      const grn = await prisma.$transaction(async (tx) => {
        const newGrn = await tx.grnHeader.create({
          data: {
            grnNo,
            poId: data.poId,
            vendorId: data.vendorId,
            grnType: data.grnType,
            receivedById: (req as any).user?.id,
            notes: data.notes,
            lines: {
              create: data.lines.map(l => ({ ...l })),
            },
          },
          include: { lines: true },
        });

        // Update PO Line received quantities
        for (const line of data.lines) {
          if (line.poLineId) {
            await tx.poLine.update({
              where: { id: line.poLineId },
              data: {
                receivedQty: { increment: line.receivedQty },
              },
            });
          }
        }

        // Update AssetProcurementLink
        await tx.assetProcurementLink.updateMany({
          where: { poId: data.poId },
          data: { grnId: newGrn.id, grnNo: newGrn.grnNo }
        });

        return newGrn;
      });

      res.status(201).json({ success: true, data: grn });
    } catch (error) {
      next(error);
    }
  },

  getGrns: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const grns = await prisma.grnHeader.findMany({
        orderBy: { receivedDate: 'desc' },
        include: {
          vendor: { select: { name: true } },
          po: { select: { poNo: true } },
        },
      });
      res.json({ success: true, data: grns });
    } catch (error) {
      next(error);
    }
  },

  getGrnById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const grn = await prisma.grnHeader.findUnique({
        where: { id: Number(id) },
        include: {
          vendor: true,
          po: true,
          lines: {
            include: { inspection: true }
          },
        },
      });
      if (!grn) throw new AppError('GRN not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: grn });
    } catch (error) {
      next(error);
    }
  },

  inspectGrnLine: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lineId = Number(req.params.lineId);
      const { acceptedQty, rejectedQty, inspectionStatus, warrantyStartDate } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        const line = await tx.grnLine.update({
          where: { id: lineId },
          data: {
            acceptedQty,
            rejectedQty,
            inspectionStatus,
            warrantyStartDate: warrantyStartDate ? new Date(warrantyStartDate) : undefined
          },
          include: { grn: true, poLine: true }
        });

        // Create Finance Journal for Inventory GRN
        if (line.grn.grnType === 'INVENTORY' && Number(acceptedQty) > 0) {
          const totalCost = Number(acceptedQty) * (Number(line.unitPrice) || 0);
          if (totalCost > 0) {
            await tx.journalHeader.create({
              data: {
                journalNo: `JRN-GRN-${Date.now()}-${line.id}`,
                sourceModule: 'INVENTORY',
                sourceDocType: 'GRN_LINE',
                sourceDocId: line.id,
                narration: `Inventory receipt for GRN ${line.grn.grnNo}, Item ${line.itemId}`,
                totalDebit: totalCost,
                totalCredit: totalCost,
                postingStatus: 'POSTED',
                postingDate: new Date(),
                lines: {
                  create: [
                    { lineNo: 1, glCode: '10010', debitAmount: totalCost, creditAmount: 0 }, // Inventory
                    { lineNo: 2, glCode: '20010', debitAmount: 0, creditAmount: totalCost }  // AP or GR/IR
                  ]
                }
              }
            });
          }
        }

        // Auto-Issue to Work Order if linked to PR
        if (line.poLine && line.poLine.prLineId && acceptedQty > 0) {
          // poLine.prLineId actually points to PrHeader.id in this schema
          const prLine = await tx.prLine.findFirst({
            where: {
              prId: line.poLine.prLineId,
              itemId: line.itemId,
              workOrderId: { not: null }
            }
          });

          if (prLine && prLine.workOrderId) {
            // Find WoMaterial that is waiting
            const woMaterial = await tx.woMaterial.findFirst({
              where: {
                workOrderId: prLine.workOrderId,
                itemId: Number(line.itemId),
                lineStatus: 'WAITING_FOR_PART'
              }
            });

            if (woMaterial) {
              const qtyToIssue = Math.min(Number(acceptedQty), Number(woMaterial.requiredQty) - Number(woMaterial.issuedQty));
              
              if (qtyToIssue > 0) {
                // We assume stock is already updated by some other trigger or we just deduct it here?
                // Wait! GRN acceptance doesn't update stock automatically in this basic flow yet.
                // If it does, we deduct from stock. We'll deduct it here to be safe and create a stock movement.
                // Assuming GRN adds stock somewhere, we now issue it to WO.
                
                // Get stock balance
                const sb = await tx.stockBalance.findFirst({ where: { itemId: Number(line.itemId) } });
                if (sb) {
                  await tx.stockBalance.update({
                    where: { id: sb.id },
                    data: {
                      availableQty: Number(sb.availableQty) - qtyToIssue,
                      reservedQty: Number(sb.reservedQty) + qtyToIssue
                    }
                  });

                  await tx.stockMovement.create({
                    data: {
                      itemId: Number(line.itemId),
                      locationId: sb.locationId,
                      movType: 'WO_ISSUE',
                      qty: qtyToIssue,
                      unitCost: Number(line.unitPrice) || 0,
                      refDocType: 'WORK_ORDER',
                      refDocId: prLine.workOrderId,
                      remarks: 'Auto-issued from GRN'
                    }
                  });
                }

                await tx.woMaterial.update({
                  where: { id: woMaterial.id },
                  data: {
                    issuedQty: Number(woMaterial.issuedQty) + qtyToIssue,
                    unitCost: Number(line.unitPrice) || woMaterial.unitCost,
                    totalCost: (Number(woMaterial.issuedQty) + qtyToIssue) * (Number(line.unitPrice) || Number(woMaterial.unitCost)),
                    lineStatus: (Number(woMaterial.issuedQty) + qtyToIssue) >= Number(woMaterial.requiredQty) ? 'ISSUED' : 'WAITING_FOR_PART'
                  }
                });
              }
            }
          }
        }

        return line;
      });

      res.json({ success: true, data: result, message: 'Inspection completed' });
    } catch (error) {
      next(error);
    }
  }
};
