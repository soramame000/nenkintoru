"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import RadioGroup from "@/components/ui/RadioGroup";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/generate/StepIndicator";
import { useGeneration } from "@/hooks/useGeneration";
import Alert from "@/components/ui/Alert";

export default function Step1Page() {
  const router = useRouter();
  const { data, update } = useGeneration();

  const next = () => {
    router.push("/generate/step2");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <StepIndicator current={1} />
      <Card title="基本情報">
        <Alert type="info" className="mb-4">
          迷ったら「だいたい」でOK。審査で重要なのは“時系列”と“具体性”なので、後のステップで補強できます。
        </Alert>
        <div className="space-y-6">
          <RadioGroup
            name="diagnosis"
            value={data.diagnosis}
            onChange={(v) => update({ diagnosis: v as any })}
            options={[
              { label: "うつ病", value: "depression" },
              { label: "双極性障害", value: "bipolar" },
            ]}
          />
          <DatePicker
            label="初診日（年月）"
            value={data.firstVisitDate}
            onChange={(e) => update({ firstVisitDate: e.target.value })}
          />
          <RadioGroup
            name="treatment"
            value={data.treatmentStatus}
            onChange={(v) => update({ treatmentStatus: v as any })}
            options={[
              { label: "通院中", value: "outpatient" },
              { label: "入院中", value: "inpatient" },
              { label: "中断している", value: "suspended" },
            ]}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={next}>次へ進む</Button>
        </div>
      </Card>
    </div>
  );
}

