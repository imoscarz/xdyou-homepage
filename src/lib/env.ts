// Environment variables configuration
// This module provides type-safe access to environment variables

export const env = {
  // Site configuration
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.imoscarz.me",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "imoscarz 的个人主页",
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "A personal homepage of imoscarz.",
  lastUpdated: process.env.NEXT_PUBLIC_LAST_UPDATED || "Dec 2025",
  avatarUrl:
    process.env.NEXT_PUBLIC_AVATAR_URL || "https://cdn.imoscarz.me/avatar.png",
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL || "https://cdn.imoscarz.me/favicon.ico",

  // Personal info
  displayName: process.env.NEXT_PUBLIC_DISPLAY_NAME || "imoscarz",
  subtitle: process.env.NEXT_PUBLIC_SUBTITLE || "Oscar Zeng",
  description:
    process.env.NEXT_PUBLIC_DESCRIPTION || "A passionate developer and college student majoring in Electronic Engineering.",
  location: process.env.NEXT_PUBLIC_LOCATION || "Xi'an, Shaanxi, China",
  locationLink:
    process.env.NEXT_PUBLIC_LOCATION_LINK ||
    "https://www.google.com/maps/place/Xi'an,+Shaanxi,+China",
  // Blog configuration
  rssFeedUrl: process.env.NEXT_PUBLIC_RSS_FEED_URL || "",
  feedMode: (process.env.NEXT_PUBLIC_FEED_MODE || "rss") as "news" | "rss" | "both",
  blogHomeUrl: process.env.NEXT_PUBLIC_BLOG_HOME_URL || "",
  blogDescription:
    process.env.NEXT_PUBLIC_BLOG_DESCRIPTION ||
    "Thoughts on technology and life.",
  blogDescriptionZh:
    process.env.NEXT_PUBLIC_BLOG_DESCRIPTION_ZH || "关于技术和生活的思考。",
  blogCharacter: process.env.NEXT_PUBLIC_BLOG_CHARACTER || "I",

  // Analytics
  gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || "",

  // Feature flags
  enableBlog: process.env.NEXT_PUBLIC_ENABLE_BLOG === "true",
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  enableAnime: process.env.NEXT_PUBLIC_ENABLE_ANIME === "true",

  // Bangumi API
  bangumiUsername: process.env.BANGUMI_USERNAME || "",
  bangumiMaxTags: parseInt(process.env.NEXT_PUBLIC_BANGUMI_MAX_TAGS || "3", 10),
} as const;

export type Env = typeof env;
