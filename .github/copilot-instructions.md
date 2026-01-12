# GitHub Copilot instructions for XDYou Homepage

简短目标
- 让 AI 代码代理快速上手：理解项目架构、关键文件、常用命令、内容格式（docs/news）、国际化与构建细节。

快速启动 ✅
- Node: engines 要求 `>=18.18.0 <=22`。
- 包管理器：优先使用 `pnpm`（仓库包含 `pnpm-lock.yaml`）。
- 本地开发：
  - 安装依赖：`pnpm install`
  - 启动开发服务器（Windows 环境脚本包含 `set`）：`pnpm dev`（等同于 `set NODE_OPTIONS=--no-deprecation && next dev --turbopack`）
  - 构建：`pnpm build` (`next build`)
  - 格式 / Lint：`pnpm lint`

项目大局（Architecture）🔧
- 基于 Next.js App Router（Next 15），TypeScript，TailwindCSS。
- 内容驱动站点：`contents/` 里放 markdown 内容（`contents/docs`、`contents/news`），由 `src/lib/docs.ts` / `src/lib/news.ts` 读入并在构建时渲染。
- 路由与渲染：
  - 文档页：`src/app/docs/[slug]/page.tsx` 使用 `generateStaticParams`、`generateMetadata`（静态预渲染）。
  - 新闻：`src/app/news/[slug]/page.tsx` 同样使用静态生成；有 API：`/api/news`、`/api/news/rss`、`/api/news/atom`（位于 `src/app/api/news/**`）。
- 组件划分：
  - Server Components（默认）用于页面和数据获取（没有 `"use client"`）。
  - Client Components 显式以 `"use client"` 开头，且常用 **`-client.tsx`** 后缀（例如 `news-list-client.tsx`, `releases-client.tsx`）。
- Markdown 渲染实现：`src/components/react-markdown.tsx`（支持 KaTeX、代码高亮、GitHub 风格 blockquote 警告、图像处理、heading id 生成和 TOC 对齐）。

一致性与约定 ✅
- 新的客户端组件建议使用 `-client.tsx` 命名并在文件头部添加 `"use client"`。
- 配置集中在 `src/config/`（`site.ts`, `project.ts`, `navbar.ts`, `footer.ts` 等）。多数配置使用 `as const`，请保持类型不变。
- 内容 frontmatter：遵循现有样例（参见 `contents/docs/*.md` 与 `contents/news/*.md`），解析由 `gray-matter` 完成。

重要文件参考（快速跳转）📚
- 内容与生成： `src/lib/docs.ts`, `src/lib/news.ts`
- 页面： `src/app/docs/[slug]/page.tsx`, `src/app/news/[slug]/page.tsx`
- API / Feed： `src/app/api/news/route.ts`, `src/app/api/news/rss/route.ts`, `src/app/api/news/atom/route.ts`
- Markdown 渲染与 UI： `src/components/react-markdown.tsx`, `src/components/project/*`, `src/components/ui/*`
- i18n： `src/lib/i18n/*`（`locales/zh.json` 和 `locales/en.json`）

常见任务与示例（具体操作）💡
- 新增文档页：
  1. 在 `contents/docs/` 新建 `my-topic.md`。
  2. 必要 frontmatter 示例：
     ```md
     ---
     title: "功能说明"
     description: "简短描述"
     order: 10
     category: "使用指南"
     ---
     ```
  3. 页面会被 `getAllDocSlugs()` 发现并在构建时生成静态页面。
- 新增新闻：
  - `contents/news/2026-01-01-new-feature-zh.md`，frontmatter 示例：
    ```md
    ---
    title: "新功能发布"
    date: "2026-01-01"
    author: "作者名"
    tags: ["release","news"]
    lang: "zh"
    ---
    ```
- 编辑文档注意：`react-markdown` 的 heading id 生成有特定规则（见 `generateHeadingId`），若需要 TOC 锚点请遵循它的字符处理。
- 如果要在页面里引用外部图片徽章（shields.io），`react-markdown` 会用普通 `<img>` 显示；其它图片使用 `next/image`（受限于 Next 的 images config）。

调试与运维提示 ⚠️
- Dev 使用 Turbopack (`next dev --turbopack`)：热刷新通常可见 markdown 与组件更改。
- API 路由与 feed: `/api/news` 返回 JSON，`/api/news/rss` 与 `/api/news/atom` 返回 XML（带 `Cache-Control: s-maxage=3600, stale-while-revalidate`）。
- 注意 Windows 环境：`dev` 脚本使用 `set NODE_OPTIONS=...`。跨平台 CI 可能需要用 `cross-env` 或修改脚本。

功能开发工作流 🚀
- 实现新功能或修复后，务必执行以下步骤：
  1. `pnpm lint` — 检查代码风格与 ESLint 规则
  2. `pnpm build` — 验证构建无错误（特别是 TypeScript 类型检查和静态生成）
  3. 通过后执行 `git commit` 提交变更
- 这确保提交的代码符合项目标准且能成功构建部署。

贡献与 PR 建议 ✅
- 小改动：在 PR 描述中指明改动类型（文档/组件/样式）并引用相关 MD 文件或页面路由。
- 内容变更：确保 frontmatter 字段齐全并且日期/slug 唯一（新闻根据文件名生成 slug）。

如果有遗漏或想补充的实践点，请指出我将更新此文件（例如：CI 流程、发布脚本、或更详细的组件开发约定）。
