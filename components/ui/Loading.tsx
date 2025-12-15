export default function Loading({ label = "読み込み中..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent shadow-sm shadow-sky-200/50" />
      <span>{label}</span>
    </div>
  );
}
