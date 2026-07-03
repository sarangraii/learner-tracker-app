interface OptionCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean; // checkbox (rounded square) vs radio (circle)
  className?: string;
}

export default function OptionCard({
  icon,
  label,
  selected,
  onClick,
  multi = false,
  className = '',
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full flex items-center justify-between gap-4 rounded-2xl border-2 px-6 py-5 text-left transition-colors
        ${selected ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white hover:border-slate-300'}
        ${className}`}
    >
      <span className="flex items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
          {icon}
        </span>
        <span className="font-semibold text-slate-900">{label}</span>
      </span>
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center border-2 text-white text-sm
          ${multi ? 'rounded-md' : 'rounded-full'}
          ${selected ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'}`}
      >
        {selected ? '✓' : ''}
      </span>
    </button>
  );
}
