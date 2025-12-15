"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { registerSchema } from "@/lib/validations";
import { isInviteModeClient } from "@/lib/clientLaunch";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inviteMode = isInviteModeClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
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
        let message = "登録に失敗しました";
        try {
          const json = await res.json();
          message = json?.error || message;
        } catch {
          // JSON以外（HTML等）の場合
          const text = await res.text().catch(() => "");
          if (text) message = message;
        }
        setError(message);
        return;
      }

      await signIn("credentials", {
        redirect: true,
        email: form.email,
        password: form.password,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("register submit failed", err);
      setError("通信に失敗しました。時間をおいて再試行してください。");
    } finally {
      setLoading(false);
    }
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
