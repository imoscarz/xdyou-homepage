// Site configuration (static, not from environment)
export const siteConfig = {
  url: "https://xdyou.example.com",
  faviconUrl: "/icon/logo.png",
  lastUpdated: "Dec 2025",
  avatarUrl: "/icon/logo.png",
  blogDescription: "News from XDYou Team.",
  chinese: {
    blogDescription: "来自XDYou团队的新闻。",
  },
} as const;

export type SiteConfig = typeof siteConfig;
