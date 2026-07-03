import { query } from '../config/db';
import { ApiError } from '../middleware/errorHandler';
import {
  AssessmentRecord,
  LearningTrackRecord,
  RecommendationResult,
} from '../types';
import {
  getTrackBySlug,
  getTracksByIds,
  getRoadmapForTrack,
} from './learningTracks.service';
import { getAssessmentById } from './assessment.service';

const ALTERNATIVE_SLUGS_BY_PRIORITY = [
  'claude-architect-track',
  'agentic-pro-code-engineering',
  'agentic-low-code-engineering',
  'programming-foundation-ai-track',
];

/**
 * Pure decision function: given an assessment, decide which track category
 * should be the *primary* recommendation. Kept separate from persistence/IO
 * so it's trivially unit-testable.
 */
export function decidePrimarySlug(assessment: AssessmentRecord): {
  slug: string;
  reasoning: string;
} {
  const isLowCodePath =
    assessment.has_programming_experience === false &&
    assessment.wants_to_learn_programming === false;

  if (isLowCodePath) {
    return {
      slug: 'agentic-low-code-engineering',
      reasoning:
        'Recommended because you prefer a low-code, agent-first path that avoids heavy programming.',
    };
  }

  if (
    assessment.main_goal === 'ai_agents_automation' &&
    assessment.has_programming_experience
  ) {
    return {
      slug: 'agentic-pro-code-engineering',
      reasoning:
        'Recommended because you want to build AI agents and automation with a pro-code foundation.',
    };
  }

  // Default: programming-first, guided roadmap toward AI/ML engineering.
  return {
    slug: 'programming-foundation-ai-track',
    reasoning:
      'Recommended because you want a guided programming-first roadmap.',
  };
}

function buildMatchReasons(assessment: AssessmentRecord): string[] {
  const reasons: string[] = [];

  if (
    assessment.has_programming_experience &&
    assessment.tech_skills.length > 0
  ) {
    reasons.push('✅ Matches your current skills');
  } else {
    reasons.push('✅ Fits your experience level');
  }

  if (
    assessment.main_goal === 'ai_ml_engineer' ||
    assessment.main_goal === 'career_growth'
  ) {
    reasons.push('🚀 Good career growth');
  } else {
    reasons.push('🚀 Hands-on, practical focus');
  }

  reasons.push('🧭 Clear roadmap');

  return reasons;
}

export async function generateRecommendation(
  assessmentId: string
): Promise<RecommendationResult> {
  const assessment = await getAssessmentById(assessmentId);

  const { slug, reasoning } = decidePrimarySlug(assessment);
  const primaryTrack = await getTrackBySlug(slug);
  if (!primaryTrack) {
    throw new ApiError(
      500,
      `Recommendation engine referenced unknown track slug "${slug}". Check the seed data.`
    );
  }

  const prerequisiteTrack = assessment.needs_ai_foundation
    ? await getTrackBySlug('ai-foundations')
    : null;

  const alternativeSlugs = ALTERNATIVE_SLUGS_BY_PRIORITY.filter(
    (s) => s !== slug
  ).slice(0, 3);
  const altTracksRaw = await Promise.all(
    alternativeSlugs.map((s) => getTrackBySlug(s))
  );
  const alternativeTracks = altTracksRaw.filter(
    (t): t is LearningTrackRecord => Boolean(t)
  );

  const matchReasons = buildMatchReasons(assessment);

  // Roadmap: prerequisite (if any) -> primary track's own roadmap steps
  const primaryRoadmap = await getRoadmapForTrack(primaryTrack.id);
  const roadmap: RecommendationResult['roadmap'] = [];

  if (prerequisiteTrack) {
    roadmap.push({
      stepOrder: 1,
      title: prerequisiteTrack.title,
      description: prerequisiteTrack.description,
      durationLabel: prerequisiteTrack.duration_label,
      badge: 'Recommended',
    });
  }

  if (primaryRoadmap.length > 0) {
    primaryRoadmap.forEach((step, idx) => {
      // If we already inserted a prerequisite step, shift ordering and skip
      // any duplicate "AI Foundations" step already covered above.
      if (
        prerequisiteTrack &&
        step.title.toLowerCase() === prerequisiteTrack.title.toLowerCase()
      ) {
        return;
      }
      roadmap.push({
        stepOrder: roadmap.length + 1,
        title: step.title,
        description: step.description,
        durationLabel: step.duration_label,
        badge: idx === 0 && roadmap.length === 0 ? 'Current' : step.badge,
      });
    });
  } else {
    roadmap.push({
      stepOrder: roadmap.length + 1,
      title: primaryTrack.title,
      description: primaryTrack.description,
      durationLabel: primaryTrack.duration_label,
      badge: 'Current',
    });
  }

  // Persist the recommendation for reporting/analytics
  await query(
    `INSERT INTO track_recommendations (
        assessment_id, primary_track_id, prerequisite_track_id,
        alternative_track_ids, reasoning, match_reasons
     ) VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (assessment_id) DO UPDATE SET
        primary_track_id = EXCLUDED.primary_track_id,
        prerequisite_track_id = EXCLUDED.prerequisite_track_id,
        alternative_track_ids = EXCLUDED.alternative_track_ids,
        reasoning = EXCLUDED.reasoning,
        match_reasons = EXCLUDED.match_reasons`,
    [
      assessment.id,
      primaryTrack.id,
      prerequisiteTrack?.id ?? null,
      alternativeTracks.map((t) => t.id),
      reasoning,
      matchReasons,
    ]
  );

  return {
    primaryTrack,
    prerequisiteTrack,
    alternativeTracks,
    reasoning,
    matchReasons,
    roadmap,
  };
}

export async function getStoredRecommendationTracks(assessmentId: string) {
  const { rows } = await query(
    `SELECT * FROM track_recommendations WHERE assessment_id = $1`,
    [assessmentId]
  );
  if (rows.length === 0) return null;
  const rec = rows[0];
  const [primary, alternatives] = await Promise.all([
    getTracksByIds([rec.primary_track_id]),
    getTracksByIds(rec.alternative_track_ids),
  ]);
  return { rec, primary: primary[0], alternatives };
}
