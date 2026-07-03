interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}

export default function Slider({
  value,
  min = 1,
  max = 10,
  onChange,
  minLabel,
  maxLabel,
}: SliderProps) {
  return (
    <div>
      <div className="flex items-end justify-center gap-1 mb-6">
        <span className="text-6xl font-black text-slate-900 leading-none">
          {value}
        </span>
        <span className="text-xl text-slate-400 mb-1">/{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600 h-2 cursor-pointer"
      />
      <div className="mt-2 flex justify-between text-sm text-slate-500">
        <span>{min} — {minLabel}</span>
        <span>{max} — {maxLabel}</span>
      </div>
    </div>
  );
}
