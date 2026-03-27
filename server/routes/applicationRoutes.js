import express from 'express';
import { 
    makeBid, 
    fetchApplications, 
    approveApplication, 
    rejectApplication 
} from '../controllers/applicationController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/bid', requireAuth, requireRole('freelancer'), makeBid);
router.get('/', requireAuth, fetchApplications);
router.post('/approve/:id', requireAuth, requireRole('client', 'admin'), approveApplication);
router.post('/reject/:id', requireAuth, requireRole('client', 'admin'), rejectApplication);

export default router;
