import { useEffect, useMemo, useState, useCallback } from "react";
import { type GenerationInput } from "@/types";
import { generateInputSchema } from "@/lib/validations";

const STORAGE_KEY = "nenkintoru-generation";

type StoredGenerationState =
  | GenerationInput
  | {
      data: GenerationInput;
      result?: string;
      generatedFrom?: GenerationInput;
    };

const initialData: GenerationInput = {
  diagnosis: "depression",
  firstVisitDate: "",
  treatmentStatus: "outpatient",
  symptoms: [],
  history: [],
  employment: {
    current: "",
    reasons: [],
    pastResignations: "",
  },
  additional: {
    support: [],
    family: "",
    message: "",
  },
};

export function useGeneration() {
  const [data, setData] = useState<GenerationInput>(initialData);
  const [result, setResult] = useState<string>("");
  const [generatedFrom, setGeneratedFrom] = useState<GenerationInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"validation" | "request" | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      // センシティブ情報の永続化を避けるため、sessionStorageに限定
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredGenerationState = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && "data" in parsed) {
          setData(parsed.data);
          if (typeof parsed.result === "string") setResult(parsed.result);
          if (parsed.generatedFrom) setGeneratedFrom(parsed.generatedFrom);
        } else {
          setData(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to read stored generation data", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data, result, generatedFrom })
      );
    } catch (err) {
      console.error("Failed to store generation data", err);
    }
  }, [data, hydrated, result, generatedFrom]);

  const update = useCallback((partial: Partial<GenerationInput>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setResult("");
    setGeneratedFrom(null);
    setError(null);
    setErrorKind(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear generation data", err);
    }
  }, []);

  const generate = useCallback(async () => {
    setError(null);
    setErrorKind(null);
    const parsed = generateInputSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "入力内容を確認してください");
      setErrorKind("validation");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "生成に失敗しました");
      setResult(json.text);
      setGeneratedFrom(parsed.data);
      setErrorKind(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成に失敗しました");
      setErrorKind("request");
    } finally {
      setLoading(false);
    }
  }, [data]);

  const isResultStale = useMemo(() => {
    if (!result) return false;
    if (!generatedFrom) return true;
    return JSON.stringify(generatedFrom) !== JSON.stringify(data);
  }, [data, generatedFrom, result]);

  return {
    data,
    update,
    reset,
    generate,
    result,
    loading,
    error,
    errorKind,
    hydrated,
    isResultStale,
  };
}
