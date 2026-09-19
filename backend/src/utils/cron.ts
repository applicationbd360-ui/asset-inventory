import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendEmail, emailTemplates } from './email';

const prisma = new PrismaClient();

export function initCronJobs() {
  console.log('🕒 Initializing Background Jobs (Cron Engine)');

  // 1. SLA Breach Alerts (Runs every 10 minutes)
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('🔍 [CRON] Checking for SLA Breaches...');
      const overdueWorkOrders = await prisma.workOrder.findMany({
        where: {
          status: { notIn: ['COMPLETED', 'CLOSED', 'CANCELLED'] },
          dueDate: { lt: new Date() },
        },
        include: { equipment: true }
      });

      for (const wo of overdueWorkOrders) {
        const equipmentName = wo.equipment?.name || 'General Task';

        // Real Email Alert
        const alertEmail = process.env.ALERT_EMAIL || '';
        if (alertEmail) {
          const template = emailTemplates.slaBreachAlert(wo.woNo, equipmentName);
          await sendEmail({ to: alertEmail, ...template });
        } else {
          console.log(`📱 [SMS/EMAIL ALERT]: WorkOrder ${wo.woNo} for ${equipmentName} has breached SLA!`);
        }

        // System Notification to Admin
        await prisma.notification.create({
          data: {
            userId: 1,
            title: 'SLA Breach Alert',
            message: `Work Order ${wo.woNo} has exceeded its SLA time. Immediate action required.`,
            type: 'ALERT'
          }
        });
      }

      if (overdueWorkOrders.length > 0) {
        console.log(`⚠️ [CRON] Found ${overdueWorkOrders.length} SLA breaches.`);
      }
    } catch (error) {
      console.error('❌ [CRON ERROR] SLA Breach Check failed:', error);
    }
  });

  // 2. Predictive Failure AI-Lite (Runs every day at 1:00 AM)
  cron.schedule('0 1 * * *', async () => {
    try {
      console.log('🤖 [CRON AI] Running Predictive Failure Analytics...');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Find equipments with high breakdown frequency
      const breakdownEquipments = await prisma.workOrder.groupBy({
        by: ['equipmentId'],
        where: {
          orderType: 'BREAKDOWN',
          createdAt: { gte: thirtyDaysAgo },
          equipmentId: { gt: 0 }
        },
        _count: { id: true },
        having: {
          id: { _count: { gte: 3 } } // 3 or more breakdowns in 30 days
        }
      });

      for (const stat of breakdownEquipments) {
        if (!stat.equipmentId) continue;
        
        const equipment = await prisma.equipment.findUnique({ where: { id: stat.equipmentId } });
        if (!equipment) continue;

        console.log(`⚠️ [AI PREDICTION]: High Failure Risk for ${equipment.name} (${equipment.code})`);

        await prisma.notification.create({
          data: {
            userId: 1,
            title: 'AI Prediction: High Risk of Failure',
            message: `${equipment.name} has broken down ${stat._count?.id || 0} times in the last 30 days. Recommend immediate PM overhaul.`,
            type: 'WARNING'
          }
        });
      }
    } catch (error) {
      console.error('❌ [CRON ERROR] Predictive Analytics failed:', error);
    }
  });

  // 3. Preventive Maintenance (PM) Auto-generation (Runs every day at 12:05 AM)
  cron.schedule('5 0 * * *', async () => {
    try {
      console.log('⚙️ [CRON PM] Generating Preventive Maintenance Work Orders...');
      
      const today = new Date();
      const activePlans = await prisma.pmPlan.findMany({
        where: { isActive: true, nextDueDate: { not: null } }
      });

      for (const plan of activePlans) {
        if (!plan.nextDueDate) continue;

        const generateDate = new Date(plan.nextDueDate);
        generateDate.setDate(generateDate.getDate() - (plan.advanceCreateDays || 7));

        if (today >= generateDate) {
          const count = await prisma.workOrder.count();
          const woNo = `WO-PM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
          
          await prisma.workOrder.create({
            data: {
              woNo,
              orderType: plan.orderType || 'PREVENTIVE',
              equipmentId: plan.equipmentId,
              status: 'ASSIGNED',
              priority: 'MEDIUM',
              problemDesc: plan.planName,
              checklist: plan.checklist || [],
              pmPlanId: plan.id,
              plannedDate: plan.nextDueDate
            }
          });

          // Calculate next due date
          const newDueDate = new Date(plan.nextDueDate);
          if (plan.frequencyType === 'CALENDAR_DAYS') {
            newDueDate.setDate(newDueDate.getDate() + plan.frequencyValue);
          } else if (plan.frequencyType === 'CALENDAR_MONTHS') {
            newDueDate.setMonth(newDueDate.getMonth() + plan.frequencyValue);
          }

          await prisma.pmPlan.update({
            where: { id: plan.id },
            data: { nextDueDate: newDueDate, lastCreatedDate: new Date() }
          });

          console.log(`✅ [CRON PM] Generated WO ${woNo} for PM Plan: ${plan.planName}`);

          // Send Real Email Notification
          const alertEmail = process.env.ALERT_EMAIL || '';
          if (alertEmail) {
            const template = emailTemplates.pmWorkOrderCreated(woNo, plan.planName, plan.nextDueDate);
            await sendEmail({ to: alertEmail, ...template });
          }
        }
      }
    } catch (error) {
      console.error('❌ [CRON ERROR] PM Generation failed:', error);
    }
  });
}
