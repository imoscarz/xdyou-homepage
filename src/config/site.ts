import { env } from "@/lib/env";

export const siteConfig = {
  url: env.siteUrl,
  lastUpdated: env.lastUpdated,
  avatarUrl: env.avatarUrl,
  blogDescription: env.blogDescription,
  blogCharacter: env.blogCharacter,
  chinese: {
    blogDescription: env.blogDescriptionZh,
  },
} as const;
