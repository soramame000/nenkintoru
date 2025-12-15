import type { LaunchMode } from "@/lib/launch";

type ClientConfig = {
  launchMode?: LaunchMode;
};

export function getClientConfig(): ClientConfig {
  if (typeof window === "undefined") return {};
  return (window as any).__NENKINTORU__ ?? {};
}

export function getClientLaunchMode(): LaunchMode {
  return getClientConfig().launchMode ?? "public";
}

export function isInviteModeClient(): boolean {
  return getClientLaunchMode() === "invite";
}

