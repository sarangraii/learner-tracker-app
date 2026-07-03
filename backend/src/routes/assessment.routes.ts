import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { assessmentSchema } from '../validators/assessment.validator';
import {
  getAssessment,
  getLearnerAssessments,
  postAssessment,
} from '../controllers/assessment.controller';

const router = Router();

/**
 * POST /assessment
 * Persist a learner's onboarding wizard answers.
 */
router.post('/', validateBody(assessmentSchema), postAssessment);

/**
 * GET /assessment/:id
 * Fetch a single assessment by id.
 */
router.get('/:id', getAssessment);

/**
 * GET /assessment/learner/:learnerId
 * Fetch all assessments submitted by a learner.
 */
router.get('/learner/:learnerId', getLearnerAssessments);

export default router;
