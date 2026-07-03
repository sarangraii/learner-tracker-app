import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { WizardState, TechSkill, MainGoal, RecommendationResponse } from '@/lib/types';
import { api } from '@/lib/api';

const LEARNER_ID_STORAGE_KEY = 'orion_lms_learner_id';

export type WizardStep =
  | 'ai-knowledge'
  | 'programming-experience'
  | 'tech-skills' // experienced devs only
  | 'want-to-learn' // shown instead of tech-skills when no programming experience
  | 'main-goal'
  | 'recommendation'
  | 'roadmap';

interface OnboardingContextValue {
  step: WizardStep;
  state: WizardState;
  totalSteps: number;
  currentStepNumber: number; // for the "Step X of 5" label, -1 if alternative
  isAlternativeStep: boolean;
  goNext: () => void;
  goBack: () => void;
  restart: () => void;
  setAiKnowledgeScore: (score: number) => void;
  setHasProgrammingExperience: (value: boolean) => void;
  toggleTechSkill: (skill: TechSkill) => void;
  setWantsToLearnProgramming: (value: boolean) => void;
  setMainGoal: (goal: MainGoal) => void;
  goToRecommendation: () => void;
  goToRoadmap: () => void;
  learnerId: string | null;
  assessmentId: string | null;
  recommendation: RecommendationResponse | null;
  isSubmitting: boolean;
  submitError: string | null;
  submitAssessment: () => Promise<void>;
  enroll: () => Promise<void>;
  isEnrolling: boolean;
  enrollError: string | null;
  enrolledTrackId: string | null;
}

const initialState: WizardState = {
  aiKnowledgeScore: 5,
  hasProgrammingExperience: null,
  techSkills: [],
  wantsToLearnProgramming: null,
  mainGoal: null,
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<WizardStep>('ai-knowledge');
  const [state, setState] = useState<WizardState>(initialState);

  const [learnerId, setLearnerId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrolledTrackId, setEnrolledTrackId] = useState<string | null>(null);

  // Restore (or lazily create) a stable learner id in the browser so repeat
  // visits accumulate history against the same learner record server-side.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = window.localStorage.getItem(LEARNER_ID_STORAGE_KEY);
    if (existing) {
      setLearnerId(existing);
    }
  }, []);

  const setAiKnowledgeScore = useCallback((score: number) => {
    setState((s) => ({ ...s, aiKnowledgeScore: score }));
  }, []);

  const setHasProgrammingExperience = useCallback((value: boolean) => {
    setState((s) => ({
      ...s,
      hasProgrammingExperience: value,
      // reset dependent answers when the branch changes
      techSkills: value ? s.techSkills : [],
      wantsToLearnProgramming: value ? null : s.wantsToLearnProgramming,
    }));
  }, []);

  const toggleTechSkill = useCallback((skill: TechSkill) => {
    setState((s) => {
      const exists = s.techSkills.includes(skill);
      return {
        ...s,
        techSkills: exists
          ? s.techSkills.filter((t) => t !== skill)
          : [...s.techSkills, skill],
      };
    });
  }, []);

  const setWantsToLearnProgramming = useCallback((value: boolean) => {
    setState((s) => ({ ...s, wantsToLearnProgramming: value }));
  }, []);

  const setMainGoal = useCallback((goal: MainGoal) => {
    setState((s) => ({ ...s, mainGoal: goal }));
  }, []);

  const goNext = useCallback(() => {
    setStep((current) => {
      switch (current) {
        case 'ai-knowledge':
          return 'programming-experience';
        case 'programming-experience':
          return state.hasProgrammingExperience ? 'tech-skills' : 'want-to-learn';
        case 'tech-skills':
          return 'main-goal';
        case 'want-to-learn':
          return 'main-goal';
        case 'main-goal':
          return 'recommendation';
        case 'recommendation':
          return 'roadmap';
        default:
          return current;
      }
    });
  }, [state.hasProgrammingExperience]);

  const goBack = useCallback(() => {
    setStep((current) => {
      switch (current) {
        case 'programming-experience':
          return 'ai-knowledge';
        case 'tech-skills':
          return 'programming-experience';
        case 'want-to-learn':
          return 'programming-experience';
        case 'main-goal':
          return state.hasProgrammingExperience ? 'tech-skills' : 'want-to-learn';
        case 'recommendation':
          return 'main-goal';
        case 'roadmap':
          return 'recommendation';
        default:
          return current;
      }
    });
  }, [state.hasProgrammingExperience]);

  const restart = useCallback(() => {
    setState(initialState);
    setStep('ai-knowledge');
    setAssessmentId(null);
    setRecommendation(null);
    setSubmitError(null);
    setEnrolledTrackId(null);
    setEnrollError(null);
  }, []);

  const goToRecommendation = useCallback(() => setStep('recommendation'), []);
  const goToRoadmap = useCallback(() => setStep('roadmap'), []);

  const submitAssessment = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const assessment = await api.submitAssessment(
        state,
        learnerId ?? undefined
      );
      setAssessmentId(assessment.id);
      if (!learnerId && typeof window !== 'undefined') {
        window.localStorage.setItem(
          LEARNER_ID_STORAGE_KEY,
          assessment.learner_id
        );
        setLearnerId(assessment.learner_id);
      }

      const rec = await api.recommendTrack(assessment.id);
      setRecommendation(rec);
      setStep('recommendation');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [state, learnerId]);

  const enroll = useCallback(async () => {
    if (!recommendation || !learnerId) return;
    setIsEnrolling(true);
    setEnrollError(null);
    try {
      const result = await api.selectTrack(
        learnerId,
        recommendation.primaryTrack.id,
        assessmentId ?? undefined
      );
      setEnrolledTrackId(result.track.id);
    } catch (err) {
      setEnrollError(
        err instanceof Error ? err.message : 'Could not enroll right now.'
      );
    } finally {
      setIsEnrolling(false);
    }
  }, [recommendation, learnerId, assessmentId]);

  const currentStepNumber = useMemo(() => {
    const map: Record<WizardStep, number> = {
      'ai-knowledge': 1,
      'programming-experience': 2,
      'tech-skills': 3,
      'want-to-learn': -1, // alternative, not part of the 5-step count
      'main-goal': 4,
      recommendation: 5,
      roadmap: 5,
    };
    return map[step];
  }, [step]);

  const value: OnboardingContextValue = {
    step,
    state,
    totalSteps: 5,
    currentStepNumber,
    isAlternativeStep: step === 'want-to-learn',
    goNext,
    goBack,
    restart,
    setAiKnowledgeScore,
    setHasProgrammingExperience,
    toggleTechSkill,
    setWantsToLearnProgramming,
    setMainGoal,
    goToRecommendation,
    goToRoadmap,
    learnerId,
    assessmentId,
    recommendation,
    isSubmitting,
    submitError,
    submitAssessment,
    enroll,
    isEnrolling,
    enrollError,
    enrolledTrackId,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return ctx;
}
