// Site configuration
export const siteConfig = {
  url: "https://xdyou.superbart.top",
  faviconUrl: "/icon/favicon.png",
  lastUpdated: "Jan 2026",
  avatarUrl: "/icon/logo.png",
} as const;

export type SiteConfig = typeof siteConfig;
