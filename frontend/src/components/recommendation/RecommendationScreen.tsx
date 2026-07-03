import Button from '../ui/Button';
import { useOnboarding } from '@/context/OnboardingContext';
import { LearningTrack } from '@/lib/types';

function AlternativeCard({ track }: { track: LearningTrack }) {
  const palette: Record<string, string> = {
    prerequisite: 'bg-amber-50 border-amber-200',
    main: 'bg-emerald-50 border-emerald-200',
    alternative: 'bg-violet-50 border-violet-200',
  };
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${palette[track.track_type] ?? 'bg-slate-50 border-slate-200'}`}
    >
      <div className="mb-2 text-2xl">{track.icon}</div>
      <h4 className="font-bold text-slate-900">{track.title}</h4>
      <p className="mt-1 text-sm text-slate-600">{track.description}</p>
    </div>
  );
}

export default function RecommendationScreen() {
  const { recommendation, restart, goToRoadmap } = useOnboarding();

  if (!recommendation) {
    return (
      <div className="py-20 text-center text-slate-500">
        No recommendation available yet.
      </div>
    );
  }

  const { primaryTrack, alternativeTracks, reasoning, matchReasons } =
    recommendation;

  return (
    <div>
      <h2 className="text-3xl font-black text-slate-900">
        Recommended for You ✨
      </h2>
      <p className="mt-2 text-slate-500">{reasoning}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-ink-900 p-8 text-white">
          <div className="mb-4 text-4xl">{primaryTrack.icon}</div>
          <h3 className="text-2xl font-black leading-tight">
            {primaryTrack.title}
          </h3>
          <p className="mt-3 text-slate-300">{primaryTrack.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm">
              {primaryTrack.level}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm">
              {primaryTrack.duration_label}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm">
              Best Match
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {primaryTrack.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink-900"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {matchReasons.map((reason) => (
                <span key={reason}>{reason}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {alternativeTracks.map((track) => (
            <AlternativeCard key={track.id} track={track} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={restart}>
          Restart
        </Button>
        <Button onClick={goToRoadmap}>View Roadmap →</Button>
      </div>
    </div>
  );
}
