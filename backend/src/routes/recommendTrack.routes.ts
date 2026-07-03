import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { recommendTrackSchema } from '../validators/assessment.validator';
import { postRecommendTrack } from '../controllers/recommendTrack.controller';

const router = Router();

router.post('/', validateBody(recommendTrackSchema), postRecommendTrack);

export default router;
