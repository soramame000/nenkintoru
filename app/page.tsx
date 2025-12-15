import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

export const metadata = {
  title: "年金トール君 | 病歴・就労状況等申立書を最短で下書き",
  description:
    "選択式の質問に答えるだけで、障害年金の「病歴・就労状況等申立書」を審査を意識した文章に整形。PDF/Excelで出力できます。",
};

export default function Home() {
  const features = [
    {
      title: "選択式で迷わない",
      desc: "診断名に合わせて質問を絞り込み。チェックと選択で“時系列”が組み立ちます。",
    },
    {
      title: "審査を意識した文章",
      desc: "事実ベースで、客観的・具体的な表現に整形。読まれやすい構成で出力します。",
    },
    {
      title: "PDF/Excel出力",
      desc: "生成結果をそのままPDF/Excelでダウンロード。提出準備の手間を減らします。",
    },
    {
      title: "プライバシー重視",
      desc: "入力は端末に残り続けない設計（sessionStorage）。サーバー側は認証・制限付きで扱います。",
    },
  ];

  const steps = [
    {
      title: "質問に答える",
      desc: "基本情報→症状→病歴→就労→追加情報の5ステップ。迷いにくい選択式です。",
    },
    {
      title: "文章を生成",
      desc: "入力内容をもとに、申立書の下書きを自動で文章化。必要なら再生成もできます。",
    },
    {
      title: "提出用に整える",
      desc: "PDF/Excelで出力して、提出用フォーマットへ転記・調整しやすくします。",
    },
  ];

  const faqs = [
    {
      q: "入力はどこに保存されますか？",
      a: "途中入力と直近の生成結果はブラウザのsessionStorageに保存され、端末に残り続けません。生成履歴はログインユーザーのみに紐づいて保存されます。",
    },
    {
      q: "事実と違う内容が入ることはありますか？",
      a: "推測での補完を避ける方針ですが、必ず最終確認・修正してください。特に日付や回数などはご自身の記録と照合してください。",
    },
    {
      q: "どんな診断名に対応していますか？",
      a: "現状は「うつ病」「双極性障害」を主対象としています（順次拡張予定）。",
    },
    {
      q: "料金は？",
      a: "現在は招待制ベータです。正式ローンチまでの間は無料で提供し、料金体系は整い次第ご案内します。",
    },
  ];

  return (
    <div className="subtle-grid hero-glow sparkle-dots">
      <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 py-16 md:flex-row md:py-24">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
            病歴・就労状況等申立書の下書きを最短で
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            年金トール君
            <span className="block bg-gradient-to-r from-blue-700 via-sky-700 to-purple-700 bg-clip-text text-2xl font-semibold text-transparent md:mt-1">
              選ぶだけで、申立書の下書きが完成
            </span>
          </h1>
          <p className="text-lg text-slate-600">
            うつ病・双極性障害の方の申立書作成を、AIが伴走。診断名に応じた質問に答えるだけで、審査官に伝わる文章構造に整形します。
          </p>
          <Alert type="info" className="max-w-xl">
            生成結果は下書きです。申請前に必ずご自身で内容を確認・修正してください。
          </Alert>
          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button variant="primary" className="h-11 px-5">
                招待コードで登録して試す
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="h-11 px-5">
                ログイン
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span>5ステップ入力</span>
            <span>PDF/Excel出力</span>
            <span>生成履歴</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="surface-strong relative overflow-hidden p-6">
            <div className="relative text-sm font-semibold text-slate-900">生成イメージ</div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              <p className="font-bold text-slate-800">■ 発病から現在までの経過</p>
              <p>
                2018年頃から仕事のストレスで体調が悪化しました。2019年に初診を受け、休職と復職を繰り返し、2023年に退職しました。
              </p>
              <p className="font-bold text-slate-800">■ 日常生活の状況</p>
              <p>
                朝起き上がれない日が多く、入浴や家事ができない日が続くことがあります。会話で強い疲労を感じ、外出は月に数回程度です。
              </p>
            </div>
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-b from-blue-200/45 via-sky-200/35 to-purple-200/30 blur-2xl" />
            <div className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-gradient-to-b from-teal-200/30 to-transparent blur-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">サービスの特長</h2>
          <p className="text-slate-600">申請に必要な情報だけを整然と集め、文章化までを一気通貫。</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((item) => (
            <Card key={item.title} title={item.title}>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">使い方（3分で理解）</h2>
          <p className="text-slate-600">「時系列」と「具体性」を揃えるための流れを、そのまま画面にしました。</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, idx) => (
            <Card
              key={step.title}
              title={`${idx + 1}. ${step.title}`}
              className="bg-white/90"
            >
              <p className="text-sm text-slate-600">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="作成できるもの">
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>「病歴・就労状況等申立書」の下書き（4セクション構成）</li>
              <li>PDF/Excelでのダウンロード</li>
              <li>生成履歴の確認（ログインユーザーのみ）</li>
            </ul>
          </Card>
          <Card title="向いている人">
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>何を書けば良いか分からず手が止まる</li>
              <li>時系列が整理できず、書類が散らかる</li>
              <li>疲れやすく、文章作成の負担を減らしたい</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">よくある質問</h2>
            <p className="text-slate-600">不安になりやすい点を先にクリアにします。</p>
          </div>
          <div className="text-sm text-slate-600">
            お問い合わせ: <span className="font-semibold">support@nenkin-toru.com</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.q} title={faq.q}>
              <p className="text-sm text-slate-600">{faq.a}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-6 text-center shadow-sm ring-1 ring-slate-900/5">
          <h3 className="text-lg font-bold text-slate-900">まずは登録して、入力の流れを試してみる</h3>
          <p className="max-w-2xl text-sm text-slate-600">
            5ステップで情報が揃うと、文章化の難所（時系列・具体性）が一気に進みます。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button variant="primary" className="h-11 px-6">
                新規登録
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="h-11 px-6">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
