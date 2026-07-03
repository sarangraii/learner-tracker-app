import Button from '../ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';

const BADGE_STYLES: Record<string, string> = {
  Recommended: 'bg-emerald-100 text-emerald-700',
  Current: 'bg-brand-100 text-brand-700',
  Portfolio: 'bg-slate-200 text-slate-700',
};

const CIRCLE_STYLES: Record<string, string> = {
  Recommended: 'bg-emerald-500',
  Current: 'bg-brand-600',
  Portfolio: 'bg-slate-400',
};

export default function RoadmapScreen() {
  const { recommendation, goBack, enroll, isEnrolling, enrollError, enrolledTrackId } =
    useOnboarding();

  if (!recommendation) return null;

  return (
    <div>
      <h2 className="text-3xl font-black text-slate-900">
        Your Learning Roadmap 🗺️
      </h2>
      <p className="mt-2 text-slate-500">
        A clean roadmap with prerequisite course and recommended main track.
      </p>

      <div className="mt-8 space-y-4">
        {recommendation.roadmap.map((step, idx) => (
          <div
            key={`${step.title}-${idx}`}
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-6 py-5"
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-bold text-white ${CIRCLE_STYLES[step.badge ?? ''] ?? 'bg-slate-400'}`}
              >
                {idx + 1}
              </span>
              <div>
                <h4 className="font-bold text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-500">{step.description}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm">
              <span className="text-slate-500">{step.durationLabel}</span>
              {step.badge && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLES[step.badge] ?? 'bg-slate-100 text-slate-600'}`}
                >
                  {step.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {enrollError && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {enrollError}
        </p>
      )}

      {enrolledTrackId && (
        <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          You&apos;re enrolled in {recommendation.primaryTrack.title}. 🎉
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack}>
          Back
        </Button>
        <Button
          onClick={enroll}
          disabled={isEnrolling || Boolean(enrolledTrackId)}
        >
          {enrolledTrackId
            ? 'Enrolled ✓'
            : isEnrolling
              ? 'Enrolling…'
              : 'Start Learning Now →'}
        </Button>
      </div>
    </div>
  );
}
