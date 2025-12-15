export type DiagnosisType = "depression" | "bipolar";

export type HistoryItem = {
  date: string;
  situation: string;
  trigger: string;
  note?: string;
};

export type GenerationInput = {
  diagnosis: DiagnosisType;
  firstVisitDate: string;
  treatmentStatus: "outpatient" | "inpatient" | "suspended";
  symptoms: string[];
  history: HistoryItem[];
  employment: {
    current: string;
    reasons?: string[];
    pastResignations?: string;
  };
  additional: {
    support?: string[];
    family: string;
    message?: string;
  };
};

export type GeneratedContent = {
  history: string;
  dailyLife: string;
  employment: string;
  other: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
  }
}

