import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../../middleware/error.middleware';

const prisma = new PrismaClient();

const generateWoCode = async () => {
  const lastWo = await prisma.workOrder.findFirst({
    orderBy: { id: 'desc' },
  });
  let seq = 1;
  if (lastWo) {
    seq = parseInt(lastWo.woNo.replace('WO-', '')) + 1;
  }
  return `WO-${seq.toString().padStart(6, '0')}`;
};

const woSchema = z.object({
  equipmentId: z.number().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  woType: z.enum(['BREAKDOWN', 'PREVENTIVE', 'CALIBRATION', 'INSPECTION']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  assignedToId: z.number().optional(),
  scheduledDate: z.string().optional(),
});

export const workorderController = {
  getWorkOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wos = await prisma.workOrder.findMany({
        include: {
          equipment: { select: { equipmentCode: true, name: true } },
          assignedTo: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, data: wos });
    } catch (error) {
      next(error);
    }
  },

  getWorkOrderById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const wo = await prisma.workOrder.findUnique({
        where: { id: Number(id) },
        include: {
          equipment: { include: { category: true } },
          labor: true,
          materials: { include: { item: true } },
          services: true,
          costSummary: true,
        },
      });
      res.json({ success: true, data: wo });
    } catch (error) {
      next(error);
    }
  },

  createCommissioningWo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { equipmentId } = req.body;
      const count = await prisma.workOrder.count();
      const woNo = `WO-COM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
      const defaultChecklist = [
        { id: 1, text: 'Equipment physically installed', isCompleted: false },
        { id: 2, text: 'Power/utility connection verified', isCompleted: false },
        { id: 3, text: 'Safety check completed', isCompleted: false },
        { id: 4, text: 'Calibration verified', isCompleted: false },
        { id: 5, text: 'User training completed', isCompleted: false },
        { id: 6, text: 'Warranty activated', isCompleted: false },
        { id: 7, text: 'Manual/document uploaded', isCompleted: false },
        { id: 8, text: 'Preventive maintenance plan assigned', isCompleted: false },
        { id: 9, text: 'Handover accepted by department', isCompleted: false },
      ];
      const wo = await prisma.workOrder.create({
        data: {
          woNo,
          orderType: 'COMMISSIONING',
          equipmentId,
          status: 'ASSIGNED',
          priority: 'HIGH',
          problemDesc: 'New Asset Installation & Commissioning',
          checklist: defaultChecklist,
        },
      });
      res.status(201).json({ success: true, data: wo });
    } catch (error) {
      next(error);
    }
  },

  updateWoChecklist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { checklist, status } = req.body;
      const result = await prisma.$transaction(async (tx) => {
        const wo = await tx.workOrder.update({
          where: { id: Number(id) },
          data: { checklist, status },
          include: { equipment: true },
        });
        if (wo.orderType === 'COMMISSIONING' && status === 'COMPLETED') {
          await tx.equipment.update({
            where: { id: wo.equipmentId },
            data: { status: 'ACTIVE', installDate: new Date() },
          });
        }
        return wo;
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  createWorkOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = woSchema.parse(req.body);
      const woNo = await generateWoCode();
      const wo = await prisma.workOrder.create({
        data: {
          woNo,
          equipmentId: Number(data.equipmentId),
          problemDesc: data.title + (data.description ? ' - ' + data.description : ''),
          orderType: data.woType || 'CORRECTIVE',
          priority: data.priority,
          status: 'CREATED',
          assignedToId: data.assignedToId,
          plannedDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        },
      });
      res.status(201).json({ success: true, data: wo });
    } catch (error) {
      next(error);
    }
  },

  updateWorkOrderStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, completionNotes } = req.body;
      const wo = await prisma.workOrder.update({
        where: { id: Number(id) },
        data: {
          status,
          completionNotes,
          completedAt: status === 'COMPLETED' ? new Date() : undefined,
        },
      });
      res.json({ success: true, data: wo });
    } catch (error) {
      next(error);
    }
  },

  addLabor: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const labor = await prisma.woLabor.create({
        data: {
          workOrderId: Number(id),
          employeeName: data.employeeName,
          craftType: data.craftType,
          hoursWorked: data.hoursWorked,
          hourlyRate: data.hourlyRate,
          laborCost: Number(data.hoursWorked) * Number(data.hourlyRate),
          workDate: data.workDate ? new Date(data.workDate) : new Date(),
          remarks: data.remarks,
        },
      });
      res.status(201).json({ success: true, data: labor });
    } catch (error) {
      next(error);
    }
  },

  addMaterial: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const itemId = Number(data.itemId);
      const reqQty = Number(data.requiredQty);

      const result = await prisma.$transaction(async (tx) => {
        const item = await tx.item.findUnique({ where: { id: itemId } });
        const unitCost = item ? Number(item.unitCost) : 0;

        const stockBalances = await tx.stockBalance.findMany({
          where: { itemId },
          orderBy: { availableQty: 'desc' },
        });

        const totalAvailable = stockBalances.reduce((sum, sb) => sum + Number(sb.availableQty), 0);

        if (totalAvailable >= reqQty) {
          let remainingToFulfill = reqQty;
          for (const sb of stockBalances) {
            if (remainingToFulfill <= 0) break;
            const available = Number(sb.availableQty);
            if (available > 0) {
              const toTake = Math.min(available, remainingToFulfill);
              await tx.stockBalance.update({
                where: { id: sb.id },
                data: {
                  availableQty: available - toTake,
                  reservedQty: Number(sb.reservedQty) + toTake,
                },
              });
              await tx.stockMovement.create({
                data: {
                  itemId,
                  locationId: sb.locationId,
                  movType: 'WO_ISSUE',
                  qty: toTake,
                  unitCost,
                  refDocType: 'WORK_ORDER',
                  refDocId: Number(id),
                  remarks: 'Auto-issued for WO',
                },
              });
              remainingToFulfill -= toTake;
            }
          }
          const material = await tx.woMaterial.create({
            data: {
              workOrderId: Number(id),
              itemId,
              requiredQty: reqQty,
              issuedQty: reqQty,
              unitCost,
              totalCost: reqQty * unitCost,
              lineStatus: 'ISSUED',
              issuedAt: new Date(),
            },
          });
          return { material, prGenerated: false };
        } else {
          const missingQty = reqQty - totalAvailable;
          let remainingToFulfill = totalAvailable;
          if (totalAvailable > 0) {
            for (const sb of stockBalances) {
              if (remainingToFulfill <= 0) break;
              const available = Number(sb.availableQty);
              if (available > 0) {
                const toTake = Math.min(available, remainingToFulfill);
                await tx.stockBalance.update({
                  where: { id: sb.id },
                  data: {
                    availableQty: available - toTake,
                    reservedQty: Number(sb.reservedQty) + toTake,
                  },
                });
                await tx.stockMovement.create({
                  data: {
                    itemId,
                    locationId: sb.locationId,
                    movType: 'WO_ISSUE',
                    qty: toTake,
                    unitCost,
                    refDocType: 'WORK_ORDER',
                    refDocId: Number(id),
                    remarks: 'Partial issue for WO',
                  },
                });
                remainingToFulfill -= toTake;
              }
            }
          }
          const material = await tx.woMaterial.create({
            data: {
              workOrderId: Number(id),
              itemId,
              requiredQty: reqQty,
              issuedQty: totalAvailable,
              unitCost,
              totalCost: totalAvailable * unitCost,
              lineStatus: 'WAITING_FOR_PART',
            },
          });
          const count = await tx.prHeader.count();
          const prNo = `PR-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
          await tx.prHeader.create({
            data: {
              prNo,
              departmentId: 1,
              sourceModule: 'MAINTENANCE',
              prType: 'STANDARD',
              requestedById: 1,
              approvalStatus: 'APPROVED',
              lines: {
                create: [{
                  lineNo: 1,
                  itemType: 'INVENTORY_ITEM',
                  itemId,
                  itemDescription: item ? item.name : `Item #${itemId}`,
                  quantity: missingQty,
                  estimatedUnitPrice: unitCost,
                  workOrderId: Number(id),
                  lineStatus: 'OPEN',
                }],
              },
            },
          });
          return { material, prGenerated: true, missingQty, prNo };
        }
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  addService: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const service = await prisma.woService.create({
        data: {
          workOrderId: Number(id),
          serviceDescription: data.serviceDescription,
          serviceAmount: data.serviceAmount,
          serviceDate: data.serviceDate ? new Date(data.serviceDate) : new Date(),
          remarks: data.remarks,
          serviceEntryStatus: 'VERIFIED',
        },
      });
      res.status(201).json({ success: true, data: service });
    } catch (error) {
      next(error);
    }
  },

  closeWorkOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const woId = Number(id);

      const result = await prisma.$transaction(async (tx) => {
        const labors = await tx.woLabor.findMany({ where: { workOrderId: woId } });
        const materials = await tx.woMaterial.findMany({ where: { workOrderId: woId } });
        const services = await tx.woService.findMany({ where: { workOrderId: woId } });

        const laborCost = labors.reduce((sum, l) => sum + Number(l.laborCost), 0);
        const materialCost = materials.reduce((sum, m) => sum + Number(m.totalCost), 0);
        const serviceCost = services.reduce((sum, s) => sum + Number(s.serviceAmount), 0);
        const totalCost = laborCost + materialCost + serviceCost;

        if (totalCost <= 0) {
          throw new AppError('Work Order closure requires valid cost capture (Labor, Material, or Service)', 400);
        }

        await tx.woCostSummary.upsert({
          where: { workOrderId: woId },
          update: { laborCost, materialCost, serviceCost, totalCost },
          create: { workOrderId: woId, laborCost, materialCost, serviceCost, totalCost },
        });

        const wo = await tx.workOrder.findUnique({ where: { id: woId } });
        if (totalCost > 0 && wo) {
          const journalNo = `JRN-MNT-${Date.now()}`;
          const lines: any[] = [];
          let currentLine = 1;

          lines.push({ lineNo: currentLine++, glCode: '50010', debitAmount: totalCost, creditAmount: 0 });
          if (laborCost > 0) {
            lines.push({ lineNo: currentLine++, glCode: '20020', debitAmount: 0, creditAmount: laborCost });
          }
          if (materialCost > 0) {
            lines.push({ lineNo: currentLine++, glCode: '10010', debitAmount: 0, creditAmount: materialCost });
          }
          if (serviceCost > 0) {
            lines.push({ lineNo: currentLine++, glCode: '20010', debitAmount: 0, creditAmount: serviceCost });
          }

          await tx.journalHeader.create({
            data: {
              journalNo,
              sourceModule: 'EAM',
              sourceDocType: 'WORK_ORDER',
              sourceDocId: woId,
              narration: `Maintenance cost for WO ${wo.woNo}`,
              totalDebit: totalCost,
              totalCredit: totalCost,
              postingStatus: 'POSTED',
              lines: { create: lines },
            },
          });
        }

        return tx.workOrder.update({
          where: { id: woId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
