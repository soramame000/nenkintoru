import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const DatePicker = forwardRef<HTMLInputElement, Props>(function DatePicker(
  { label, className, ...rest },
  ref
) {
  return (
    <label className="block space-y-1 text-sm font-medium text-slate-700">
      {label && <span>{label}</span>}
      <input
        ref={ref}
        type="month"
        className={cn(
          "focus-ring w-full rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-sm shadow-sm shadow-slate-200/40 transition focus-visible:border-sky-400",
          className
        )}
        {...rest}
      />
    </label>
  );
});

export default DatePicker;
