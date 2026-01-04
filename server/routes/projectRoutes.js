import express from 'express';
import { 
    fetchProject, 
    fetchProjects, 
    createProject, 
    submitProject, 
    approveSubmission, 
    rejectSubmission 
} from '../controllers/projectController.js';

const router = express.Router();

// Create new project
router.post('/create', createProject);

// Submit project
router.post('/submit', submitProject);

// Approve submission
router.get('/approve/:id', approveSubmission);

// Reject submission
router.get('/reject/:id', rejectSubmission);

// Fetch all projects
router.get('/', fetchProjects);

// Fetch single project (LAST)
router.get('/:id', fetchProject);


export default router;
