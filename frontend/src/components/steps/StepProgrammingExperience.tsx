import ProgressBar from '../ui/ProgressBar';
import OptionCard from '../ui/OptionCard';
import Button from '../ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

export default function StepProgrammingExperience() {
  const {
    state,
    setHasProgrammingExperience,
    goNext,
    goBack,
    currentStepNumber,
    totalSteps,
  } = useOnboarding();

  return (
    <div>
      <ProgressBar currentStep={currentStepNumber} totalSteps={totalSteps} />

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        Do you have programming experience?
      </h2>
      <p className="mt-2 text-slate-500">
        This helps us decide whether to suggest a pro-code, full-stack,
        Python, or low-code path.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OptionCard
          icon="💻"
          label="Yes, I have programming experience"
          selected={state.hasProgrammingExperience === true}
          onClick={() => setHasProgrammingExperience(true)}
        />
        <OptionCard
          icon="🌱"
          label="No, I am new to programming"
          selected={state.hasProgrammingExperience === false}
          onClick={() => setHasProgrammingExperience(false)}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack}>
          Back
        </Button>
        <Button
          onClick={goNext}
          disabled={state.hasProgrammingExperience === null}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
