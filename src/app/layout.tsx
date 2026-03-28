import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaohame-japan.vercel.app"),
  title: "カオハメJAPAN",
  description: "47都道府県の顔ハメパネルを制覇しよう！",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "カオハメJAPAN",
  },
  openGraph: {
    title: "カオハメJAPAN",
    description: "47都道府県の顔ハメパネルを制覇しよう！",
    siteName: "カオハメJAPAN",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/ogp.jpg",
        width: 997,
        height: 992,
        alt: "カオハメJAPAN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "カオハメJAPAN",
    description: "47都道府県の顔ハメパネルを制覇しよう！",
    images: ["/ogp.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#E11D48",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900">
        <div className="flex flex-1 flex-col pb-16">{children}</div>
        <BottomNav />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
