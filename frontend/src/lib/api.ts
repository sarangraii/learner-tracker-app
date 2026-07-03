import {
  AssessmentRecord,
  LearningTrack,
  RecommendationResponse,
  WizardState,
} from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      body?.message || `Request to ${path} failed with status ${res.status}`;
    throw new Error(message);
  }

  return body.data as T;
}

export const api = {
  /** POST /assessment */
  submitAssessment(
    state: WizardState,
    learnerId?: string
  ): Promise<AssessmentRecord> {
    return request<AssessmentRecord>('/assessment', {
      method: 'POST',
      body: JSON.stringify({
        learnerId,
        aiKnowledgeScore: state.aiKnowledgeScore,
        hasProgrammingExperience: state.hasProgrammingExperience,
        techSkills: state.techSkills,
        wantsToLearnProgramming: state.wantsToLearnProgramming ?? undefined,
        mainGoal: state.mainGoal,
      }),
    });
  },

  /** POST /recommend-track */
  recommendTrack(assessmentId: string): Promise<RecommendationResponse> {
    return request<RecommendationResponse>('/recommend-track', {
      method: 'POST',
      body: JSON.stringify({ assessmentId }),
    });
  },

  /** POST /select-track */
  selectTrack(
    learnerId: string,
    trackId: string,
    assessmentId?: string
  ): Promise<{ enrollment: unknown; track: LearningTrack }> {
    return request('/select-track', {
      method: 'POST',
      body: JSON.stringify({ learnerId, trackId, assessmentId }),
    });
  },

  /** GET /learning-tracks */
  listLearningTracks(): Promise<LearningTrack[]> {
    return request<LearningTrack[]>('/learning-tracks', { method: 'GET' });
  },
};
