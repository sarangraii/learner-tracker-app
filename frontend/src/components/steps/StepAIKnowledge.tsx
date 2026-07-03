import ProgressBar from '../ui/ProgressBar';
import Slider from '../ui/Slider';
import Button from '../ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

export default function StepAIKnowledge() {
  const { state, setAiKnowledgeScore, goNext, currentStepNumber, totalSteps } =
    useOnboarding();

  return (
    <div>
      <ProgressBar currentStep={currentStepNumber} totalSteps={totalSteps} />

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        How would you rate your AI knowledge?
      </h2>
      <p className="mt-2 text-slate-500">
        Select your AI Foundation level from 1 to 10.
      </p>

      <div className="mt-10">
        <Slider
          value={state.aiKnowledgeScore}
          onChange={setAiKnowledgeScore}
          minLabel="Not familiar"
          maxLabel="Expert"
        />
      </div>

      {state.aiKnowledgeScore < 5 && (
        <div className="mt-8 rounded-xl bg-slate-100 px-5 py-4 text-slate-600">
          If the score is below 5, AI Foundation will be added as a
          recommended prerequisite.
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <span />
        <Button onClick={goNext}>Continue</Button>
      </div>
    </div>
  );
}
