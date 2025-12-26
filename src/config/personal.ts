import { env } from "@/lib/env";

// 可以在这里自定义详细的个人介绍
const summaryEn = `Hi, I'm Oscar Zeng, a Developer and College Student majoring in Electronic Engineering. I'm currently studying at Xidian University in Shaanxi, China. My passion lies in software development and exploring the latest advancements in technology. Feel free to connect with me to discuss projects, ideas, or just to say hi!`;

const summaryZh = `你好，我是Oscar Zeng，一名开发者和电子工程专业的大学生。目前我在中国陕西的西安电子科技大学学习。我热衷于软件开发和探索最新的技术进展。欢迎与我联系，讨论项目、想法，或者只是打个招呼！`;

export const personalInfo = {
  // 基础信息 - 使用环境变量配置
  name: {
    en: env.displayName,
    zh: env.displayName,
  },
  subtitle: {
    en: env.subtitle,
    zh: env.subtitle,
  },
  description: {
    en: env.description,
    zh: env.description,
  },
  summary: {
    en: summaryEn,
    zh: summaryZh,
  },
  
  // 地理位置信息 - 不区分语言
  location: env.location,
  locationLink: env.locationLink,
  
  // 其他信息 - 保持手动配置
  surname: "imoscarz",
  firstName: "",
  initials: "OZ",
} as const;

/**
 * 类型定义
 */
export type Locale = "en" | "zh";

/**
 * 获取指定语言的个人信息
 */
export function getPersonalInfo(locale: Locale) {
  return {
    name: personalInfo.name[locale],
    subtitle: personalInfo.subtitle[locale],
    description: personalInfo.description[locale],
    summary: personalInfo.summary[locale],
    location: personalInfo.location,
    locationLink: personalInfo.locationLink,
    surname: personalInfo.surname,
    firstName: personalInfo.firstName,
    initials: personalInfo.initials,
  };
}
