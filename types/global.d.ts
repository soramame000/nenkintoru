export {};

declare global {
  interface Window {
    __NENKINTORU__?: {
      launchMode?: "public" | "invite";
    };
  }
}

