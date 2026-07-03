import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { recommendTrackSchema } from '../validators/assessment.validator';
import { postRecommendTrack } from '../controllers/recommendTrack.controller';

const router = Router();

/**
 * POST /recommend-track
 * Body: { assessmentId: string }
 * Runs the recommendation engine against a stored assessment and returns
 * the primary track, prerequisite (if any), alternatives, and roadmap.
 */
router.post('/', validateBody(recommendTrackSchema), postRecommendTrack);

export default router;
