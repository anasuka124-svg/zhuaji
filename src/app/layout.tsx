import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F97316",
};

export const metadata: Metadata = {
  title: {
    default: "爪迹 - 宠物知识分享平台",
    template: "%s | 爪迹",
  },
  description: "记录每一份爱宠之心，专业的宠物养护知识分享平台。涵盖猫咪、狗狗、鸟类、爬宠、小型哺乳、水族等各类宠物养护知识。",
  keywords: ["爪迹", "宠物知识", "养宠", "猫咪", "狗狗", "异宠", "爬宠", "鸟类", "宠物养护", "宠物健康"],
  authors: [{ name: "爪迹团队" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/pet-mascot.png",
    apple: "/pet-mascot.png",
  },
  openGraph: {
    title: "爪迹 - 宠物知识分享平台",
    description: "记录每一份爱宠之心，专业的宠物养护知识分享平台",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/pet-mascot.png",
        width: 1024,
        height: 1024,
        alt: "爪迹",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "爪迹 - 宠物知识分享平台",
    description: "记录每一份爱宠之心",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "爪迹",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/pet-mascot.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
