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

export interface WizardState {
  aiKnowledgeScore: number;
  hasProgrammingExperience: boolean | null;
  techSkills: TechSkill[];
  wantsToLearnProgramming: boolean | null;
  mainGoal: MainGoal | null;
}

export interface LearningTrack {
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
}

export interface RoadmapStep {
  stepOrder: number;
  title: string;
  description: string;
  durationLabel: string;
  badge: string | null;
}

export interface RecommendationResponse {
  primaryTrack: LearningTrack;
  prerequisiteTrack: LearningTrack | null;
  alternativeTracks: LearningTrack[];
  reasoning: string;
  matchReasons: string[];
  roadmap: RoadmapStep[];
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
}
