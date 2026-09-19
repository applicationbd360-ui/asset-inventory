import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

// Require admin or analytics-specific permissions for these insights
router.get('/costs-by-work-center', authorize(['ADMIN', 'FINANCE:READ']), analyticsController.getCostsByWorkCenter);
router.get('/damages-by-cause', authorize(['ADMIN', 'MAINTENANCE:READ']), analyticsController.getDamagesByCause);
router.get('/orders-for-planning', authorize(['ADMIN', 'MAINTENANCE:READ']), analyticsController.getOrdersForPlanning);

export default router;
