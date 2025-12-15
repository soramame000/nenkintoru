"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Alert from "@/components/ui/Alert";
import Sidebar from "@/components/layout/Sidebar";
import { useSubscription } from "@/hooks/useSubscription";
import { useIsInviteMode } from "@/lib/launchContext";

type Generation = {
  id: string;
  diagnosis_type: string;
  created_at: string;
  output_text: string;
};

export default function DashboardPage() {
  const inviteMode = useIsInviteMode();
  const { subscription, loading, error } = useSubscription();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loadingGen, setLoadingGen] = useState(true);

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const res = await fetch("/api/user/generations");
        const data = await res.json();
        if (res.ok) setGenerations(data.generations || []);
      } finally {
        setLoadingGen(false);
      }
    };
    fetchGenerations();
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row">
      <Sidebar />
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ダッシュボード</h1>
          <p className="text-sm text-slate-600">購入状況と生成履歴を確認できます。</p>
        </div>

        <Card title="購入状況">
          {inviteMode ? (
            <div className="space-y-3">
              <Alert type="info">
                現在は招待制ベータです。購入は停止中で、招待ユーザーは無料で利用できます。
              </Alert>
            </div>
          ) : loading ? (
            <Loading />
          ) : error ? (
            <Alert type="error">{error}</Alert>
          ) : subscription ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="ステータス" value={subscription.status} />
              <Info
                label="有効期限"
                value={new Date(subscription.expires_at).toLocaleDateString("ja-JP")}
              />
              <Info
                label="残り生成回数"
                value={`${
                  (subscription.max_generations ?? 0) -
                  (subscription.generation_count ?? 0)
                } / ${subscription.max_generations ?? 0}`}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Alert type="warning">まだ購入が完了していません。</Alert>
              <Button variant="primary" onClick={() => (window.location.href = "/purchase")}>
                購入ページへ
              </Button>
            </div>
          )}
        </Card>

        <Card title="生成履歴">
          {loadingGen ? (
            <Loading />
          ) : generations.length === 0 ? (
            <p className="text-sm text-slate-600">まだ生成履歴がありません。</p>
          ) : (
            <div className="space-y-3">
              {generations.map((g) => (
                <div
                  key={g.id}
                  className="surface-strong p-4 transition hover:shadow-blue-200/60"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{g.diagnosis_type === "bipolar" ? "双極性障害" : "うつ病"}</span>
                    <span>{new Date(g.created_at).toLocaleString("ja-JP")}</span>
                  </div>
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-800">
                    {g.output_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="soft-border rounded-3xl bg-white/70 px-4 py-3 shadow-sm shadow-slate-200/40">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
}
