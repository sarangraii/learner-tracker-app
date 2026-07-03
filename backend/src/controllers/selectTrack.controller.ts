import { Request, Response } from 'express';
import * as enrollmentService from '../services/enrollment.service';

export async function postSelectTrack(req: Request, res: Response) {
  const result = await enrollmentService.selectTrack(req.body);
  res.status(201).json({ data: result });
}

export async function getLearnerEnrollments(req: Request, res: Response) {
  const enrollments = await enrollmentService.getEnrollmentsForLearner(
    req.params.learnerId
  );
  res.status(200).json({ data: enrollments });
}
