import express from 'express'
import { generateFreelancerDescription, improveProjectDescription } from '../controllers/aiController.js'

const router = express.Router()

router.post('/freelancer-description', generateFreelancerDescription)
router.post('/project-description', improveProjectDescription)

export default router
