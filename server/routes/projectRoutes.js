import express from 'express';
import { 
    fetchProject, 
    fetchProjects, 
    createProject, 
    submitProject, 
    approveSubmission, 
    rejectSubmission 
} from '../controllers/projectController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new project
router.post('/create', requireAuth, requireRole('client', 'admin'), createProject);

// Submit project
router.post('/submit', requireAuth, requireRole('freelancer'), submitProject);

// Approve submission
router.post('/approve/:id', requireAuth, requireRole('client', 'admin'), approveSubmission);

// Reject submission
router.post('/reject/:id', requireAuth, requireRole('client', 'admin'), rejectSubmission);

// Fetch all projects
router.get('/', requireAuth, fetchProjects);

// Fetch single project (LAST)
router.get('/:id', requireAuth, fetchProject);


export default router;
