/**
 * 页面辅助函数
 * 提供通用的页面逻辑，减少重复代码
 */

import { Metadata } from "next";

import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/**
 * 页面 props 类型
 */
export type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * 获取页面的 locale 和 dictionary
 * 统一处理页面的国际化数据获取
 */
export async function getPageI18n(searchParams: PageProps["searchParams"]) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);
  return { locale, dict };
}

/**
 * 生成简单的页面元数据
 * @param searchParams - 页面的 searchParams
 * @param titleKey - dictionary 中的标题键路径（例如 "releases.title"）
 * @param descriptionKey - dictionary 中的描述键路径（例如 "releases.description"）
 */
export async function generateSimpleMetadata(
  searchParams: PageProps["searchParams"],
  titleKey: string,
  descriptionKey: string,
): Promise<Metadata> {
  const { dict } = await getPageI18n(searchParams);
  
  // 解析嵌套键路径
  const title = getNestedValue(dict, titleKey);
  const description = getNestedValue(dict, descriptionKey);

  return {
    title: title || "Page",
    description: description || "",
  };
}

/**
 * 从对象中获取嵌套值
 * @param obj - 源对象
 * @param path - 点分隔的路径字符串（例如 "releases.title"）
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as string || "";
}

/**
 * 根据 locale 选择本地化文本
 * @param locale - 当前语言环境
 * @param en - 英文文本
 * @param zh - 中文文本
 */
export function selectLocalizedText(
  locale: Locale,
  options: { en: string; zh: string },
): string {
  return locale === "en" ? options.en : options.zh;
}

/**
 * 通用的页面容器类名
 */
export const PAGE_CONTAINER_CLASSES = {
  // 标准 max-w-7xl 容器（大多数列表/网格页面）
  standard:
    "mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20 xl:px-32 xl:py-24",
  // 文章内容容器（max-w-4xl，用于阅读体验）
  article:
    "mx-auto flex min-h-dvh max-w-4xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20",
  // 首页容器（更大间距）
  home: "mx-auto flex min-h-dvh max-w-7xl flex-col space-y-16 px-6 py-8 pb-24 sm:space-y-20 sm:px-16 md:px-20 md:py-16 md:pt-14 lg:px-24 lg:py-20 xl:px-32 xl:py-24",
  // 文档页面容器（无右侧边距，留给 TOC）
  docs: "mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20",
} as const;
