import { contact } from "@/config/contact";
import { discover, footerResources } from "@/config/footer";
import { navbar } from "@/config/navbar";
import { projectConfig } from "@/config/project";
import { siteConfig } from "@/config/site";

export const BLUR_FADE_DELAY = 0.05;

/**
 * 全局数据配置
 */
export const DATA = {
  ...siteConfig,
  name: projectConfig.fullName,
  description: projectConfig.description.zh,
  navbar,
  contact,
  projectConfig,
  discover,
  footerResources,
} as const;
