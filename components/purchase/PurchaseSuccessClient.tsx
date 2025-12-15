"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import Alert from "@/components/ui/Alert";
import { useSubscription } from "@/hooks/useSubscription";

export default function PurchaseSuccessClient() {
  const { subscription, loading, error, refetch } = useSubscription();
  const [timedOut, setTimedOut] = useState(false);

  const isActive = useMemo(() => {
    if (!subscription) return false;
    if (subscription.status !== "active") return false;
    const expires = new Date(subscription.expires_at);
    return expires.getTime() > Date.now();
  }, [subscription]);

  useEffect(() => {
    if (isActive) return;
    setTimedOut(false);
    const started = Date.now();
    const interval = setInterval(() => {
      void refetch({ silent: true });
      if (Date.now() - started > 30_000) {
        setTimedOut(true);
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isActive, refetch]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">決済が完了しました</h1>
      <Card>
        <p className="text-sm text-slate-700">ご購入ありがとうございます。反映まで数秒〜数十秒かかる場合があります。</p>
        <div className="mt-4 space-y-3">
          {loading ? (
            <Loading label="購入情報を確認しています..." />
          ) : error ? (
            <Alert type="error">{error}</Alert>
          ) : isActive ? (
            <Alert type="success">利用権が有効になりました。すぐに作成を開始できます。</Alert>
          ) : timedOut ? (
            <Alert type="warning">
              まだ反映が確認できません。時間をおいて「更新」を押すか、ダッシュボードで確認してください。
            </Alert>
          ) : (
            <Loading label="反映待ち（自動更新中）..." />
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => refetch()}>
            更新
          </Button>
          <Link href="/dashboard">
            <Button variant="primary">ダッシュボードへ</Button>
          </Link>
          <Link href="/generate">
            <Button variant="secondary">申立書を作成する</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
