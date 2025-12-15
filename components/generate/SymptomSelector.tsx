import Checkbox from "@/components/ui/Checkbox";
import { DiagnosisType } from "@/types";

type Props = {
  diagnosis: DiagnosisType;
  selected: string[];
  onChange: (next: string[]) => void;
};

const BASE_GROUPS: Record<
  "daily" | "sleep" | "mental" | "relation" | "other",
  string[]
> = {
  daily: [
    "朝、起き上がることができない日が週に何日もある",
    "入浴や洗髪ができない日が続くことがある",
    "着替えや身だしなみを整えることができない",
    "食事を準備することができない",
    "食欲がなく、食事を摂れない日がある",
    "過食してしまうことがある",
    "掃除や洗濯などの家事ができない",
    "外出することができない",
    "買い物に行くことができない",
    "金銭管理ができない",
  ],
  sleep: [
    "夜眠れない（入眠困難）",
    "夜中に何度も目が覚める（中途覚醒）",
    "早朝に目が覚めてしまう（早朝覚醒）",
    "日中も強い眠気がある",
    "昼夜逆転している",
  ],
  mental: [
    "強い憂うつ感がある",
    "何をしても楽しめない",
    "集中力が続かない",
    "物事を決められない",
    "自分を責める気持ちが強い",
    "死にたいと思うことがある（希死念慮）",
    "自傷行為をしたことがある",
  ],
  relation: [
    "人と話すことが極度に疲れる",
    "電話に出ることができない",
    "人と会うことを避けている",
    "家族とも会話ができない",
  ],
  other: [
    "薬の副作用がつらい",
    "通院の付き添いが必要",
    "一人で通院することができない",
  ],
};

const BIPOLAR_EXTRA: Record<"mania" | "wave", string[]> = {
  mania: [
    "眠らなくても元気に活動できる時期がある",
    "気分が高揚して止められないことがある",
    "衝動的な買い物をしてしまう",
    "攻撃的になることがある",
    "多弁になり話が止まらないことがある",
    "壮大な計画を立てて実行しようとする",
  ],
  wave: [
    "気分の波が激しく、予測できない",
    "躁状態と抑うつ状態を繰り返している",
    "混合状態（躁と抑うつが同時）がある",
  ],
};

export default function SymptomSelector({ diagnosis, selected, onChange }: Props) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-6">
      <Section title="日常生活の困難" items={BASE_GROUPS.daily} selected={selected} onToggle={toggle} />
      <Section title="睡眠の問題" items={BASE_GROUPS.sleep} selected={selected} onToggle={toggle} />
      <Section title="精神症状" items={BASE_GROUPS.mental} selected={selected} onToggle={toggle} />
      <Section title="対人関係" items={BASE_GROUPS.relation} selected={selected} onToggle={toggle} />
      <Section title="その他" items={BASE_GROUPS.other} selected={selected} onToggle={toggle} />
      {diagnosis === "bipolar" && (
        <>
          <Section
            title="躁状態の症状"
            items={BIPOLAR_EXTRA.mania}
            selected={selected}
            onToggle={toggle}
          />
          <Section
            title="波の問題"
            items={BIPOLAR_EXTRA.wave}
            selected={selected}
            onToggle={toggle}
          />
        </>
      )}
    </div>
  );
}

function Section({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="soft-border space-y-3 rounded-3xl bg-white/70 p-4 shadow-sm shadow-slate-200/40">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={selected.includes(item)}
            onChange={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
}
