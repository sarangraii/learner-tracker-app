import { Request, Response } from 'express';
import * as assessmentService from '../services/assessment.service';

export async function postAssessment(req: Request, res: Response) {
  const assessment = await assessmentService.createAssessment(req.body);
  res.status(201).json({ data: assessment });
}

export async function getAssessment(req: Request, res: Response) {
  const assessment = await assessmentService.getAssessmentById(
    req.params.id
  );
  res.status(200).json({ data: assessment });
}

export async function getLearnerAssessments(req: Request, res: Response) {
  const assessments = await assessmentService.getAssessmentsForLearner(
    req.params.learnerId
  );
  res.status(200).json({ data: assessments });
}
