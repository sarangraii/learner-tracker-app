import { Request, Response } from 'express';
import * as learningTracksService from '../services/learningTracks.service';

export async function getLearningTracks(req: Request, res: Response) {
  const { category, type } = req.query;
  const tracks = await learningTracksService.listLearningTracks({
    category: typeof category === 'string' ? category : undefined,
    trackType: typeof type === 'string' ? type : undefined,
  });
  res.status(200).json({ data: tracks });
}

export async function getLearningTrackById(req: Request, res: Response) {
  const track = await learningTracksService.getTrackById(req.params.id);
  const roadmap = await learningTracksService.getRoadmapForTrack(track.id);
  res.status(200).json({ data: { ...track, roadmap } });
}
