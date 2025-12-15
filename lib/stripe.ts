import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn("Stripe secret key is missing. Check .env.local.");
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-11-17.clover",
    })
  : null;

export const PRICE_JPY = 9800;
export const PRODUCT_NAME = "年金トール君 3ヶ月利用権";

export function getSuccessUrl(origin: string) {
  return `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`;
}

export function getCancelUrl(origin: string) {
  return `${origin}/purchase`;
}

