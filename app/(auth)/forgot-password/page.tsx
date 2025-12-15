import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export const metadata = {
  title: "パスワード再設定 | 年金トール君",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">パスワード再設定</h1>
        <p className="text-sm text-slate-600">登録メールアドレスを入力してください。再設定リンクを送信します。</p>
      </div>
      <Card>
        <Alert type="info">メール送信機能は準備中です。サポートまでご連絡ください。</Alert>
        <div className="mt-4 space-y-4">
          <Input label="メールアドレス" type="email" placeholder="you@example.com" disabled />
          <Button className="w-full" disabled>
            リンクを送信
          </Button>
        </div>
      </Card>
    </div>
  );
}

