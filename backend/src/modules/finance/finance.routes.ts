import { Router } from 'express';
import { assetController } from './asset.controller';
import { journalController } from './journal.controller';
import { depreciationController } from './depreciation.controller';
import { budgetController } from './budget.controller';
import { dashboardController } from './dashboard.controller';
import { amcController } from './amc.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

// ── Dashboard Overview ────────────────────────────────────────
router.get('/dashboard/summary', authorize(['FINANCE:READ', 'MAINTENANCE:READ', 'ADMIN']), dashboardController.getSummary);
router.get('/dashboard/analytics', authorize(['FINANCE:READ', 'MAINTENANCE:READ', 'ADMIN']), dashboardController.getAnalytics);

// ── Fixed Assets ──────────────────────────────────────────────
router.get('/assets', authorize(['FINANCE:READ', 'ADMIN']), assetController.getAssets);
router.get('/assets/pending-capitalization', authorize(['FINANCE:READ', 'ADMIN']), assetController.getPendingCapitalizationAssets);
router.get('/assets/:id', authorize(['FINANCE:READ', 'ADMIN']), assetController.getAssetById);
router.get('/assets/:id/qrcode', authorize(['FINANCE:READ', 'ADMIN']), assetController.getAssetQrCode);
router.post('/assets/capitalize', authorize(['FINANCE:CREATE', 'ADMIN']), assetController.capitalizeAsset);

// ── Depreciation ─────────────────────────────────────────────
router.post('/depreciation/run', authorize(['FINANCE:CREATE', 'ADMIN']), depreciationController.runDepreciation);

// ── AMC ──────────────────────────────────────────────────────
router.post('/amc/advance', authorize(['FINANCE:CREATE', 'ADMIN']), amcController.payAdvance);
router.post('/amc/expense', authorize(['FINANCE:CREATE', 'ADMIN']), amcController.postMonthlyExpense);

// ── Budgets ──────────────────────────────────────────────────
router.get('/budgets', authorize(['FINANCE:READ', 'ADMIN']), budgetController.getBudgets);
router.post('/budgets', authorize(['FINANCE:CREATE', 'ADMIN']), budgetController.allocateBudget);
router.post('/budgets/check', authorize(['FINANCE:READ', 'ADMIN']), budgetController.checkBudgetAvailability);
router.get('/budgets/mro-forecast', authorize(['FINANCE:READ', 'ADMIN']), budgetController.getMroFinancialForecast);

// ── Journals & GL ────────────────────────────────────────────
router.get('/journals', authorize(['FINANCE:READ', 'ADMIN']), journalController.getJournals);
router.post('/journals', authorize(['FINANCE:CREATE', 'ADMIN']), journalController.createJournal);
router.get('/journals/:id', authorize(['FINANCE:READ', 'ADMIN']), journalController.getJournalById);
router.get('/gl-accounts', authorize(['FINANCE:READ', 'ADMIN']), journalController.getChartOfAccounts);
router.get('/asset-classes', authorize(['FINANCE:READ', 'ADMIN']), journalController.getAssetClasses);

export default router;
