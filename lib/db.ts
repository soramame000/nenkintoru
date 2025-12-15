import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn("Supabase credentials are missing. Check .env.local.");
}

function numberFromEnv(raw: string | undefined, fallback: number) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const SUPABASE_TIMEOUT_MS = numberFromEnv(process.env.SUPABASE_TIMEOUT_MS, 12_000);

function createTimeoutFetch(timeoutMs: number): typeof fetch {
  return async (input: any, init?: RequestInit) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const upstreamSignal = init?.signal;
      const signal =
        upstreamSignal && typeof (AbortSignal as any)?.any === "function"
          ? (AbortSignal as any).any([upstreamSignal, controller.signal])
          : upstreamSignal ?? controller.signal;
      return await fetch(input, { ...init, signal });
    } finally {
      clearTimeout(timer);
    }
  };
}

export const supabaseAdmin = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: createTimeoutFetch(SUPABASE_TIMEOUT_MS),
      },
    })
  : null;

export async function getUserByEmail(email: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) {
    console.error("Supabase getUserByEmail error", error);
    return null;
  }
  return data;
}

export async function insertUser(user: {
  email: string;
  password_hash: string;
}) {
  if (!supabaseAdmin) return { error: new Error("supabase not configured") };
  const { error, data } = await supabaseAdmin
    .from("users")
    .insert(user)
    .select()
    .single();
  return { error, data };
}

export async function updatePasswordHash(id: string, password_hash: string) {
  if (!supabaseAdmin) return { error: new Error("supabase not configured") };
  const { error } = await supabaseAdmin
    .from("users")
    .update({ password_hash })
    .eq("id", id);
  return { error };
}

export async function getSubscription(userId: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("Supabase getSubscription error", error);
    return null;
  }
  return data;
}

export async function incrementGenerationCount(subscriptionId: string) {
  if (!supabaseAdmin) return { error: new Error("supabase not configured") };
  const { data, error } = await supabaseAdmin.rpc("increment_generation_count", {
    sub_id: subscriptionId,
  });
  if (error) console.error("incrementGenerationCount error", error);
  return { data, error };
}

export async function createGeneration(entry: {
  user_id: string;
  subscription_id: string | null;
  diagnosis_type: string;
  input_data: unknown;
  output_text?: string;
}) {
  if (!supabaseAdmin) return { error: new Error("supabase not configured") };
  const { data, error } = await supabaseAdmin
    .from("generations")
    .insert(entry)
    .select()
    .single();
  return { data, error };
}

export async function listGenerations(userId: string) {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listGenerations error", error);
    return [];
  }
  return data ?? [];
}
