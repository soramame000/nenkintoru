export const metadata = {
  title: "特定商取引法に基づく表記 | 年金トール君",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">特定商取引法に基づく表記</h1>
      <dl className="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <Item term="販売事業者" desc="JAN株式会社" />
        <Item term="代表者" desc="（代表者名）" />
        <Item term="所在地" desc="（住所）" />
        <Item term="電話番号" desc="（電話番号）※お問い合わせはメールにて" />
        <Item term="メールアドレス" desc="support@nenkin-toru.com" />
        <Item term="販売価格" desc="9,800円（税込）" />
        <Item term="支払方法" desc="クレジットカード（Stripe経由）" />
        <Item term="サービス提供時期" desc="決済完了後、即時利用可能" />
        <Item term="利用期間" desc="購入日から3ヶ月間" />
        <Item term="返品・キャンセル" desc="デジタルコンテンツの性質上、購入後の返品・キャンセルは不可" />
      </dl>
    </div>
  );
}

function Item({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="soft-border space-y-1 rounded-3xl bg-white/70 p-4 shadow-sm shadow-slate-200/40">
      <dt className="text-xs font-semibold text-slate-500">{term}</dt>
      <dd className="text-sm text-slate-800">{desc}</dd>
    </div>
  );
}
