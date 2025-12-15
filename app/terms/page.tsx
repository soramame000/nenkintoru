export const metadata = {
  title: "利用規約 | 年金トール君",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">利用規約</h1>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          本サービス「年金トール君」（以下「本サービス」）は、障害年金の「病歴・就労状況等申立書」の下書き作成を支援するツールです。利用者は本規約に同意の上ご利用ください。
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>本サービスで生成される文章は下書きであり、最終確認・修正は利用者の責任で行ってください。</li>
          <li>本サービスは社会保険労務士業務の代行を行うものではありません。</li>
          <li>審査結果を保証するものではありません。主治医の診断書との整合性を確認し、必要に応じて専門家へ相談してください。</li>
          <li>個人情報は申立書生成の目的でのみ利用し、第三者へ提供しません。</li>
          <li>利用期間は購入日から3ヶ月間、生成上限は30回とします。</li>
          <li>デジタルコンテンツの性質上、購入後の返品・キャンセルはできません。</li>
        </ol>
      </div>
    </div>
  );
}

