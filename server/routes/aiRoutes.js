import express from 'express'
import { generateFreelancerDescription, improveProjectDescription } from '../controllers/aiController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router()

router.post('/freelancer-description', requireAuth, requireRole('freelancer'), generateFreelancerDescription)
router.post('/project-description', requireAuth, requireRole('client', 'admin'), improveProjectDescription)

export default router
