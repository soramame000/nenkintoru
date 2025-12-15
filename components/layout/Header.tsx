"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

export default function Header() {
  const { session, isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "ホーム" },
    { href: "/generate", label: "申立書作成" },
    { href: "/dashboard", label: "ダッシュボード" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-500 via-sky-500 to-purple-500 text-white shadow-lg shadow-blue-200/60 ring-1 ring-white/50">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M12 3.5c4.3 0 7.8 3.5 7.8 7.8 0 5.2-5.7 9-7.1 9.9a1.2 1.2 0 01-1.4 0C9.9 20.3 4.2 16.5 4.2 11.3 4.2 7 7.7 3.5 12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-white/95"
              />
              <path
                d="M12 8v6M9 11h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="text-white/95"
              />
            </svg>
          </span>
          年金トール君
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/60 p-1 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/5 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "rounded-full bg-gradient-to-b from-blue-50 to-purple-50 px-3 py-1.5 text-slate-900"
                  : "rounded-full px-3 py-1.5 hover:bg-white hover:text-slate-900"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">{session?.user.email}</span>
              <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                ログアウト
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="secondary">ログイン</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">新規登録</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
