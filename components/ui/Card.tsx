import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Card({ title, actions, children, className }: Props) {
  return (
    <div
      className={cn(
        "surface-strong p-6 transition-shadow hover:shadow-blue-200/60",
        className
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && (
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              {title}
            </h3>
          )}
          {actions}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
