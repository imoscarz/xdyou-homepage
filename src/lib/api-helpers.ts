import { NextResponse } from "next/server";

import { getAllNewsPosts, NewsPost } from "./news";

/**
 * API 路由辅助函数集合
 * 提供统一的请求解析、过滤和响应处理
 */

/**
 * 从请求 URL 中解析语言参数并过滤新闻列表
 */
export async function getFilteredNewsPosts(
  request: Request,
): Promise<{ posts: NewsPost[]; lang: string | null }> {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");

  let posts = await getAllNewsPosts();

  // 根据语言筛选
  if (lang) {
    posts = posts.filter((post) => post.lang === lang);
  }

  return { posts, lang };
}

/**
 * 统一的 API 错误响应格式
 */
export function apiErrorResponse(
  message: string,
  error: unknown,
  status: number = 500,
) {
  console.error(`${message}:`, error);
  return NextResponse.json({ error: message }, { status });
}

/**
 * 统一的缓存响应头配置
 * CDN 友好：1小时缓存 + stale-while-revalidate
 */
export const API_CACHE_HEADERS = {
  "Cache-Control": "s-maxage=3600, stale-while-revalidate",
} as const;

/**
 * 生成带语言参数的 URL 查询字符串
 */
export function buildLangParam(lang: string | null): string {
  return lang ? `?lang=${lang}` : "";
}

/**
 * 生成语言描述文本
 */
export function buildLangDescription(lang: string | null): string {
  return lang ? ` (${lang})` : "";
}

/**
 * 生成语言标识
 */
export function buildLangTag(lang: string | null): string {
  return lang || "zh-cn";
}
