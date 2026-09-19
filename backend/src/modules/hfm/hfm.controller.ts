import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail, emailTemplates } from '../../utils/email';

const prisma = new PrismaClient();

export const hfmController = {
  // UTILITIES
  getUtilityMeters: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meters = await prisma.utilityMeter.findMany({
        include: { location: { select: { name: true } } }
      });
      res.json({ success: true, data: meters });
    } catch (error) { next(error); }
  },

  addUtilityReading: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { meterId, readingDate, readingValue } = req.body;
      const meter = await prisma.utilityMeter.findUnique({ where: { id: meterId } });
      if (!meter) return res.status(404).json({ success: false, message: 'Meter not found' });

      // Find previous reading to compute consumption
      const previousReading = await prisma.utilityReading.findFirst({
        where: { meterId, readingDate: { lt: new Date(readingDate) } },
        orderBy: { readingDate: 'desc' }
      });

      const consumption = previousReading
        ? parseFloat(readingValue) - parseFloat(previousReading.readingValue as any)
        : 0;

      const reading = await prisma.utilityReading.create({
        data: {
          meterId,
          readingDate: new Date(readingDate),
          readingValue,
          consumption,
          recordedById: (req as any).user?.id
        }
      });

      // Threshold check & alert
      if (meter.minThreshold && readingValue < (meter.minThreshold as any)) {
        await prisma.notification.create({
          data: {
            userId: 1,
            type: 'ALERT',
            title: `Low Utility Threshold: ${meter.meterNo}`,
            message: `${meter.utilityType} reading ${readingValue} is below minimum threshold ${meter.minThreshold}.`
          }
        });
        // Send real email
        const alertEmail = process.env.ALERT_EMAIL || '';
        if (alertEmail) {
          const template = emailTemplates.utilityThresholdAlert(
            meter.meterNo, meter.utilityType, Number(readingValue), Number(meter.minThreshold), 'LOW'
          );
          await sendEmail({ to: alertEmail, ...template });
        }
      }
      if (meter.maxThreshold && readingValue > (meter.maxThreshold as any)) {
        await prisma.notification.create({
          data: {
            userId: 1,
            type: 'WARNING',
            title: `High Utility Threshold: ${meter.meterNo}`,
            message: `${meter.utilityType} reading ${readingValue} exceeds maximum threshold ${meter.maxThreshold}.`
          }
        });
        // Send real email
        const alertEmail = process.env.ALERT_EMAIL || '';
        if (alertEmail) {
          const template = emailTemplates.utilityThresholdAlert(
            meter.meterNo, meter.utilityType, Number(readingValue), Number(meter.maxThreshold), 'HIGH'
          );
          await sendEmail({ to: alertEmail, ...template });
        }
      }

      res.json({ success: true, data: reading });
    } catch (error) { next(error); }
  },

  // WASTE MANAGEMENT
  getWasteLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await prisma.wasteLog.findMany({
        include: { category: true, location: { select: { name: true } } },
        orderBy: { loggedAt: 'desc' },
        take: 50
      });
      res.json({ success: true, data: logs });
    } catch (error) { next(error); }
  },

  addWasteLog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId, locationId, weightKg } = req.body;
      const log = await prisma.wasteLog.create({
        data: {
          categoryId,
          locationId,
          weightKg,
          loggedById: (req as any).user?.id
        }
      });
      res.json({ success: true, data: log });
    } catch (error) { next(error); }
  },

  // COMPLIANCE
  getAudits: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const audits = await prisma.complianceAudit.findMany({
        include: { findings: true },
        orderBy: { auditDate: 'desc' }
      });
      res.json({ success: true, data: audits });
    } catch (error) { next(error); }
  }
};
