import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rmaController = {
  createRma: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendorId, equipmentId, workOrderId, notes, lines } = req.body;
      const userId = (req as any).user?.userId;

      // Generate RMA No
      const count = await prisma.rmaHeader.count();
      const rmaNo = `RMA-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

      const rma = await prisma.rmaHeader.create({
        data: {
          rmaNo,
          vendorId,
          equipmentId,
          workOrderId,
          notes,
          createdById: userId,
          lines: {
            create: lines.map((line: any) => ({
              itemId: line.itemId,
              faultySerialNo: line.faultySerialNo,
              qty: line.qty || 1
            }))
          }
        },
        include: {
          lines: true
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'RMA created successfully',
        data: rma
      });
    } catch (error) {
      next(error);
    }
  },

  updateRmaStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rmaId = parseInt(req.params.id as string);
      const { status } = req.body; // e.g. SHIPPED_TO_VENDOR, RECEIVED_REPLACEMENT, CLOSED

      const rma = await prisma.rmaHeader.update({
        where: { id: rmaId },
        data: { status }
      });
      
      res.json({
        success: true,
        message: `RMA status updated to ${status}`,
        data: rma
      });
    } catch (error) {
      next(error);
    }
  },

  getRmas: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rmas = await prisma.rmaHeader.findMany({
        include: {
          vendor: true,
          equipment: true,
          lines: {
            include: { item: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({
        success: true,
        data: rmas
      });
    } catch (error) {
      next(error);
    }
  }
};
