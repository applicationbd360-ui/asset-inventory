import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/AppError';

export const pmController = {
  // Get all PM Plans
  getPmPlans: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pmPlans = await prisma.pmPlan.findMany({
        include: {
          equipment: {
            select: { name: true, code: true, flocId: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: pmPlans });
    } catch (error) {
      next(error);
    }
  },

  // Get single PM Plan
  getPmPlanById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pmPlan = await prisma.pmPlan.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          equipment: true,
          workOrders: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
      });

      if (!pmPlan) {
        throw new AppError('PM Plan not found', 404);
      }

      res.json({ success: true, data: pmPlan });
    } catch (error) {
      next(error);
    }
  },

  // Create new PM Plan
  createPmPlan: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        equipmentId,
        planName,
        orderType,
        frequencyType,
        frequencyValue,
        calibFreqMonths,
        checklist,
        responsibleTeam,
        advanceCreateDays,
        nextDueDate
      } = req.body;

      const newPmPlan = await prisma.pmPlan.create({
        data: {
          equipmentId: Number(equipmentId),
          planName,
          orderType: orderType || 'PREVENTIVE',
          frequencyType,
          frequencyValue: Number(frequencyValue),
          calibFreqMonths: calibFreqMonths ? Number(calibFreqMonths) : null,
          checklist: checklist || [],
          responsibleTeam,
          advanceCreateDays: advanceCreateDays ? Number(advanceCreateDays) : 7,
          nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
          isActive: true
        },
      });

      res.status(201).json({ success: true, data: newPmPlan });
    } catch (error) {
      next(error);
    }
  },

  // Update PM Plan
  updatePmPlan: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        planName,
        frequencyType,
        frequencyValue,
        calibFreqMonths,
        checklist,
        responsibleTeam,
        advanceCreateDays,
        nextDueDate,
        isActive
      } = req.body;

      const updatedPmPlan = await prisma.pmPlan.update({
        where: { id: Number(req.params.id) },
        data: {
          ...(planName && { planName }),
          ...(frequencyType && { frequencyType }),
          ...(frequencyValue !== undefined && { frequencyValue: Number(frequencyValue) }),
          ...(calibFreqMonths !== undefined && { calibFreqMonths: calibFreqMonths ? Number(calibFreqMonths) : null }),
          ...(checklist && { checklist }),
          ...(responsibleTeam && { responsibleTeam }),
          ...(advanceCreateDays !== undefined && { advanceCreateDays: Number(advanceCreateDays) }),
          ...(nextDueDate && { nextDueDate: new Date(nextDueDate) }),
          ...(isActive !== undefined && { isActive })
        },
      });

      res.json({ success: true, data: updatedPmPlan });
    } catch (error) {
      next(error);
    }
  },
  
  // Delete PM Plan
  deletePmPlan: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.pmPlan.delete({
        where: { id: Number(req.params.id) },
      });
      res.json({ success: true, message: 'PM Plan deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};
