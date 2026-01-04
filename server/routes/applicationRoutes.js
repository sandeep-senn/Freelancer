import express from 'express';
import { 
    makeBid, 
    fetchApplications, 
    approveApplication, 
    rejectApplication 
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/bid', makeBid);
router.get('/', fetchApplications);
router.get('/approve/:id', approveApplication);
router.get('/reject/:id', rejectApplication);

export default router;
