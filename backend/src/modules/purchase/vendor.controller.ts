import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const vendorSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  taxId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const vendorController = {
  createVendor: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = vendorSchema.parse(req.body);
      const exists = await prisma.vendor.findUnique({ where: { code: data.code } });
      if (exists) throw new AppError('Vendor code already exists', 400, 'DUPLICATE_CODE');

      const vendor = await prisma.vendor.create({ data });
      res.status(201).json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  },

  getVendors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendors = await prisma.vendor.findMany({
        orderBy: { name: 'asc' },
      });
      res.json({ success: true, data: vendors });
    } catch (error) {
      next(error);
    }
  },

  getVendorById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const vendor = await prisma.vendor.findUnique({ where: { id: Number(id) } });
      if (!vendor) throw new AppError('Vendor not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  },

  updateVendor: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = vendorSchema.partial().parse(req.body);
      
      const vendor = await prisma.vendor.update({
        where: { id: Number(id) },
        data,
      });
      res.json({ success: true, data: vendor });
    } catch (error) {
      if ((error as any).code === 'P2025') {
        next(new AppError('Vendor not found', 404, 'NOT_FOUND'));
      } else {
        next(error);
      }
    }
  },
};
