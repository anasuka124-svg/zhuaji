import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F97316",
};

export const metadata: Metadata = {
  title: "爪迹 - 宠物知识分享平台",
  description: "记录每一份爱宠之心，专业的宠物养护知识分享平台",
  manifest: "/manifest.json",
  icons: { icon: "/pet-mascot.png", apple: "/pet-mascot.png" },
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
