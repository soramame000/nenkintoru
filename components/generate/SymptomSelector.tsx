import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import { DiagnosisType, SymptomWithSeverity } from "@/types";

type Props = {
  diagnosis: DiagnosisType;
  selected: SymptomWithSeverity[];
  onChange: (next: SymptomWithSeverity[]) => void;
  freeText: string;
  onFreeTextChange: (text: string) => void;
};

// 程度の選択肢
const SEVERITY_OPTIONS = [
  { value: "always", label: "常に" },
  { value: "often", label: "よくある" },
  { value: "sometimes", label: "時々" },
] as const;

type SeverityValue = (typeof SEVERITY_OPTIONS)[number]["value"];

// カテゴリ定義
const BASE_GROUPS: Record<string, { title: string; items: string[] }> = {
  // 身辺自立
  selfCare: {
    title: "身辺自立（起床・入浴・着替え・食事）",
    items: [
      "朝、起き上がることができない",
      "布団から出られず一日中寝ている",
      "入浴や洗髪ができない",
      "歯磨きや洗顔ができない",
      "着替えができない",
      "身だしなみを整えられない",
      "食事を準備することができない",
      "食欲がなく食事を摂れない",
      "過食してしまう",
      "服薬の管理ができない（飲み忘れ・飲みすぎ）",
    ],
  },
  // 家事・外出
  housework: {
    title: "家事・外出",
    items: [
      "掃除ができない",
      "洗濯ができない",
      "ゴミ出しができない",
      "片付けができず部屋が散らかる",
      "料理の段取りができない",
      "外出することができない",
      "一人で外出できない",
      "買い物に行くことができない",
      "買い物で何を買うか判断できない",
      "金銭管理ができない",
      "公共交通機関を利用できない",
      "予定通りに行動できない",
    ],
  },
  // 睡眠
  sleep: {
    title: "睡眠",
    items: [
      "夜眠れない（入眠困難）",
      "夜中に何度も目が覚める（中途覚醒）",
      "早朝に目が覚めてしまう（早朝覚醒）",
      "眠りが浅く疲れが取れない",
      "日中も強い眠気がある",
      "昼夜逆転している",
      "悪夢を見る",
      "睡眠薬なしでは眠れない",
    ],
  },
  // 精神症状
  mental: {
    title: "精神面（気分・意欲）",
    items: [
      "強い憂うつ感がある",
      "不安感が強い",
      "何をしても楽しめない",
      "意欲が湧かない",
      "やる気が出ない",
      "自分を責める気持ちが強い",
      "将来に希望が持てない",
      "涙が止まらないことがある",
      "イライラしやすい",
      "感情のコントロールができない",
      "パニック発作が起きる",
      "死にたいと思うことがある（希死念慮）",
      "自傷行為をしたことがある",
    ],
  },
  // 認知機能
  cognitive: {
    title: "認知機能（集中力・記憶・判断）",
    items: [
      "集中力が続かない",
      "物事を決められない",
      "簡単な計算ができない",
      "読書やテレビの内容が頭に入らない",
      "物忘れがひどい",
      "約束や予定を忘れてしまう",
      "会話の内容を覚えていられない",
      "複数のことを同時にできない",
      "段取りを考えられない",
      "ミスが多い",
    ],
  },
  // 身体症状
  physical: {
    title: "身体症状",
    items: [
      "体がだるく動けない（倦怠感）",
      "疲れやすい",
      "頭痛がある",
      "めまいがする",
      "動悸がする",
      "息苦しさがある",
      "吐き気がある",
      "食欲不振",
      "体重が大きく変動した",
      "体の痛みがある",
      "手足のしびれがある",
    ],
  },
  // 対人関係
  relation: {
    title: "対人関係",
    items: [
      "人と話すことが極度に疲れる",
      "人と会うことを避けている",
      "電話に出ることができない",
      "メールやLINEの返信ができない",
      "家族とも会話ができない",
      "家族といることがつらい",
      "人混みにいられない",
      "他人の視線が気になる",
      "人と関わると具合が悪くなる",
    ],
  },
  // 支援・他者依存
  support: {
    title: "支援の必要性",
    items: [
      "一人で通院することができない",
      "通院の付き添いが必要",
      "家族に身の回りの世話をしてもらっている",
      "家族に食事を作ってもらっている",
      "家族に起こしてもらわないと起きられない",
      "家族に服薬を管理してもらっている",
      "常に誰かが見守っている必要がある",
      "訪問看護を利用している",
      "ヘルパーを利用している",
    ],
  },
  // その他
  other: {
    title: "その他",
    items: [
      "薬の副作用がつらい",
      "季節や天候で症状が悪化する",
      "症状の波が激しい",
      "入院したことがある",
      "救急搬送されたことがある",
    ],
  },
};

// 双極性障害用の追加項目
const BIPOLAR_EXTRA: Record<string, { title: string; items: string[] }> = {
  mania: {
    title: "躁状態の症状",
    items: [
      "眠らなくても元気に活動できる時期がある",
      "気分が高揚して止められないことがある",
      "衝動的な買い物をしてしまう",
      "浪費してしまう",
      "攻撃的になることがある",
      "多弁になり話が止まらないことがある",
      "壮大な計画を立てて実行しようとする",
      "危険な行動をしてしまう",
      "性的に奔放になる",
    ],
  },
  wave: {
    title: "気分の波",
    items: [
      "気分の波が激しく予測できない",
      "躁状態と抑うつ状態を繰り返している",
      "混合状態（躁と抑うつが同時）がある",
      "急速交代型（短期間で躁とうつが入れ替わる）",
      "症状の波で生活が安定しない",
    ],
  },
};

export default function SymptomSelector({
  diagnosis,
  selected,
  onChange,
  freeText,
  onFreeTextChange,
}: Props) {
  const findSymptom = (symptom: string) =>
    selected.find((s) => s.symptom === symptom);

  const toggle = (symptom: string) => {
    const existing = findSymptom(symptom);
    if (existing) {
      onChange(selected.filter((s) => s.symptom !== symptom));
    } else {
      onChange([...selected, { symptom, severity: "often" }]);
    }
  };

  const updateSeverity = (symptom: string, severity: SeverityValue) => {
    onChange(
      selected.map((s) => (s.symptom === symptom ? { ...s, severity } : s))
    );
  };

  const baseGroups = Object.entries(BASE_GROUPS);
  const bipolarGroups = Object.entries(BIPOLAR_EXTRA);

  return (
    <div className="space-y-6">
      {baseGroups.map(([key, group]) => (
        <Section
          key={key}
          title={group.title}
          items={group.items}
          selected={selected}
          onToggle={toggle}
          onSeverityChange={updateSeverity}
        />
      ))}
      {diagnosis === "bipolar" &&
        bipolarGroups.map(([key, group]) => (
          <Section
            key={key}
            title={group.title}
            items={group.items}
            selected={selected}
            onToggle={toggle}
            onSeverityChange={updateSeverity}
          />
        ))}

      {/* 自由記述欄 */}
      <div className="soft-border space-y-3 rounded-3xl bg-white/70 p-4 shadow-sm shadow-slate-200/40">
        <h4 className="text-sm font-semibold text-slate-800">
          その他（自由記述）
        </h4>
        <p className="text-xs text-slate-500">
          上記の選択肢にない症状や困りごとがあれば記入してください
        </p>
        <textarea
          className="w-full rounded-xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
          rows={3}
          placeholder="例: 季節の変わり目に特に症状が悪化する、特定の場所に行けないなど"
          value={freeText}
          onChange={(e) => onFreeTextChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  selected,
  onToggle,
  onSeverityChange,
}: {
  title: string;
  items: string[];
  selected: SymptomWithSeverity[];
  onToggle: (symptom: string) => void;
  onSeverityChange: (symptom: string, severity: SeverityValue) => void;
}) {
  return (
    <div className="soft-border space-y-3 rounded-3xl bg-white/70 p-4 shadow-sm shadow-slate-200/40">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <div className="space-y-2">
        {items.map((item) => {
          const symptomData = selected.find((s) => s.symptom === item);
          const isChecked = !!symptomData;
          return (
            <div key={item} className="flex items-center gap-2">
              <Checkbox
                label={item}
                checked={isChecked}
                onChange={() => onToggle(item)}
              />
              {isChecked && (
                <select
                  className="ml-auto rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-xs text-slate-600 focus:border-sky-300 focus:outline-none"
                  value={symptomData.severity}
                  onChange={(e) =>
                    onSeverityChange(item, e.target.value as SeverityValue)
                  }
                >
                  {SEVERITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
