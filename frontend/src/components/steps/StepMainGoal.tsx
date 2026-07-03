import ProgressBar from '../ui/ProgressBar';
import OptionCard from '../ui/OptionCard';
import Button from '../ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';
import { MainGoal } from '@/lib/types';

const GOALS: { key: MainGoal; label: string; icon: string }[] = [
  { key: 'build_ai_apps', label: 'Build AI-powered applications', icon: '🤖' },
  { key: 'ai_ml_engineer', label: 'Become an AI/ML Engineer', icon: '🧠' },
  {
    key: 'ai_agents_automation',
    label: 'Work with AI Agents & Automation',
    icon: '🧩',
  },
  { key: 'career_growth', label: 'Grow my career / get a job', icon: '📈' },
];

export default function StepMainGoal() {
  const {
    state,
    setMainGoal,
    goBack,
    currentStepNumber,
    totalSteps,
    submitAssessment,
    isSubmitting,
    submitError,
  } = useOnboarding();

  return (
    <div>
      <ProgressBar currentStep={currentStepNumber} totalSteps={totalSteps} />

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        What is your main goal?
      </h2>
      <p className="mt-2 text-slate-500">
        This helps us recommend the most relevant track.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GOALS.map((goal) => (
          <OptionCard
            key={goal.key}
            icon={goal.icon}
            label={goal.label}
            selected={state.mainGoal === goal.key}
            onClick={() => setMainGoal(goal.key)}
          />
        ))}
      </div>

      {submitError && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={submitAssessment}
          disabled={state.mainGoal === null || isSubmitting}
        >
          {isSubmitting ? 'Matching your track…' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
