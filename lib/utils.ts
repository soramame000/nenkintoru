import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type GenerationInput, type SeverityType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatYearMonth(value: string) {
  const match = value.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  if (!match) return value;
  return `${match[1]}年${Number(match[2])}月`;
}

function treatmentStatusLabel(status: GenerationInput["treatmentStatus"]) {
  switch (status) {
    case "outpatient":
      return "通院中";
    case "inpatient":
      return "入院中";
    case "suspended":
      return "中断している";
    default:
      return status;
  }
}

function severityLabel(severity: SeverityType): string {
  switch (severity) {
    case "always":
      return "常に";
    case "often":
      return "よくある";
    case "sometimes":
      return "時々";
    default:
      return severity;
  }
}

export function buildUserPrompt(data: GenerationInput): string {
  // 症状を程度付きの文字列に変換
  const symptomsWithSeverity = data.symptoms.map((s) => ({
    内容: s.symptom,
    頻度: severityLabel(s.severity),
  }));

  const payload = {
    diagnosis: data.diagnosis === "depression" ? "うつ病" : "双極性障害",
    firstVisitDate: formatYearMonth(data.firstVisitDate),
    treatmentStatus: treatmentStatusLabel(data.treatmentStatus),
    symptoms: symptomsWithSeverity,
    ...(data.symptomsFreeText?.trim()
      ? { symptomsFreeText: data.symptomsFreeText.trim() }
      : {}),
    history: data.history.map((h) => ({
      date: formatYearMonth(h.date),
      situation: h.situation,
      trigger: h.trigger,
      ...(h.note ? { note: h.note } : {}),
    })),
    employment: {
      current: data.employment.current,
      ...(data.employment.reasons?.length ? { reasons: data.employment.reasons } : {}),
      ...(data.employment.pastResignations
        ? { pastResignations: data.employment.pastResignations }
        : {}),
    },
    additional: {
      ...(data.additional.support?.length ? { support: data.additional.support } : {}),
      family: data.additional.family,
      ...(data.additional.message ? { message: data.additional.message } : {}),
    },
  };
  return JSON.stringify(payload);
}
