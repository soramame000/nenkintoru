export const metadata = {
  title: "プライバシーポリシー | 年金トール君",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">プライバシーポリシー</h1>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700">
        <p>本サービスは、申立書生成に必要な個人情報を適切に取得・利用し、安全に管理します。</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>利用目的：申立書生成、決済、サポート対応のため</li>
          <li>第三者提供：法令に基づく場合を除き行いません</li>
          <li>保存期間：利用期間終了後、合理的な期間で削除します</li>
          <li>安全管理：SupabaseのRLS、Upstashによるレート制限を実施します</li>
          <li>お問い合わせ：support@nenkin-toru.com</li>
        </ul>
      </div>
    </div>
  );
}

