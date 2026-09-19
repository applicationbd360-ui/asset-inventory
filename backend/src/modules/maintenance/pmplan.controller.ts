import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const pmPlanSchema = z.object({
  equipmentId: z.number(),
  planName: z.string().min(1),
  frequencyType: z.enum(['CALENDAR_DAYS', 'CALENDAR_MONTHS', 'OPERATING_HOURS']),
  frequencyValue: z.number().min(1),
  checklist: z.array(z.any()).optional(),
  calibFreqMonths: z.number().optional().nullable(),
  responsibleTeam: z.string().optional().nullable(),
  advanceCreateDays: z.number().optional().nullable(),
  nextDueDate: z.string().optional(), // ISO String
});

export const pmplanController = {
  createPmPlan: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = pmPlanSchema.parse(req.body);
      
      const plan = await prisma.pmPlan.create({
        data: {
          equipmentId: data.equipmentId,
          planName: data.planName,
          frequencyType: data.frequencyType,
          frequencyValue: data.frequencyValue,
          checklist: data.checklist || [],
          calibFreqMonths: data.calibFreqMonths,
          responsibleTeam: data.responsibleTeam,
          advanceCreateDays: data.advanceCreateDays || 7,
          nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : new Date(),
        }
      });
      
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      next(error);
    }
  },

  getPmPlansByEquipment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { equipmentId } = req.params;
      const plans = await prisma.pmPlan.findMany({
        where: { equipmentId: Number(equipmentId), isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  },

  getAllPmPlans: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await prisma.pmPlan.findMany({
        where: { isActive: true },
        include: { equipment: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  }
};
