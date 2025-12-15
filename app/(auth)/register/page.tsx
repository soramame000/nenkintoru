import Card from "@/components/ui/Card";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import { isInviteMode } from "@/lib/launch";

export const metadata = {
  title: "新規登録 | 年金トール君",
};

export default function RegisterPage() {
  const inviteMode = isInviteMode();
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">新規登録</h1>
        <p className="text-sm text-slate-600">
          {inviteMode
            ? "現在は招待制ベータです。メールアドレス・招待コード・パスワードを入力してください。"
            : "メールアドレスとパスワードを入力してください。"}
        </p>
      </div>
      <Card>
        <RegisterForm />
        <p className="mt-4 text-xs text-slate-600">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-sky-700 hover:underline">
            ログイン
          </Link>
          してください。
        </p>
      </Card>
    </div>
  );
}
