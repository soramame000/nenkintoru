import { NextResponse } from "next/server";
import { stripe, PRICE_JPY, PRODUCT_NAME, getCancelUrl, getSuccessUrl } from "@/lib/stripe";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { isInviteMode } from "@/lib/launch";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isInviteMode()) {
    return NextResponse.json({ error: "現在は招待制ベータのため購入は停止中です" }, { status: 403 });
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe未設定" }, { status: 500 });
  }

  const { origin } = new URL(req.url);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "jpy",
          unit_amount: PRICE_JPY,
          product_data: {
            name: PRODUCT_NAME,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: session.user.id,
    },
    success_url: getSuccessUrl(origin),
    cancel_url: getCancelUrl(origin),
  });

  return NextResponse.json({ url: checkoutSession.url });
}
