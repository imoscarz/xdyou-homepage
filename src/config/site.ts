// Site configuration
export const siteConfig = {
  url: "https://xdyou.example.com",
  faviconUrl: "/icon/logo.png",
  lastUpdated: "Dec 2025",
  avatarUrl: "/icon/logo.png",
} as const;

export type SiteConfig = typeof siteConfig;
