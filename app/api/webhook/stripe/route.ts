import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret || !stripe) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook error", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    // paid以外（未決済・不明）は購読を作らない
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    if (userId && supabaseAdmin) {
      // 冪等化: 同一checkout sessionで重複作成しない
      const { data: existing, error: existingError } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();
      if (existingError) {
        console.error("Failed to check existing subscription", existingError);
      }
      if (existing) {
        return NextResponse.json({ received: true });
      }

      const now = new Date();
      const expires = new Date(now);
      expires.setMonth(expires.getMonth() + 3);

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;
      const { error } = await supabaseAdmin.from("subscriptions").insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        status: "active",
        starts_at: now.toISOString(),
        expires_at: expires.toISOString(),
        max_generations: 30,
        generation_count: 0,
      });
      if (error) console.error("Failed to insert subscription", error);
    }
  }

  return NextResponse.json({ received: true });
}

