import { query } from '../config/db';
import { ApiError } from '../middleware/errorHandler';
import { getTrackById } from './learningTracks.service';

export interface EnrollmentInput {
  learnerId: string;
  trackId: string;
  assessmentId?: string;
}

export async function selectTrack(input: EnrollmentInput) {
  // Validate learner exists
  const { rows: learnerRows } = await query(
    'SELECT id FROM learners WHERE id = $1',
    [input.learnerId]
  );
  if (learnerRows.length === 0) {
    throw new ApiError(404, `Learner ${input.learnerId} was not found.`);
  }

  // Validate track exists (throws ApiError 404 if not)
  const track = await getTrackById(input.trackId);

  const { rows } = await query(
    `INSERT INTO enrollments (learner_id, track_id, assessment_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (learner_id, track_id) DO UPDATE SET
        assessment_id = COALESCE(EXCLUDED.assessment_id, enrollments.assessment_id)
     RETURNING *`,
    [input.learnerId, input.trackId, input.assessmentId ?? null]
  );

  return { enrollment: rows[0], track };
}

export async function getEnrollmentsForLearner(learnerId: string) {
  const { rows } = await query(
    `SELECT e.*, t.title AS track_title, t.slug AS track_slug
     FROM enrollments e
     JOIN learning_tracks t ON t.id = e.track_id
     WHERE e.learner_id = $1
     ORDER BY e.enrolled_at DESC`,
    [learnerId]
  );
  return rows;
}
