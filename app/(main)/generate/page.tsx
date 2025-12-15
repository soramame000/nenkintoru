import Link from "next/link";
import Card from "@/components/ui/Card";
import StepIndicator from "@/components/generate/StepIndicator";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "申立書作成フロー | 年金トール君",
};

export default function GenerateHome() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">申立書作成フロー</h1>
        <p className="text-sm text-slate-600">5ステップで必要事項を入力し、AIが文章化します。</p>
      </div>
      <Card>
        <StepIndicator current={1} />
        <p className="mt-4 text-sm text-slate-700">
          基本情報から順に入力を進めてください。途中保存は自動で行われ、いつでも再開できます。
        </p>
        <Link href="/generate/step1">
          <Button className="mt-4">入力を始める</Button>
        </Link>
      </Card>
    </div>
  );
}

