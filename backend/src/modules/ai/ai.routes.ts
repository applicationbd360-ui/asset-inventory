import { Router } from 'express';
import { aiController } from './ai.controller';
import { authorize } from '../../middleware/auth.middleware';

const router = Router();

// ── AI Chat ──────────────────────────────────────────────────
router.post('/chat', authorize(['ADMIN', 'MAINTENANCE:READ', 'FINANCE:READ', 'INVENTORY:READ']), aiController.handleChatQuery);

export default router;
