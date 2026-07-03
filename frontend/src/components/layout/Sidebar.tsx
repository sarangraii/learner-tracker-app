const FEATURES = [
  { icon: '🎯', label: 'Personalized track matching' },
  { icon: '⚡', label: 'Less than 2 minutes' },
  { icon: '📈', label: 'Better learner outcomes' },
];

export default function Sidebar() {
  return (
    <aside className="flex w-full max-w-sm flex-col justify-between bg-gradient-to-b from-ink-900 to-ink-800 px-10 py-12 text-white">
      <div>
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 font-bold">
            O
          </span>
          <span className="text-lg font-bold">Orion LMS</span>
        </div>

        <div className="mb-6 text-5xl">🚀</div>

        <h1 className="mb-4 text-4xl font-black leading-tight">
          Build your personalized learning journey
        </h1>

        <p className="text-slate-300 leading-relaxed">
          Answer a few questions and we&apos;ll recommend the best track
          based on AI foundation, programming skills, and career goals.
        </p>
      </div>

      <div className="space-y-4">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              {f.icon}
            </span>
            <span className="text-slate-200">{f.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-400">
        Senior UI/UX Prototype • Learner Track Recommendation
      </p>
    </aside>
  );
}
