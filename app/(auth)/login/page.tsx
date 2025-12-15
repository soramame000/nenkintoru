import Card from "@/components/ui/Card";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = {
  title: "ログイン | 年金トール君",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ログイン</h1>
        <p className="text-sm text-slate-600">登録済みのメールとパスワードでログインしてください。</p>
      </div>
      <Card>
        <LoginForm />
        <div className="mt-4 flex justify-between text-xs text-slate-600">
          <Link href="/forgot-password" className="text-sky-700 hover:underline">
            パスワードをお忘れですか？
          </Link>
          <Link href="/register" className="text-sky-700 hover:underline">
            新規登録はこちら
          </Link>
        </div>
      </Card>
    </div>
  );
}
