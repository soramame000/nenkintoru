import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getLaunchMode } from "@/lib/launch";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "年金トール君 | 年金申請サポートAI",
  description: "選ぶだけで病歴・就労状況等申立書の下書きが完成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const launchMode = getLaunchMode();
  return (
    <html lang="ja">
      <body className={`${noto.className} bg-slate-50 text-slate-900`}>
        <Providers launchMode={launchMode}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
