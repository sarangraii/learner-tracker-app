import ProgressBar from '../ui/ProgressBar';
import OptionCard from '../ui/OptionCard';
import Button from '../ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

export default function StepWantToLearn() {
  const {
    state,
    setWantsToLearnProgramming,
    goNext,
    goBack,
    currentStepNumber,
    totalSteps,
    isAlternativeStep,
  } = useOnboarding();

  return (
    <div>
      <ProgressBar
        currentStep={currentStepNumber}
        totalSteps={totalSteps}
        isAlternative={isAlternativeStep}
      />

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        Would you like to learn programming?
      </h2>
      <p className="mt-2 text-slate-500">
        Choose whether you want a programming-first roadmap or a low-code
        agentic engineering path.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OptionCard
          icon="📚"
          label="Yes, I want to learn programming"
          selected={state.wantsToLearnProgramming === true}
          onClick={() => setWantsToLearnProgramming(true)}
        />
        <OptionCard
          icon="🛠️"
          label="No, show me low-code agentic engineering"
          selected={state.wantsToLearnProgramming === false}
          onClick={() => setWantsToLearnProgramming(false)}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack}>
          Back
        </Button>
        <Button
          onClick={goNext}
          disabled={state.wantsToLearnProgramming === null}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
