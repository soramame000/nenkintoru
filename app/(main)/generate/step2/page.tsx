"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/generate/StepIndicator";
import SymptomSelector from "@/components/generate/SymptomSelector";
import { useGeneration } from "@/hooks/useGeneration";
import Alert from "@/components/ui/Alert";

export default function Step2Page() {
  const router = useRouter();
  const { data, update } = useGeneration();

  const next = () => router.push("/generate/step3");
  const back = () => router.push("/generate/step1");

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <StepIndicator current={2} />
      <Card title="症状・生活の困難">
        <Alert type="info" className="mb-4">
          当てはまる症状を選び、<b>頻度（常に/よくある/時々）</b>を選択してください。
        </Alert>
        <SymptomSelector
          diagnosis={data.diagnosis}
          selected={data.symptoms}
          onChange={(symptoms) => update({ symptoms })}
          freeText={data.symptomsFreeText ?? ""}
          onFreeTextChange={(symptomsFreeText) => update({ symptomsFreeText })}
        />
        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={back}>
            戻る
          </Button>
          <Button onClick={next}>次へ進む</Button>
        </div>
      </Card>
    </div>
  );
}

