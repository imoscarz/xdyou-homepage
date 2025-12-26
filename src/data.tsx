import { contact, navbar } from "@/config/contact";
import { education } from "@/config/education";
import { discover, footerResources } from "@/config/footer";
import { news } from "@/config/news";
import { personalInfo } from "@/config/personal";
import { projects } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { skills } from "@/config/skills";

export const BLUR_FADE_DELAY = 0.05;

/**
 * 全局数据配置
 * 为了保持向后兼容，保留了 chinese 嵌套结构
 */
export const DATA = {
  ...siteConfig,
  // 英文信息（默认）
  name: personalInfo.name.en,
  subtitle: personalInfo.subtitle.en,
  description: personalInfo.description.en,
  summary: personalInfo.summary.en,
  location: personalInfo.location,
  locationLink: personalInfo.locationLink,
  surname: personalInfo.surname,
  firstName: personalInfo.firstName,
  initials: personalInfo.initials,
  // 其他配置
  navbar,
  contact,
  news,
  projects,
  skills,
  education,
  discover,
  footerResources,
  // 中文信息（向后兼容）
  chinese: {
    name: personalInfo.name.zh,
    subtitle: personalInfo.subtitle.zh,
    description: personalInfo.description.zh,
    summary: personalInfo.summary.zh,
    blogDescription: siteConfig.chinese.blogDescription,
  },
} as const;

export function getEmail(): string {
  return Object.values(DATA.contact.social)
    .filter((social) => social.name === "Email")
    .map((social) => social.url)[0];
}
