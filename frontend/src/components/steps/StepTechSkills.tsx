import ProgressBar from '../ui/ProgressBar';
import OptionCard from '../ui/OptionCard';
import Button from '../ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';
import { TechSkill } from '@/lib/types';

const SKILLS: { key: TechSkill; label: string; icon: string }[] = [
  { key: 'python', label: 'Python', icon: '🐍' },
  { key: 'full_stack_js', label: 'Full Stack / JavaScript', icon: '🟨' },
  { key: 'react', label: 'React', icon: '⚛️' },
  { key: 'nodejs', label: 'Node.js', icon: '🟢' },
  { key: 'java', label: 'Java', icon: '☕' },
  { key: 'other', label: 'Other', icon: '⋯' },
];

export default function StepTechSkills() {
  const {
    state,
    toggleTechSkill,
    goNext,
    goBack,
    currentStepNumber,
    totalSteps,
  } = useOnboarding();

  return (
    <div>
      <ProgressBar currentStep={currentStepNumber} totalSteps={totalSteps} />

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        Which programming skills are you comfortable with?
      </h2>
      <p className="mt-2 text-slate-500">Select all that apply.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SKILLS.map((skill) => (
          <OptionCard
            key={skill.key}
            icon={skill.icon}
            label={skill.label}
            multi
            selected={state.techSkills.includes(skill.key)}
            onClick={() => toggleTechSkill(skill.key)}
          />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack}>
          Back
        </Button>
        <Button onClick={goNext} disabled={state.techSkills.length === 0}>
          Continue
        </Button>
      </div>
    </div>
  );
}
