import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Option = { label: string; value: string; description?: string };

type Props = {
  name: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  className,
}: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-2xl border bg-white/80 p-3.5 shadow-sm shadow-slate-200/40 ring-1 ring-slate-900/5 transition hover:border-sky-300 hover:bg-white",
            value === option.value && "border-sky-300/80 ring-sky-200/60"
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            className="focus-ring mt-1 h-4 w-4 text-sky-600"
          />
          <div className="space-y-1 text-sm">
            <div className="font-medium text-slate-800">{option.label}</div>
            {option.description && <p className="text-xs text-slate-500">{option.description}</p>}
          </div>
        </label>
      ))}
    </div>
  );
}
