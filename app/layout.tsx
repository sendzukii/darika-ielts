import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CatEffects } from "./CatEffects";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Darika IELTS",
  description: "Твой путь к Band 8.0",
};

// Сюда вставляешь длинную строку из base64
const pawBase64 = "data:image/png;base64,ВСТАВЬ_СЮДА_ТВОЮ_СТРОКУ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className} style={{ minHeight: "100vh" }}>
        <style>{`
          *, *::before, *::after {
            cursor: url('${pawBase64}'), auto !important;
          }
        `}</style>
        
        <CatEffects />
        {children}
      </body>
    </html>
  );
}
