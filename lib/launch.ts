export type LaunchMode = "public" | "invite";

export function getLaunchMode(): LaunchMode {
  const raw =
    (process.env.LAUNCH_MODE ?? process.env.NEXT_PUBLIC_LAUNCH_MODE ?? "public")
      .trim()
      .toLowerCase();
  if (raw === "invite") return "invite";
  return "public";
}

export function isInviteMode(): boolean {
  return getLaunchMode() === "invite";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseAllowlist(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowedByAllowlist(email: string): boolean {
  const allowlist = parseAllowlist(process.env.INVITE_ALLOWLIST_EMAILS);
  if (allowlist.length === 0) return false;
  if (allowlist.includes("*")) return true;

  const normalized = normalizeEmail(email);
  const domain = normalized.split("@")[1] ?? "";

  return allowlist.some((rule) => {
    if (rule.startsWith("@")) {
      const allowedDomain = rule.slice(1);
      return allowedDomain.length > 0 && domain === allowedDomain;
    }
    return normalized === rule;
  });
}

export function isValidInviteCode(inviteCode: string | undefined): boolean {
  const expected = process.env.INVITE_CODE;
  if (!expected) return false;
  const code = (inviteCode ?? "").trim();
  if (!code) return false;
  return code === expected;
}

export function canRegisterInInviteMode(input: {
  email: string;
  inviteCode?: string;
}): boolean {
  if (!isInviteMode()) return true;
  if (isEmailAllowedByAllowlist(input.email)) return true;
  if (isValidInviteCode(input.inviteCode)) return true;
  return false;
}

