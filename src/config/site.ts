// Site configuration
export const siteConfig = {
  url: "https://xdyou.example.com",
  faviconUrl: "/icon/favicon.png",
  lastUpdated: "Jan 2026",
  avatarUrl: "/icon/logo.png",
} as const;

export type SiteConfig = typeof siteConfig;
