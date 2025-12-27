// Deprecated: Use siteConfig and projectConfig directly from their modules instead.
// This stub remains temporarily to prevent import errors if any legacy code references it.

import { contact, navbar } from "@/config/contact";
import { discover, footerResources } from "@/config/footer";
import { projectConfig } from "@/config/project";
import { siteConfig } from "@/config/site";

export const BLUR_FADE_DELAY = 0.05;

/**
 * 全局数据配置
 */
export const DATA = {
  ...siteConfig,
  // 项目信息（英文）
  name: projectConfig.fullName,
  subtitle: projectConfig.slogan.en,
  description: projectConfig.description.en,
  summary: projectConfig.description.en,
  location: "Xi'an, Shaanxi, China",
  locationLink: "https://www.xidian.edu.cn",
  surname: "XDYou",
  firstName: "Team",
  initials: "XD",
  // 其他配置
  navbar,
  contact,
  projectConfig,
  discover,
  footerResources,
  // 中文信息
  chinese: {
    name: projectConfig.fullName,
    subtitle: projectConfig.slogan.zh,
    description: projectConfig.description.zh,
  },
} as const;

export function getEmail(): string {
  return Object.values(DATA.contact.social)
    .filter((social) => social.name === "Email")
    .map((social) => social.url)[0];
}
