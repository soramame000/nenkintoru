"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RadioGroup from "@/components/ui/RadioGroup";
import Checkbox from "@/components/ui/Checkbox";
import StepIndicator from "@/components/generate/StepIndicator";
import { useGeneration } from "@/hooks/useGeneration";
import Alert from "@/components/ui/Alert";

const currentOptions = [
  "働いていない",
  "休職中",
  "就労中（フルタイム）",
  "就労中（パート・アルバイト）",
  "就労継続支援A型",
  "就労継続支援B型",
];

const reasonOptions = [
  "症状が重く働けない",
  "通勤ができない",
  "対人関係が困難",
  "集中力が持たない",
  "体調の波が激しい",
  "主治医から就労を止められている",
];

const resignOptions = ["ない", "1回", "2回以上"];
const resignReasons = ["体調悪化", "人間関係", "業務についていけなかった", "解雇された"];

export default function Step4Page() {
  const router = useRouter();
  const { data, update } = useGeneration();

  const toggleReason = (value: string) => {
    const list = data.employment.reasons || [];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    update({ employment: { ...data.employment, reasons: next } });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <StepIndicator current={4} />
      <Card title="就労状況">
        <Alert type="info" className="mb-4">
          審査では「働けない理由」が重要。可能なら、症状→仕事への影響（遅刻・欠勤・ミス・対人）に繋がる項目を選ぶ。
        </Alert>
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-800">現在の就労状況</h4>
            <RadioGroup
              name="current"
              value={data.employment.current}
              onChange={(v) => update({ employment: { ...data.employment, current: v } })}
              options={currentOptions.map((c) => ({ label: c, value: c }))}
            />
          </div>
          {data.employment.current === "働いていない" && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-800">働けない理由（複数選択可）</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {reasonOptions.map((r) => (
                  <Checkbox
                    key={r}
                    label={r}
                    checked={data.employment.reasons?.includes(r)}
                    onChange={() => toggleReason(r)}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">過去の離職経験</h4>
            <RadioGroup
              name="resign"
              value={data.employment.pastResignations}
              onChange={(v) => update({ employment: { ...data.employment, pastResignations: v } })}
              options={resignOptions.map((r) => ({ label: r, value: r }))}
            />
            {data.employment.pastResignations && data.employment.pastResignations !== "ない" && (
              <div className="grid gap-2 md:grid-cols-2">
                {resignReasons.map((r) => (
                  <Checkbox
                    key={r}
                    label={r}
                    checked={data.employment.reasons?.includes(r)}
                    onChange={() => toggleReason(r)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={() => router.push("/generate/step3")}>
            戻る
          </Button>
          <Button onClick={() => router.push("/generate/step5")}>次へ進む</Button>
        </div>
      </Card>
    </div>
  );
}

