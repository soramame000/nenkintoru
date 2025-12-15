"use client";

import { createContext, useContext } from "react";
import type { LaunchMode } from "@/lib/launch";

const LaunchModeContext = createContext<LaunchMode>("public");

export function LaunchModeProvider({
  launchMode,
  children,
}: {
  launchMode: LaunchMode;
  children: React.ReactNode;
}) {
  return (
    <LaunchModeContext.Provider value={launchMode}>
      {children}
    </LaunchModeContext.Provider>
  );
}

export function useLaunchMode(): LaunchMode {
  return useContext(LaunchModeContext);
}

export function useIsInviteMode(): boolean {
  return useLaunchMode() === "invite";
}

