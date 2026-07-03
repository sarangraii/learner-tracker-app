import { Request, Response } from 'express';
import { generateRecommendation } from '../services/recommendation.service';

export async function postRecommendTrack(req: Request, res: Response) {
  const { assessmentId } = req.body;
  const recommendation = await generateRecommendation(assessmentId);
  res.status(200).json({ data: recommendation });
}
