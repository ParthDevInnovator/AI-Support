import { Router } from 'express';
import { setupOrganization } from '../controllers/org.controller';
import { requireAuth } from '../middleware/auth';

const router: Router = Router();

// Organization Setup (Onboarding)
router.post('/setup', requireAuth, setupOrganization);

export default router;
