"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { registerSchema } from "@/lib/validations";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inviteMode = (process.env.NEXT_PUBLIC_LAUNCH_MODE ?? "public") === "invite";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "登録に失敗しました");
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      redirect: true,
      email: form.email,
      password: form.password,
      callbackUrl: "/dashboard",
    });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      {inviteMode && (
        <Alert type="info">
          現在は招待制ベータです。招待コードをお持ちの方のみ登録できます。
        </Alert>
      )}
      <Input
        label="メールアドレス"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      {inviteMode && (
        <Input
          label="招待コード"
          type="text"
          value={form.inviteCode}
          onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
          required
        />
      )}
      <Input
        label="パスワード"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <Input
        label="パスワード（確認）"
        type="password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        required
      />
      <Button type="submit" className="w-full" loading={loading}>
        登録して始める
      </Button>
    </form>
  );
}
