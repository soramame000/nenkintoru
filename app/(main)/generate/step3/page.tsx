"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/generate/StepIndicator";
import HistoryTimeline from "@/components/generate/HistoryTimeline";
import { useGeneration } from "@/hooks/useGeneration";
import Alert from "@/components/ui/Alert";

export default function Step3Page() {
  const router = useRouter();
  const { data, update } = useGeneration();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <StepIndicator current={3} />
      <Card title="病歴（時系列）">
        <Alert type="info" className="mb-4">
          例：「2023年4月：休職（不眠と希死念慮が悪化）」「2023年8月：復職→1ヶ月で再休職」など、<b>出来事＋影響</b>で書くと通りやすい。
        </Alert>
        <HistoryTimeline
          value={data.history}
          onChange={(history) => update({ history })}
        />
        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={() => router.push("/generate/step2")}>
            戻る
          </Button>
          <Button onClick={() => router.push("/generate/step4")}>次へ進む</Button>
        </div>
      </Card>
    </div>
  );
}

