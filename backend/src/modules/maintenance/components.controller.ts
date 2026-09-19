import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const componentsController = {
  getEquipmentComponents: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const equipmentId = parseInt(req.params.id as string);
      
      const components = await prisma.equipmentComponent.findMany({
        where: { equipmentId },
        include: {
          item: true,
          workOrder: {
            select: { woNo: true }
          }
        },
        orderBy: { installedAt: 'desc' }
      });
      
      res.json({
        success: true,
        data: components
      });
    } catch (error) {
      next(error);
    }
  },

  addComponent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const equipmentId = parseInt(req.params.id as string);
      const { itemId, serialNo, workOrderId, warrantyEndDate } = req.body;
      const userId = (req as any).user?.userId;

      const component = await prisma.equipmentComponent.create({
        data: {
          equipmentId,
          itemId,
          serialNo,
          workOrderId,
          warrantyEndDate: warrantyEndDate ? new Date(warrantyEndDate) : null,
          installedById: userId
        },
        include: {
          item: true
        }
      });
      
      res.status(201).json({
        success: true,
        message: 'Component installed successfully',
        data: component
      });
    } catch (error) {
      next(error);
    }
  },

  removeComponent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const componentId = parseInt(req.params.id as string);
      const { status = 'REMOVED' } = req.body; // e.g. FAULTY, REMOVED

      const component = await prisma.equipmentComponent.update({
        where: { id: componentId },
        data: {
          status,
          removedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: 'Component removed successfully',
        data: component
      });
    } catch (error) {
      next(error);
    }
  }
};
