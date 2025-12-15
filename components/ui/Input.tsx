import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, className, error, ...rest },
  ref
) {
  return (
    <label className="block space-y-1 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <input
        ref={ref}
        className={cn(
          "focus-ring w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm shadow-sm shadow-slate-200/40 transition placeholder:text-slate-400",
          error
            ? "border-red-300 focus-visible:ring-red-200/70"
            : "border-slate-200/80 focus-visible:border-blue-400",
          className
        )}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </label>
  );
});

export default Input;
