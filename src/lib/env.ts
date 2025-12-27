// Environment variables configuration
// This module provides type-safe access to environment variables

export const env = {
  // Site configuration
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://xdyou.example.com",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "XDYou - 西电You",
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Your Essential Campus Companion for Xidian University",
  lastUpdated: process.env.NEXT_PUBLIC_LAST_UPDATED || "Dec 2025",
  avatarUrl:
    process.env.NEXT_PUBLIC_AVATAR_URL || "/icon/logo.png",
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL || "/icon/logo.png",

  // Personal info
  displayName: process.env.NEXT_PUBLIC_DISPLAY_NAME || "XDYou",
  subtitle: process.env.NEXT_PUBLIC_SUBTITLE || "西电You",
  description:
    process.env.NEXT_PUBLIC_DESCRIPTION || "Your Essential Campus Companion",
  // Blog configuration
  blogDescription:
    process.env.NEXT_PUBLIC_BLOG_DESCRIPTION ||
    "Thoughts on technology and life.",
  blogDescriptionZh:
    process.env.NEXT_PUBLIC_BLOG_DESCRIPTION_ZH || "关于技术和生活的思考。",

  // Feature flags
  enableBlog: process.env.NEXT_PUBLIC_ENABLE_BLOG === "true",
  enableAnime: process.env.NEXT_PUBLIC_ENABLE_ANIME === "true",
} as const;

export type Env = typeof env;
