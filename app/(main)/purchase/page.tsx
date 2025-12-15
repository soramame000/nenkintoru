"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Sidebar from "@/components/layout/Sidebar";
import { useIsInviteMode } from "@/lib/launchContext";

export default function PurchasePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inviteMode = useIsInviteMode();

  const handlePurchase = async () => {
    if (inviteMode) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/checkout", { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "購入処理に失敗しました");
      return;
    }
    window.location.href = json.url;
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row">
      <Sidebar />
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">購入</h1>
        <Card title="年金トール君 3ヶ月利用権">
          {inviteMode && (
            <Alert type="info">
              現在は招待制ベータのため、購入機能は停止中です（招待ユーザーは無料で利用できます）。
            </Alert>
          )}
          <p className="text-sm text-slate-600">
            9,800円（税込）で3ヶ月間、申立書の生成が30回までご利用いただけます。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>生成上限：30回</li>
            <li>期間：購入日から3ヶ月</li>
            <li>決済：Stripe Checkout（クレジットカード）</li>
          </ul>
          {error && <Alert type="error" className="mt-4">{error}</Alert>}
          <Button className="mt-4" onClick={handlePurchase} loading={loading} disabled={inviteMode}>
            Stripeで支払う
          </Button>
        </Card>
      </div>
    </div>
  );
}
