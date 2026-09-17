// Site configuration
export const siteConfig = {
  url: "https://xdyou.superbart.top",
  faviconUrl: "/icon/favicon.png",
  lastUpdated: process.env.NEXT_PUBLIC_BUILD_DATE || "Sep 2026",
  avatarUrl: "/icon/logo.png",
  gaMeasurementId: "G-3LS3T5E7WP",
} as const;

export type SiteConfig = typeof siteConfig;
