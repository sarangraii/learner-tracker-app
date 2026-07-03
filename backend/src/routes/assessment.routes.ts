import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { assessmentSchema } from '../validators/assessment.validator';
import {
  getAssessment,
  getLearnerAssessments,
  postAssessment,
} from '../controllers/assessment.controller';

const router = Router();

router.post('/', validateBody(assessmentSchema), postAssessment);

router.get('/:id', getAssessment);

router.get('/learner/:learnerId', getLearnerAssessments);

export default router;
