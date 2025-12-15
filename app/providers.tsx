"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { LaunchModeProvider } from "@/lib/launchContext";
import type { LaunchMode } from "@/lib/launch";

export default function Providers({
  children,
  launchMode,
}: {
  children: ReactNode;
  launchMode: LaunchMode;
}) {
  return (
    <SessionProvider>
      <LaunchModeProvider launchMode={launchMode}>{children}</LaunchModeProvider>
    </SessionProvider>
  );
}
