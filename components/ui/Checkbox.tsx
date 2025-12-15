import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({ label, className, ...rest }: Props) {
  return (
    <label className={cn("flex items-start gap-2 text-sm text-slate-700", className)}>
      <input
        type="checkbox"
        className="focus-ring mt-1 h-4 w-4 rounded-md border-slate-300 text-sky-600 shadow-sm shadow-slate-200/40"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}
