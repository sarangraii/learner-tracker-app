interface ProgressBarProps {
  currentStep: number; // -1 for alternative steps
  totalSteps: number;
  isAlternative?: boolean;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  isAlternative = false,
}: ProgressBarProps) {
  const pct = isAlternative
    ? 80
    : Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div>
      <p className="text-sm text-slate-500 mb-2">
        {isAlternative ? 'Alternative Step' : `Step ${currentStep} of ${totalSteps}`}
      </p>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-700 via-brand-500 to-sky-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
