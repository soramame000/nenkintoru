import { NextResponse } from "next/server";
import { insertUser, getUserByEmail } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { loginRateLimit } from "@/lib/ratelimit";
import { canRegisterInInviteMode } from "@/lib/launch";
import { hashPassword } from "@/lib/password";
import { supabaseAdmin } from "@/lib/db";

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase未設定です" }, { status: 500 });
    }

    if (loginRateLimit) {
      const ip = getClientIp(req);
      const { success, reset } = await loginRateLimit.limit(`register:${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: "試行回数が多すぎます。しばらく待って再試行してください。" },
          { status: 429, headers: { "Retry-After": reset.toString() } }
        );
      }
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, inviteCode } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    if (!canRegisterInInviteMode({ email: normalizedEmail, inviteCode })) {
      return NextResponse.json(
        { error: "現在は招待制ベータです。招待コードを入力してください。" },
        { status: 403 }
      );
    }

    const existing = await getUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "既に登録済みのメールアドレスです" },
        { status: 400 }
      );
    }

    const password_hash = await hashPassword(password);
    const { error, data } = await insertUser({
      email: normalizedEmail,
      password_hash,
    });
    if (error) {
      console.error(error);
      return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ user: { id: data?.id, email: data?.email } });
  } catch (err) {
    console.error("register failed", err);
    return NextResponse.json(
      { error: "登録に失敗しました。時間をおいて再試行してください。" },
      { status: 500 }
    );
  }
}
