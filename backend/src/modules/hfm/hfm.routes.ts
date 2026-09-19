import { Router } from 'express';
import { hfmController } from './hfm.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

// Utility Monitoring
router.get('/utilities/meters', authorize(['ADMIN', 'MAINTENANCE:READ']), hfmController.getUtilityMeters);
router.post('/utilities/readings', authorize(['ADMIN', 'MAINTENANCE:CREATE']), hfmController.addUtilityReading);

// Waste Management
router.get('/waste/logs', authorize(['ADMIN', 'MAINTENANCE:READ']), hfmController.getWasteLogs);
router.post('/waste/logs', authorize(['ADMIN', 'MAINTENANCE:CREATE']), hfmController.addWasteLog);

// Compliance Audits
router.get('/compliance/audits', authorize(['ADMIN', 'MAINTENANCE:READ']), hfmController.getAudits);

export default router;
