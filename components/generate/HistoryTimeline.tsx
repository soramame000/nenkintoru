"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { type HistoryItem } from "@/types";

type Props = {
  value: HistoryItem[];
  onChange: (next: HistoryItem[]) => void;
};

const situationOptions = [
  "発症・悪化",
  "初診",
  "休職",
  "退職",
  "入院",
  "退院",
  "復職",
  "再発",
  "その他",
];

const triggerOptions = [
  "仕事のストレス",
  "人間関係",
  "家庭環境",
  "経済的問題",
  "身体疾患",
  "特になし",
  "その他",
];

export default function HistoryTimeline({ value, onChange }: Props) {
  const items = value.length ? value : [{ date: "", situation: "", trigger: "", note: "" }];

  const updateItem = (index: number, partial: Partial<HistoryItem>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...partial } : item));
    onChange(next);
  };

  const add = () => {
    if (items.length >= 5) return;
    const next = [...items, { date: "", situation: "", trigger: "", note: "" }];
    onChange(next);
  };

  const remove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="soft-border space-y-3 rounded-3xl bg-white/70 p-4 shadow-sm shadow-slate-200/40"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">時期 {index + 1}</h4>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs text-red-500 hover:underline"
              >
                削除
              </button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="時期（YYYY-MM）"
              type="month"
              value={item.date}
              onChange={(e) => updateItem(index, { date: e.target.value })}
              required
            />
            <Select
              label="状況"
              value={item.situation}
              onChange={(e) => updateItem(index, { situation: e.target.value })}
              required
            >
              <option value="">選択してください</option>
              {situationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Select
              label="きっかけ"
              value={item.trigger}
              onChange={(e) => updateItem(index, { trigger: e.target.value })}
              required
            >
              <option value="">選択してください</option>
              {triggerOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
            <Input
              label="補足（任意・50文字まで）"
              value={item.note}
              onChange={(e) => updateItem(index, { note: e.target.value })}
              maxLength={50}
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add} disabled={items.length >= 5}>
        時期を追加（最大5）
      </Button>
    </div>
  );
}
