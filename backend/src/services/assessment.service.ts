import { query } from '../config/db';
import { ApiError } from '../middleware/errorHandler';
import { AssessmentInput, AssessmentRecord } from '../types';

/**
 * Ensures a learner row exists. If learnerId is provided it must already
 * exist; otherwise a new anonymous (or email-linked) learner is created.
 */
async function resolveLearnerId(input: AssessmentInput): Promise<string> {
  if (input.learnerId) {
    const { rows } = await query('SELECT id FROM learners WHERE id = $1', [
      input.learnerId,
    ]);
    if (rows.length === 0) {
      throw new ApiError(404, `Learner ${input.learnerId} was not found.`);
    }
    return input.learnerId;
  }

  const { rows } = await query(
    `INSERT INTO learners (email) VALUES ($1) RETURNING id`,
    [input.learnerEmail || null]
  );
  return rows[0].id;
}

export async function createAssessment(
  input: AssessmentInput
): Promise<AssessmentRecord> {
  const learnerId = await resolveLearnerId(input);

  const { rows } = await query<AssessmentRecord>(
    `INSERT INTO assessments (
        learner_id,
        ai_knowledge_score,
        has_programming_experience,
        tech_skills,
        wants_to_learn_programming,
        main_goal
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
    [
      learnerId,
      input.aiKnowledgeScore,
      input.hasProgrammingExperience,
      input.techSkills ?? [],
      input.hasProgrammingExperience ? null : input.wantsToLearnProgramming,
      input.mainGoal,
    ]
  );

  return rows[0];
}

export async function getAssessmentById(
  id: string
): Promise<AssessmentRecord> {
  const { rows } = await query<AssessmentRecord>(
    `SELECT * FROM assessments WHERE id = $1`,
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, `Assessment ${id} was not found.`);
  }
  return rows[0];
}

export async function getAssessmentsForLearner(
  learnerId: string
): Promise<AssessmentRecord[]> {
  const { rows } = await query<AssessmentRecord>(
    `SELECT * FROM assessments WHERE learner_id = $1 ORDER BY created_at DESC`,
    [learnerId]
  );
  return rows;
}
