import React from "react";
import type { Metadata, Viewport } from "next";
import { LXGW_WenKai_TC, Noto_Serif_TC } from "next/font/google";

import "./globals.css";

const bodyFont = LXGW_WenKai_TC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body"
});

const displayFont = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "《漢留》在线阅读",
  description: "《漢留》第一集在线阅读站，支持 light/dark mode、简繁切换、目录与评论。"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#081717" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}
