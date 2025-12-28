import { contact } from "@/config/contact";
import { discover, footerResources } from "@/config/footer";
import { navbar } from "@/config/navbar";
import { projectConfig } from "@/config/project";
import { siteConfig } from "@/config/site";

export const BLUR_FADE_DELAY = 0.05;

/**
 * 全局数据配置
 * @deprecated This section will be removed in future versions.
 */
export const DATA = {
  ...siteConfig,
  // 项目信息（英文） — 保留兼容字段
  name: projectConfig.fullName,
  description: projectConfig.description.en,
  // 其他配置：仅保留核心配置
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
