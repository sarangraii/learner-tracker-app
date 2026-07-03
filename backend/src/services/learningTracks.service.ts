import { query } from '../config/db';
import { ApiError } from '../middleware/errorHandler';
import { LearningTrackRecord, RoadmapStepRecord } from '../types';

export async function listLearningTracks(filters: {
  category?: string;
  trackType?: string;
}): Promise<LearningTrackRecord[]> {
  const conditions: string[] = ['is_active = true'];
  const params: unknown[] = [];

  if (filters.category) {
    params.push(filters.category);
    conditions.push(`category = $${params.length}`);
  }
  if (filters.trackType) {
    params.push(filters.trackType);
    conditions.push(`track_type = $${params.length}`);
  }

  const { rows } = await query<LearningTrackRecord>(
    `SELECT * FROM learning_tracks
     WHERE ${conditions.join(' AND ')}
     ORDER BY title ASC`,
    params
  );
  return rows;
}

export async function getTrackById(id: string): Promise<LearningTrackRecord> {
  const { rows } = await query<LearningTrackRecord>(
    `SELECT * FROM learning_tracks WHERE id = $1 AND is_active = true`,
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, `Learning track ${id} was not found.`);
  }
  return rows[0];
}

export async function getTrackBySlug(
  slug: string
): Promise<LearningTrackRecord | null> {
  const { rows } = await query<LearningTrackRecord>(
    `SELECT * FROM learning_tracks WHERE slug = $1 AND is_active = true`,
    [slug]
  );
  return rows[0] ?? null;
}

export async function getRoadmapForTrack(
  trackId: string
): Promise<RoadmapStepRecord[]> {
  const { rows } = await query<RoadmapStepRecord>(
    `SELECT * FROM track_roadmap_steps WHERE track_id = $1 ORDER BY step_order ASC`,
    [trackId]
  );
  return rows;
}

export async function getTracksByIds(
  ids: string[]
): Promise<LearningTrackRecord[]> {
  if (ids.length === 0) return [];
  const { rows } = await query<LearningTrackRecord>(
    `SELECT * FROM learning_tracks WHERE id = ANY($1::uuid[]) AND is_active = true`,
    [ids]
  );
  return rows;
}
