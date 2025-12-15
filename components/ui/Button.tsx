import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", loading, disabled, children, ...rest },
  ref
) {
  const base =
    "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold tracking-tight transition active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<string, string> = {
    primary:
      "relative overflow-hidden bg-gradient-to-b from-blue-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-blue-200/60 ring-1 ring-white/30 hover:from-blue-500 hover:via-sky-400 hover:to-indigo-600",
    secondary:
      "relative overflow-hidden soft-border bg-white/80 text-slate-900 hover:bg-white",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100/80",
  };
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {variant !== "ghost" && (
        <span
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.35))",
          }}
        />
      )}
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-90"
          aria-hidden="true"
        />
      )}
      <span className={cn("relative", loading && "opacity-80")}>{children}</span>
    </button>
  );
});

export default Button;
