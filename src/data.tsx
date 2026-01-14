import { contact } from "@/config/contact";
import { discover, footerResources } from "@/config/footer";
import { navbar } from "@/config/navbar";
import { projectConfig } from "@/config/project";
import { siteConfig } from "@/config/site";

export const BLUR_FADE_DELAY = 0.05;

/**
 * 全局数据配置
 * @todo 考虑对数据结构进行重构以适应i18n。
 */
export const DATA = {
  ...siteConfig,
  name: projectConfig.fullName,
  description: projectConfig.description.en,
  navbar,
  contact,
  projectConfig,
  discover,
  footerResources,
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
