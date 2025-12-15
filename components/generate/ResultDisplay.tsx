"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { GeneratedContent } from "@/types";

type Props = {
  text: string;
};

export default function ResultDisplay({ text }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const data = parseSections(text);

  const downloadPdf = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const [{ pdf }, { default: PDFDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/PDFDocument"),
      ]);
      const blob = await pdf(<PDFDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "nenkin-toru.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed", err);
      setDownloadError("PDFの作成に失敗しました。時間をおいて再試行してください。");
    } finally {
      setDownloading(false);
    }
  };

  const downloadExcel = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const mod = await import("exceljs");
      const ExcelJS = mod.default ?? mod;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("申立書下書き");
      sheet.columns = [
        { header: "項目", key: "item", width: 20 },
        { header: "内容", key: "content", width: 80 },
      ];
      sheet.getRow(1).font = { bold: true };
      sheet.getRow(1).alignment = { wrapText: true };
      sheet.addRow({ item: "発病から現在までの経過", content: data.history });
      sheet.addRow({ item: "日常生活の状況", content: data.dailyLife });
      sheet.addRow({ item: "就労状況", content: data.employment });
      sheet.addRow({ item: "その他特記事項", content: data.other });
      sheet.eachRow((row) => {
        row.alignment = { wrapText: true, vertical: "top" };
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "nenkin-toru.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel download failed", err);
      setDownloadError("Excelの作成に失敗しました。時間をおいて再試行してください。");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert type="info">
        生成された内容は下書きです。申請前に必ずご自身で確認・修正してください。
      </Alert>
      {downloadError && <Alert type="error">{downloadError}</Alert>}
      <pre className="soft-border whitespace-pre-wrap rounded-3xl bg-white/80 p-4 text-sm text-slate-800 shadow-sm shadow-slate-200/40">
        {text}
      </pre>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={downloadPdf} loading={downloading}>
          PDFダウンロード
        </Button>
        <Button variant="secondary" onClick={downloadExcel} loading={downloading}>
          Excelダウンロード
        </Button>
      </div>
    </div>
  );
}

function parseSections(text: string): GeneratedContent {
  const normalized = text.replace(/\r\n/g, "\n");
  const sections: GeneratedContent = {
    history: "",
    dailyLife: "",
    employment: "",
    other: "",
  };

  const matches = Array.from(
    normalized.matchAll(/^\s*■\s*([^\n]+?)\s*$/gm)
  ).map((m) => ({
    label: (m[1] ?? "").trim(),
    index: m.index ?? 0,
    end: (m.index ?? 0) + m[0].length,
  }));

  if (matches.length === 0) {
    sections.history = normalized.trim();
    return sections;
  }

  const skipNewlines = (start: number) => {
    let i = start;
    while (normalized[i] === "\n") i += 1;
    return i;
  };

  const bodyFor = (i: number) => {
    const start = skipNewlines(matches[i].end);
    const end = i + 1 < matches.length ? matches[i + 1].index : normalized.length;
    return normalized.slice(start, end).trim();
  };

  for (let i = 0; i < matches.length; i += 1) {
    const label = matches[i].label;
    const body = bodyFor(i);
    if (label.includes("発病") && label.includes("経過")) sections.history = body;
    else if (label.includes("日常生活")) sections.dailyLife = body;
    else if (label.includes("就労")) sections.employment = body;
    else if (label.includes("その他")) sections.other = body;
  }

  return sections;
}
