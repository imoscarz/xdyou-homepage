/**
 * 服务端 Markdown 渲染器
 * 替代客户端的 react-markdown + shiki + katex
 * 预计节省 810 KB JavaScript
 */

import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Shiki 代码高亮配置
 */
const rehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  keepBackground: false,
  defaultLang: "plaintext",
} as const;

/**
 * 服务端 Markdown 转 HTML
 * - 完全在服务端处理，不需要客户端 JS
 * - 支持 GitHub Flavored Markdown
 * - 支持 KaTeX 数学公式
 * - 支持代码高亮（Shiki）
 * - 自动生成 heading ID
 *
 * @param markdown - Markdown 内容
 * @returns 渲染后的 HTML 字符串
 *
 * @example
 * ```typescript
 * const html = await renderMarkdownToHTML(markdownContent);
 * // 直接用 dangerouslySetInnerHTML 渲染
 * ```
 */
export async function renderMarkdownToHTML(
  markdown: string,
): Promise<string> {
  const result = await unified()
    .use(remarkParse) // 解析 Markdown
    .use(remarkGfm) // GitHub Flavored Markdown 扩展
    .use(remarkMath) // 数学公式支持
    .use(remarkRehype, { allowDangerousHtml: true }) // 转换为 HTML AST
    .use(rehypeSlug) // 自动生成 heading ID
    .use(rehypePrettyCode, { theme: rehypePrettyCodeOptions.theme, keepBackground: false, defaultLang: "plaintext" }) // 代码高亮
    .use(rehypeKatex) // 数学公式渲染
    .use(rehypeStringify, { allowDangerousHtml: true }) // 转换为 HTML 字符串
    .process(markdown);

  return String(result);
}

/**
 * 从 Markdown 提取标题（用于生成目录）
 * 简单的正则表达式实现，避免再次解析
 *
 * @param markdown - Markdown 内容
 * @returns 标题数组
 *
 * @example
 * ```typescript
 * const headings = extractHeadings(markdownContent);
 * // [
 * //   { id: "introduction", text: "Introduction", level: 1 },
 * //   { id: "getting-started", text: "Getting Started", level: 2 },
 * // ]
 * ```
 */
export function extractHeadings(markdown: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    
    // 生成 ID：转小写，移除特殊字符，用 - 连接
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // 移除特殊字符
      .replace(/\s+/g, "-") // 空格转 -
      .replace(/-+/g, "-"); // 多个 - 合并为单个

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * 生成 Markdown 目录 HTML
 * 用于在页面侧边栏显示
 *
 * @param headings - 标题数组
 * @returns 目录 HTML
 */
export function generateTableOfContents(
  headings: Array<{ id: string; text: string; level: number }>,
): string {
  if (headings.length === 0) return "";

  const toc = headings
    .map(
      (heading) =>
        `<li class="toc-level-${heading.level}"><a href="#${heading.id}">${heading.text}</a></li>`,
    )
    .join("\n");

  return `<ul class="prose-toc">${toc}</ul>`;
}
