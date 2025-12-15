"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Checkbox from "@/components/ui/Checkbox";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/generate/StepIndicator";
import { useGeneration } from "@/hooks/useGeneration";

const supportOptions = ["障害者手帳あり", "自立支援医療", "生活保護", "訪問看護", "ヘルパー"];
const familyOptions = [
  "一人暮らし",
  "家族と同居（支援あり）",
  "家族と同居（支援なし）",
  "グループホーム",
];

export default function Step5Page() {
  const router = useRouter();
  const { data, update } = useGeneration();

  const toggleSupport = (value: string) => {
    const list = data.additional.support || [];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    update({ additional: { ...data.additional, support: next } });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <StepIndicator current={5} />
      <Card title="追加情報（任意）">
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800">受けている支援</h4>
            <div className="grid gap-2 md:grid-cols-2">
              {supportOptions.map((s) => (
                <Checkbox
                  key={s}
                  label={s}
                  checked={data.additional.support?.includes(s)}
                  onChange={() => toggleSupport(s)}
                />
              ))}
            </div>
          </div>
          <Select
            label="家族構成"
            value={data.additional.family}
            onChange={(e) => update({ additional: { ...data.additional, family: e.target.value } })}
          >
            <option value="">選択してください</option>
            {familyOptions.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
          <div>
            <label className="block space-y-1 text-sm font-medium text-slate-700">
              <span>伝えたいこと（任意・100文字以内）</span>
              <textarea
                className="focus-ring w-full rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-sm shadow-sm shadow-slate-200/40 transition focus-visible:border-sky-400"
                rows={4}
                maxLength={100}
                value={data.additional.message || ""}
                onChange={(e) =>
                  update({ additional: { ...data.additional, message: e.target.value } })
                }
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={() => router.push("/generate/step4")}>
            戻る
          </Button>
          <Button onClick={() => router.push("/generate/result")}>結果を見る</Button>
        </div>
      </Card>
    </div>
  );
}
