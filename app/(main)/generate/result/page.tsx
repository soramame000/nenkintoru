"use client";

import { useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import ResultDisplay from "@/components/generate/ResultDisplay";
import StepIndicator from "@/components/generate/StepIndicator";
import { useGeneration } from "@/hooks/useGeneration";

export default function ResultPage() {
  const { result, generate, loading, error, errorKind, hydrated, isResultStale } = useGeneration();

  useEffect(() => {
    if (!hydrated) return;
    if (!result) void generate();
  }, [hydrated, result, generate]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <StepIndicator current={6} />
      <Card
        title="生成結果"
        actions={
          <span className="text-xs font-medium text-slate-500">
            ※PDF/Excelはボタン押下時に読み込みます
          </span>
        }
      >
        {error && <Alert type="error">{error}</Alert>}
        {result ? (
          <div className="space-y-4">
            {isResultStale && (
              <Alert type="warning">
                入力内容が変更されています。必要に応じて「再生成」で最新の入力から作り直してください。
              </Alert>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" loading={loading} onClick={() => generate()}>
                再生成
              </Button>
            </div>
            <ResultDisplay text={result} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              {error
                ? errorKind === "validation"
                  ? "入力内容に不足があるため生成できません。前のステップに戻って入力を完了してください。"
                  : "生成できませんでした。エラー内容を確認し、必要に応じて再試行してください。"
                : "AIが文章を生成しています。数秒お待ちください。"}
            </p>
            <div className="flex flex-wrap gap-3">
              {errorKind === "validation" && (
                <Link href="/generate/step1">
                  <Button variant="secondary">入力に戻る</Button>
                </Link>
              )}
              <Button variant="secondary" loading={loading} onClick={() => generate()}>
                再生成
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
