import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .regex(/[a-zA-Z]/, "英字を含めてください")
      .regex(/[0-9]/, "数字を含めてください"),
    confirmPassword: z.string(),
    inviteCode: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export const historySchema = z.object({
  date: z.string().trim().min(1, "病歴の時期（年月）を入力してください"),
  situation: z.string().trim().min(1, "病歴の状況を選択してください"),
  trigger: z.string().trim().min(1, "病歴のきっかけを選択してください"),
  note: z.string().trim().max(50).optional(),
});

export const symptomWithSeveritySchema = z.object({
  symptom: z.string().trim().min(1),
  severity: z.enum(["always", "often", "sometimes"]),
});

export const generateInputSchema = z.object({
  diagnosis: z.enum(["depression", "bipolar"]),
  firstVisitDate: z
    .string()
    .trim()
    .refine(
      (v) =>
        /^\d{4}-(0[1-9]|1[0-2])$/.test(v) || /^\d{4}年\d{1,2}月$/.test(v),
      { message: "初診日（年月）を入力してください" }
    ),
  treatmentStatus: z.enum(["outpatient", "inpatient", "suspended"]),
  symptoms: z.array(symptomWithSeveritySchema).min(1, "1つ以上選択してください"),
  symptomsFreeText: z.string().max(500).optional(),
  history: z.array(historySchema).min(1),
  employment: z.object({
    current: z.string().trim().min(1, "現在の就労状況を選択してください"),
    reasons: z.array(z.string()).optional(),
    pastResignations: z.string().optional(),
  }),
  additional: z.object({
    support: z.array(z.string()).optional(),
    family: z.string(),
    message: z.string().max(100).optional(),
  }),
});
