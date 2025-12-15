import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateRateLimit } from "@/lib/ratelimit";
import { buildUserPrompt } from "@/lib/utils";
import { generateWithOpenAI } from "@/lib/openai";
import { generateInputSchema } from "@/lib/validations";
import { supabaseAdmin, incrementGenerationCount } from "@/lib/db";
import { isInviteMode } from "@/lib/launch";

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (generateRateLimit) {
    const key = `user:${session.user.id}`;
    const { success, reset } = await generateRateLimit.limit(key);
    if (!success) {
      return NextResponse.json(
        { error: "生成回数の上限に達しました。しばらく待って再試行してください。" },
        { status: 429, headers: { "Retry-After": reset.toString() } }
      );
    }
  }

  const body = await req.json();
  const parsed = generateInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const data = parsed.data;

  // DB
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase未設定" }, { status: 500 });
  }

  let subscriptionId: string | null = null;
  if (!isInviteMode()) {
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("expires_at", { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ error: "サブスクリプションがありません" }, { status: 403 });
    }

    const now = new Date();
    const expires = new Date(subscription.expires_at);
    if (subscription.status !== "active" || expires < now) {
      return NextResponse.json({ error: "利用期間が終了しています" }, { status: 403 });
    }
    if (
      subscription.max_generations &&
      subscription.generation_count >= subscription.max_generations
    ) {
      return NextResponse.json({ error: "生成上限に達しています" }, { status: 403 });
    }

    // DB側で原子的に枠を確保（並列実行で上限突破させない）
    // ※ RPC側でmax_generationsチェックを行う前提
    const reserved = await incrementGenerationCount(subscription.id);
    if (reserved.error) {
      return NextResponse.json({ error: "生成上限に達しています" }, { status: 403 });
    }
    subscriptionId = subscription.id;
  }

  const prompt = buildUserPrompt(data);
  let text: string;
  try {
    text = await generateWithOpenAI(prompt);
  } catch (err) {
    // 枠確保後に失敗した場合、カウントは戻せない（不正防止優先）
    console.error("OpenAI generation failed", err, {
      userId: session.user.id,
      ip: getClientIp(req),
      subscriptionId,
    });
    return NextResponse.json({ error: "生成に失敗しました。時間をおいて再試行してください。" }, { status: 500 });
  }

  const { error: genError } = await supabaseAdmin.from("generations").insert({
    user_id: session.user.id,
    subscription_id: subscriptionId,
    diagnosis_type: data.diagnosis,
    input_data: data,
    output_text: text,
  });
  if (genError) {
    console.error("Failed to insert generation", genError);
  }

  return NextResponse.json({ text });
}
