import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { selectTrackSchema } from '../validators/assessment.validator';
import {
  getLearnerEnrollments,
  postSelectTrack,
} from '../controllers/selectTrack.controller';

const router = Router();

/**
 * POST /select-track
 * Body: { learnerId, trackId, assessmentId? }
 * Enrolls a learner into a chosen track (idempotent per learner+track).
 */
router.post('/', validateBody(selectTrackSchema), postSelectTrack);

/**
 * GET /select-track/learner/:learnerId
 * List all enrollments for a learner.
 */
router.get('/learner/:learnerId', getLearnerEnrollments);

export default router;
