import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { AppError } from '../../middleware/error.middleware';

const prisma = new PrismaClient();

export const equipmentController = {
  getEquipments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const equipments = await prisma.equipment.findMany({
        include: {
          category: true,
          fixedAsset: { select: { faNo: true, capitalizationDate: true } },
          costCenter: true,
          floc: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, data: equipments });
    } catch (error) {
      next(error);
    }
  },

  getEquipmentById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const equipment = await prisma.equipment.findUnique({
        where: { id: Number(id) },
        include: {
          category: true,
          fixedAsset: true,
          workOrders: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          pmPlans: true,
          floc: true,
          vendor: true,
        },
      });
      res.json({ success: true, data: equipment });
    } catch (error) {
      next(error);
    }
  },

  updateEquipment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { flocId, criticality, warrantyEndDate, calibRequired, pmRequired, status } = req.body;

      // System Controls for Equipment Activation
      if (status === 'ACTIVE') {
        // 1. No equipment activation without commissioning
        const commWo = await prisma.workOrder.findFirst({
          where: { equipmentId: Number(id), orderType: 'COMMISSIONING', status: 'COMPLETED' } // or 'CLOSED'
        });
        
        // Let's assume CLOSED or COMPLETED is acceptable
        const isCommissioned = await prisma.workOrder.findFirst({
          where: { equipmentId: Number(id), orderType: 'COMMISSIONING', status: { in: ['COMPLETED', 'CLOSED'] } }
        });

        if (!isCommissioned) {
          throw new AppError('Equipment cannot be activated without a completed Commissioning Work Order', 400);
        }

        // 2. No calibration-required device activation without calibration check
        const eqData = await prisma.equipment.findUnique({ where: { id: Number(id) } });
        const requiresCalibration = calibRequired !== undefined ? calibRequired : eqData?.calibRequired;
        
        if (requiresCalibration) {
          const calib = await prisma.calibration.findFirst({
            where: { equipmentId: Number(id), result: 'PASSED' }
          });
          if (!calib) {
            throw new AppError('Equipment cannot be activated: Calibration required but no PASSED calibration record found', 400);
          }
        }
      }

      const equipment = await prisma.equipment.update({
        where: { id: Number(id) },
        data: {
          flocId: flocId ? Number(flocId) : undefined,
          criticality,
          warrantyEndDate: warrantyEndDate ? new Date(warrantyEndDate) : undefined,
          calibRequired,
          pmRequired,
          status,
        },
      });
      res.json({ success: true, data: equipment });
    } catch (error) {
      next(error);
    }
  },

  generateEquipmentQr: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const equipment = await prisma.equipment.findUnique({
        where: { id: Number(id) },
        select: { code: true, name: true, serialNo: true }
      });
      if (!equipment) return res.status(404).json({ success: false, message: 'Equipment not found' });

      const qrData = JSON.stringify({
        id,
        code: equipment.code,
        name: equipment.name,
        sn: equipment.serialNo || 'N/A'
      });
      
      const qrCodeBase64 = await QRCode.toDataURL(qrData);
      res.json({ success: true, data: { qrCode: qrCodeBase64 } });
    } catch (error) {
      next(error);
    }
  }
};
