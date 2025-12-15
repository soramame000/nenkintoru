type Props = {
  current: number;
};

const steps = [
  "基本情報",
  "症状・生活困難",
  "病歴",
  "就労状況",
  "追加情報",
  "結果",
];

export default function StepIndicator({ current }: Props) {
  return (
    <div className="-mx-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-3 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
      <div className="flex min-w-max items-center gap-2 text-sm text-slate-600">
        {steps.map((label, index) => {
          const active = current === index + 1;
          const done = current > index + 1;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  active
                    ? "border-sky-400 bg-sky-50 text-sky-800"
                    : done
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {index + 1}
              </div>
              <span className={active ? "font-semibold text-sky-800" : "text-slate-600"}>
                {label}
              </span>
              {index < steps.length - 1 && <div className="h-px w-6 bg-slate-200" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
