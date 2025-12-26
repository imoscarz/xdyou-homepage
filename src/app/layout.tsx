import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

import {
  generateBreadcrumbListJsonLd,
  generatePersonJsonLd,
  generateWebsiteJsonLd,
} from "@/app/jsonld";
import Footer from "@/components/blocks/footer";
import Navbar from "@/components/blocks/navbar/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data";
import { env } from "@/lib/env";
import { cn, jsonldScript } from "@/lib/utils";

/* Fonts */
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

/* Metadata */
export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  // Favicon configuration
  icons: {
    icon: env.faviconUrl,
    shortcut: env.faviconUrl,
    apple: env.faviconUrl,
  },
  // Also: robots.ts
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Also: manifest.ts
  manifest: "/manifest.json",
  // Also: opengraph-image.png, opengraph-image.alt.txt
  openGraph: {
    title: `${DATA.chinese.name}`,
    description: DATA.chinese.description,
    url: DATA.url,
    siteName: `${DATA.chinese.name}`,
    locale: "zh_CN",
    type: "website",
  },
  // Also: twitter-image.png, twitter-image.alt.txt
  twitter: {
    title: `${DATA.chinese.name}`,
    card: "summary_large_image",
  },
  alternates: {
    canonical: DATA.url,
    languages: {
      "en-US": `${DATA.url}/en`,
      "zh-CN": DATA.url,
    },
    types: {
      "application/atom+xml": "/api/feed/atom.xml",
    },
  },
};

export default function ChineseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        {/* Baidu Site Verification */}

        {/* JSON-LD Schemas */}
        {jsonldScript(generateWebsiteJsonLd())}
        {jsonldScript(generateBreadcrumbListJsonLd())}
        {jsonldScript(generatePersonJsonLd())}
      </head>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* Google Tag Manager (noscript) */}
        {/* End Google Tag Manager (noscript) */}

        {/* Main Layout */}
        <ThemeProvider attribute="class" defaultTheme="system">
          <TooltipProvider delayDuration={0}>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            {children}
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </TooltipProvider>
        </ThemeProvider>

        {/* Vercel Analytics and Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
