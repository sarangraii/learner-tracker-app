import { Router } from 'express';
import {
  getLearningTrackById,
  getLearningTracks,
} from '../controllers/learningTracks.controller';

const router = Router();

router.get('/', getLearningTracks);

router.get('/:id', getLearningTrackById);

export default router;
