import { Router } from 'express';
import { authenticate } from './middleware/auth.middleware';
import authRoutes from './modules/auth/auth.routes';
import purchaseRoutes from './modules/purchase/purchase.routes';
import financeRoutes from './modules/finance/finance.routes';
import maintenanceRoutes from './modules/maintenance/maintenance.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import reportRoutes from './modules/reports/report.routes';
import systemRoutes from './modules/system/system.routes';
import hfmRoutes from './modules/hfm/hfm.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import aiRoutes from './modules/ai/ai.routes';

const router = Router();

// ── Auth ─────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// Apply authentication to all subsequent routes
router.use(authenticate);

// ── Purchase ─────────────────────────────────────────────────
router.use('/purchase', purchaseRoutes);

// ── Finance & Assets ─────────────────────────────────────────
router.use('/finance', financeRoutes);

// ── Maintenance & Equipment ──────────────────────────────────
router.use('/maintenance', maintenanceRoutes);

// ── Inventory ────────────────────────────────────────────────
router.use('/inventory', inventoryRoutes);

// ── Reports ──────────────────────────────────────────────────
router.use('/reports', reportRoutes);

// ── System ───────────────────────────────────────────────────
router.use('/system', systemRoutes);

// ── Hospital Facility Management (HFM) ───────────────────────
router.use('/hfm', hfmRoutes);

// ── Analytics ────────────────────────────────────────────────
router.use('/analytics', analyticsRoutes);

// ── AI ───────────────────────────────────────────────────────
router.use('/ai', aiRoutes);

// ── API Info ──────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    service: 'AssetIQ Enterprise Asset Management API',
    version: '1.0.0',
    modules: [
      'auth',
      'equipment',
      'purchase/pr',
      'purchase/po',
      'purchase/grn',
      'inventory',
      'work-orders',
      'pm-plans',
      'calibration',
      'finance/assets',
      'finance/journals',
      'finance/depreciation',
      'rcm',
      'reports',
      'settings',
    ],
  });
});

export default router;
