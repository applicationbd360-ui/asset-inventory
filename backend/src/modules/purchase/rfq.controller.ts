import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../middleware/error.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const rfqSchema = z.object({
  prId: z.number(),
  dueDate: z.string(),
  notes: z.string().optional()
});

const quotationSchema = z.object({
  vendorId: z.number(),
  totalAmount: z.number().min(0),
  techCompliance: z.boolean(),
  warrantyYears: z.number().min(0),
  deliveryDays: z.number().min(0),
  amcSupport: z.boolean(),
  complianceScore: z.number().min(0).max(10),
  serviceScore: z.number().min(0).max(10),
  evaluationNotes: z.string().optional()
});

export const rfqController = {
  createRfq: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = rfqSchema.parse(req.body);
      const pr = await prisma.prHeader.findUnique({ where: { id: data.prId } });
      if (!pr) throw new AppError('PR not found', 404);
      if (pr.approvalStatus !== 'APPROVED') throw new AppError('Only Approved PRs can have an RFQ', 400);

      const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const count = await prisma.rfqHeader.count({ where: { rfqNo: { startsWith: `RFQ-${dateStr}` } } });
      const rfqNo = `RFQ-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

      const rfq = await prisma.rfqHeader.create({
        data: {
          rfqNo,
          prId: data.prId,
          dueDate: new Date(data.dueDate),
          notes: data.notes
        },
        include: { pr: true }
      });

      res.status(201).json({ success: true, data: rfq, message: 'RFQ Created successfully' });
    } catch (error) {
      next(error);
    }
  },

  getAllRfqs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rfqs = await prisma.rfqHeader.findMany({
        include: { 
          pr: { select: { prNo: true, department: { select: { name: true } } } },
          _count: { select: { quotations: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: rfqs });
    } catch (error) {
      next(error);
    }
  },

  getRfqById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rfq = await prisma.rfqHeader.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          pr: { include: { lines: true, department: true } },
          quotations: { include: { vendor: true } }
        }
      });
      if (!rfq) throw new AppError('RFQ not found', 404);
      res.json({ success: true, data: rfq });
    } catch (error) {
      next(error);
    }
  },

  addQuotation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rfqId = Number(req.params.id);
      const data = quotationSchema.parse(req.body);

      const rfq = await prisma.rfqHeader.findUnique({ where: { id: rfqId } });
      if (!rfq) throw new AppError('RFQ not found', 404);
      if (rfq.status === 'CLOSED') throw new AppError('RFQ is already closed', 400);

      const existing = await prisma.quotation.findFirst({ where: { rfqId, vendorId: data.vendorId } });
      if (existing) {
        const updated = await prisma.quotation.update({
          where: { id: existing.id },
          data
        });
        return res.json({ success: true, data: updated, message: 'Quotation updated' });
      }

      const quotation = await prisma.quotation.create({
        data: { ...data, rfqId }
      });
      
      if (rfq.status === 'OPEN') {
        await prisma.rfqHeader.update({ where: { id: rfqId }, data: { status: 'EVALUATING' } });
      }

      res.status(201).json({ success: true, data: quotation, message: 'Quotation added successfully' });
    } catch (error) {
      next(error);
    }
  },

  selectVendor: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rfqId = Number(req.params.id);
      const { quotationId } = req.body;

      const quotation = await prisma.quotation.findUnique({ where: { id: Number(quotationId) }, include: { rfq: true } });
      if (!quotation || quotation.rfqId !== rfqId) throw new AppError('Invalid quotation', 400);

      const result = await prisma.$transaction(async (tx) => {
        await tx.quotation.updateMany({ where: { rfqId }, data: { isSelected: false } });
        await tx.quotation.update({ where: { id: quotation.id }, data: { isSelected: true } });
        await tx.rfqHeader.update({ where: { id: rfqId }, data: { status: 'CLOSED' } });

        const pr = await tx.prHeader.findUnique({ where: { id: quotation.rfq.prId }, include: { lines: true } });
        if (!pr) throw new AppError('PR not found', 404);

        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        const count = await tx.poHeader.count({ where: { poNo: { startsWith: `PO-${dateStr}` } } });
        const poNo = `PO-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

        const po = await tx.poHeader.create({
          data: {
            poNo,
            vendorId: quotation.vendorId,
            poType: pr.prType,
            poStatus: 'OPEN',
            approvalStatus: 'DRAFT',
            totalAmount: quotation.totalAmount,
            warrantyTerms: quotation.warrantyYears > 0 ? `${quotation.warrantyYears} Years` : null,
            notes: `Generated from RFQ ${quotation.rfq.rfqNo}`,
            lines: {
              create: pr.lines.map((line, idx) => ({
                lineNo: idx + 1,
                prLineId: line.id,
                itemType: line.itemType,
                itemId: line.itemId,
                itemDescription: line.itemDescription,
                orderedQty: line.quantity,
                unitPrice: line.estimatedUnitPrice || 0
              }))
            }
          }
        });

        await tx.prHeader.update({ where: { id: pr.id }, data: { prStatus: 'CONVERTED_TO_PO' } });
        return po;
      });

      res.json({ success: true, data: result, message: 'Vendor Selected and PO Draft Created!' });
    } catch (error) {
      next(error);
    }
  }
};
