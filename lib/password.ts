function base64UrlEncode(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): Uint8Array {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "===".slice((b64.length + 3) % 4);
  return new Uint8Array(Buffer.from(padded, "base64"));
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function getCrypto(): Crypto {
  const c = globalThis.crypto as Crypto | undefined;
  if (!c?.subtle) throw new Error("WebCrypto is not available");
  return c;
}

const DEFAULT_ITERATIONS = 120_000;

export async function hashPassword(
  password: string,
  opts?: { iterations?: number }
): Promise<string> {
  const crypto = getCrypto();
  const iterations = opts?.iterations ?? DEFAULT_ITERATIONS;
  const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array;
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt as unknown as BufferSource,
      iterations,
    },
    keyMaterial,
    256
  );
  const hash = new Uint8Array(bits);
  return `pbkdf2$sha256$${iterations}$${base64UrlEncode(salt)}$${base64UrlEncode(hash)}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    const { default: bcrypt } = await import("bcryptjs");
    return bcrypt.compare(password, stored);
  }

  const m = stored.match(/^pbkdf2\$sha256\$(\d+)\$([A-Za-z0-9_-]+)\$([A-Za-z0-9_-]+)$/);
  if (!m) return false;

  const iterations = Number(m[1]);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const salt = base64UrlDecode(m[2]);
  const expected = base64UrlDecode(m[3]);

  const crypto = getCrypto();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt as unknown as BufferSource,
      iterations,
    },
    keyMaterial,
    256
  );
  const actual = new Uint8Array(bits);
  return timingSafeEqualBytes(actual, expected);
}
