import { Router } from 'express';
import {
  getLearningTrackById,
  getLearningTracks,
} from '../controllers/learningTracks.controller';

const router = Router();

/**
 * GET /learning-tracks
 * Optional query params: ?category=ai_ml_engineer&type=main
 * Lists the full catalog (used for the "compare tracks" screen).
 */
router.get('/', getLearningTracks);

/**
 * GET /learning-tracks/:id
 * Fetch a single track with its roadmap steps.
 */
router.get('/:id', getLearningTrackById);

export default router;
