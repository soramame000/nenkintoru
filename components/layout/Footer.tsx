import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} 年金トール君</p>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-sky-700">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-sky-700">
            プライバシーポリシー
          </Link>
          <Link href="/legal" className="hover:text-sky-700">
            特商法表記
          </Link>
        </div>
      </div>
    </footer>
  );
}
