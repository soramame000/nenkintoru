import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  type?: "info" | "success" | "warning" | "error";
  children: ReactNode;
  className?: string;
};

export default function Alert({ type = "info", children, className }: Props) {
  const styles: Record<string, string> = {
    info: "border-white/70 bg-white/60 text-slate-900",
    success: "border-emerald-200/80 bg-emerald-50/70 text-emerald-900",
    warning: "border-amber-200/80 bg-amber-50/70 text-amber-900",
    error: "border-rose-200/80 bg-rose-50/70 text-rose-900",
  };
  return (
    <div className={cn("soft-border flex gap-2 rounded-2xl px-4 py-3 text-sm backdrop-blur", styles[type], className)}>
      <Icon type={type} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Icon({ type }: { type: NonNullable<Props["type"]> }) {
  const common = "mt-0.5 h-4 w-4 flex-none";
  switch (type) {
    case "success":
      return (
        <svg viewBox="0 0 20 20" className={common} fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "warning":
      return (
        <svg viewBox="0 0 20 20" className={common} fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.516 11.59C19.02 16.05 18.043 18 16.516 18H3.484c-1.527 0-2.504-1.95-1.743-3.311l6.516-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "error":
      return (
        <svg viewBox="0 0 20 20" className={common} fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.707-10.707a1 1 0 00-1.414-1.414L10 7.172 8.707 5.879a1 1 0 00-1.414 1.414L8.586 8.586 7.293 9.879a1 1 0 101.414 1.414L10 10l1.293 1.293a1 1 0 001.414-1.414l-1.293-1.293 1.293-1.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "info":
    default:
      return (
        <svg viewBox="0 0 20 20" className={common} fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5c.414 0 .75.336.75.75zM9 9.25a.75.75 0 01.75-.75h.5a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V10H9.75A.75.75 0 019 9.25z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
}
