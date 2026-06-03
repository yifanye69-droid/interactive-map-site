import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-cartoon",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "XIUXIUXIU-水族端节AI互动地图",
  description: "可探索的互动插画地图世界",
  icons: {
    icon: "/favicon.gif",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffd6ec",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={fredoka.variable}>
      <body className="font-cartoon antialiased">{children}</body>
    </html>
  );
}
