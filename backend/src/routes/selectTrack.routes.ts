import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { selectTrackSchema } from '../validators/assessment.validator';
import {
  getLearnerEnrollments,
  postSelectTrack,
} from '../controllers/selectTrack.controller';

const router = Router();

router.post('/', validateBody(selectTrackSchema), postSelectTrack);

router.get('/learner/:learnerId', getLearnerEnrollments);

export default router;
