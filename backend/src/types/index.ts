export type MainGoal =
  | 'build_ai_apps'
  | 'ai_ml_engineer'
  | 'ai_agents_automation'
  | 'career_growth';

export type TechSkill =
  | 'python'
  | 'full_stack_js'
  | 'react'
  | 'nodejs'
  | 'java'
  | 'other';

export interface AssessmentInput {
  learnerId?: string;
  learnerEmail?: string;
  aiKnowledgeScore: number; // 1-10
  hasProgrammingExperience: boolean;
  techSkills?: TechSkill[];
  wantsToLearnProgramming?: boolean;
  mainGoal: MainGoal;
}

export interface AssessmentRecord {
  id: string;
  learner_id: string;
  ai_knowledge_score: number;
  has_programming_experience: boolean;
  tech_skills: string[];
  wants_to_learn_programming: boolean | null;
  main_goal: MainGoal;
  needs_ai_foundation: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LearningTrackRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  level: string;
  duration_label: string;
  duration_weeks: number | null;
  track_type: 'prerequisite' | 'main' | 'alternative';
  category: string;
  tags: string[];
  is_active: boolean;
}

export interface RoadmapStepRecord {
  id: string;
  track_id: string;
  step_order: number;
  title: string;
  description: string;
  duration_label: string;
  badge: string | null;
}

export interface RecommendationResult {
  primaryTrack: LearningTrackRecord;
  prerequisiteTrack: LearningTrackRecord | null;
  alternativeTracks: LearningTrackRecord[];
  reasoning: string;
  matchReasons: string[];
  roadmap: {
    stepOrder: number;
    title: string;
    description: string;
    durationLabel: string;
    badge: string | null;
  }[];
}
