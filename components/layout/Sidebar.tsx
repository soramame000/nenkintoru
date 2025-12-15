"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isInviteModeClient } from "@/lib/clientLaunch";

const links = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/purchase", label: "購入" },
  { href: "/generate", label: "申立書作成" },
  { href: "/generate/result", label: "生成結果" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const inviteMode = isInviteModeClient();
  const visibleLinks = inviteMode
    ? links.filter((l) => l.href !== "/purchase")
    : links;
  return (
    <aside className="surface-strong w-full max-w-[230px] space-y-1 p-2">
      {visibleLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "block rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white/70 hover:text-slate-900",
            pathname === link.href &&
              "bg-gradient-to-b from-blue-50 to-purple-50 text-slate-900 ring-1 ring-inset ring-white/60"
          )}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
