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
- **技术栈**：Next.js 15 (App Router)、React 19、TypeScript 5.9、Tailwind CSS 4.1
- **内容驱动**：`contents/` 目录存放 Markdown 内容（`docs/`、`news/`），构建时由 `src/lib/` 读取并渲染
- **路由策略**：
  - 静态生成（SSG）：文档页 `[slug]`、新闻页 `[slug]` 使用 `generateStaticParams`
  - 动态渲染：首页、列表页根据数据动态生成
  - API 路由：`/api/news` 系列提供 JSON、RSS、Atom feeds
- **数据流**：
  - GitHub API → `src/lib/github.ts` → releases、contributors 数据
  - Markdown → `gray-matter` 解析 → 静态页面
  - Config → `src/config/*` → `src/data.tsx` → 全局访问
- **组件架构**：
  - **Server Components（默认）**：页面、数据获取、布局（无 `"use client"`）
  - **Client Components**：交互组件、客户端状态管理（显式 `"use client"`，建议 `-client.tsx` 后缀）
  - **共享组件**：`src/components/ui/*` (shadcn/ui)、`src/components/project/*` (业务组件)
- **Markdown 渲染**：
  - **服务端**：`src/lib/markdown-server.ts` - 使用 unified 管道（remarkGfm、Shiki 代码高亮、rehype-slug 自动生成 heading ID）
  - **客户端**：`src/components/react-markdown.tsx` - 仅用于客户端预览（TOC 使用 DOM 提取而非客户端渲染）
  - 支持：代码高亮（Shiki）、GitHub 风格警告、图像优化、Heading ID 自动生成
- **UI 风格与设计系统**：
  - **组件库**：shadcn/ui (基于 Radix UI)，位于 `src/components/ui/*`
  - **样式方案**：Tailwind CSS 4.1 (配置于 `globals.css`)
  - **主题系统**：next-themes 支持 light/dark/system 三种模式
  - **颜色规范**：
    - 背景：`bg-background` / `bg-card`
    - 文本：`text-foreground` / `text-muted-foreground`
    - 主色调：`bg-primary` / `text-primary`
    - 边框：`border` (使用 CSS 变量)
  - **间距规范**：使用 Tailwind 标准间距 (4px 基数)
  - **圆角规范**：`rounded-lg` (卡片)、`rounded-md` (按钮)、`rounded-full` (头像)
  - **动画效果**：
    - BlurFade：页面元素渐入动画
    - 自定义 keyframes：slide-fade、slide-left、slide-right
    - Transition：使用 `transition-colors`、`transition-transform` 等
  - **响应式设计**：移动优先，断点 sm/md/lg/xl/2xl
  - **字体**：Geist Sans (正文)、Geist Mono (代码)，通过 next/font 优化
- **国际化（i18n）**：
  - 双语支持：中文（默认）、英文
  - 策略：查询参数 `?lang=en`（无中间件重定向）
  - Cookie 持久化：`NEXT_LOCALE` cookie（1年有效期）
  - 解析优先级：URL 参数 > Cookie > Accept-Language > 默认

一致性与约定 ✅
- **组件命名**：客户端组件使用 `-client.tsx` 后缀并在文件头部添加 `"use client"`
- **配置管理**：集中在 `src/config/`，多数使用 `as const` 保持类型不变
- **UI 一致性**：
  - 使用 `cn()` 工具函数合并类名 (`@/lib/utils.tsx`)
  - 复用 shadcn/ui 组件而非自定义实现
  - 遵循现有组件的视觉风格和交互模式
  - 颜色使用 CSS 变量 (支持主题切换)
- **页面开发**：
  - 使用 `PAGE_CONTAINER_CLASSES` 统一容器样式
  - 使用 `PageHeader` 组件统一页面标题
  - 使用 `page-helpers.ts` 中的辅助函数 (元数据、i18n、locale)
- **内容规范**：遵循现有 Markdown frontmatter 格式 (docs/news)

项目特色功能 🌟
- **动态图标系统**：动态生成带圆角的 favicon (32x32) 和 icon (192x192)，使用 sharp 库处理
- **截图轮播系统**：自动播放 (6秒) + 手动导航 + 智能预加载 + 方向感知动画 + 全屏模式 + 触摸/键盘支持
- **GitHub 深度集成**：自动获取 releases (下载统计、SHA-256)、贡献者信息 (avatar + 链接)
- **Feed 支持**：RSS 2.0、Atom 1.0，CDN 缓存策略 (s-maxage=3600, stale-while-revalidate)
- **SEO 优化**：JSON-LD 结构化数据、动态 sitemap、robots.txt、PWA manifest、Open Graph
- **性能优化**：
  - 图片：WebP 格式、尺寸优化 (deviceSizes: 4个, imageSizes: 6个)、减少约 70% 变体数量
  - 头像：GitHub avatars 自动附加 `?s=<size>` 参数 (默认 48px，对话框 96px)
  - 字体：Geist 通过 next/font 自动优化
  - 构建：19 个静态页面 (SSG)、服务端 Markdown 预渲染、依赖精简 (~80KB)

重要文件参考（快速跳转）📚
- **内容与生成**：`docs.ts`, `news.ts`, `github.ts`, `contributors.ts`
- **页面辅助**：`page-helpers.ts`, `api-helpers.ts`, `utils.tsx`, `env.ts`
- **路由页面**：`page.tsx` (首页含 ContributorsSection), `docs/[slug]`, `news/[slug]`, `releases`, `not-found`
- **API/Feed**：`api/news` (JSON), `api/news/rss`, `api/news/atom`
- **组件库**：`react-markdown.tsx`, `project/*`, `ui/*` (shadcn/ui), `blocks/navbar/`, `blocks/footer.tsx`, `layout/page-header.tsx`
- **配置中心**：`site.ts`, `project.ts` (含 assetPatterns), `navbar.ts`, `footer.ts`, `contact.ts`, `contributors.ts`, `data.tsx`
- **国际化**：`i18n/config.ts`, `locales/{zh,en}.json`, `resolve.ts`, `server-headers.ts`, `client.tsx`, `dictionaries.ts`, `server.ts`
- **基础设施**：`middleware.ts`, `layout.tsx`, `globals.css`, `next.config.ts`, `eslint.config.mts`, `tsconfig.json`
- **内容文件**：`contents/docs/*.md`, `contents/news/*.md`

代码架构最佳实践 🏗️
1. **页面开发模板**：
   ```tsx
   import { PageHeader } from "@/components/layout/page-header";
   import {
     generateSimpleMetadata,
     getPageI18n,
     PAGE_CONTAINER_CLASSES,
     type PageProps,
   } from "@/lib/page-helpers";

   export async function generateMetadata({ searchParams }: PageProps) {
     return generateSimpleMetadata(searchParams, "section.title", "section.description");
   }

   export default async function MyPage({ searchParams }: PageProps) {
     const { locale, dict } = await getPageI18n(searchParams);
     
     return (
       <main className={PAGE_CONTAINER_CLASSES.standard}>
         <PageHeader title={dict.section.title} description={dict.section.description} />
         {/* 页面内容 */}
       </main>
     );
   }
   ```

2. **i18n 使用规范**：
   - **禁止硬编码文本**：所有用户可见文本必须来自 i18n 字典
   - **服务端**：使用 `getPageI18n(searchParams)` 或 `getDictionary(locale)`
   - **客户端**：使用 `useDictionary()` 和 `useLocale()` hooks
   - **本地化选择**：使用 `selectLocalizedText(locale, { en: "...", zh: "..." })`
   - 新增文本时同步更新 `locales/en.json` 和 `locales/zh.json`

3. **容器类名规范**：
   使用 `PAGE_CONTAINER_CLASSES` 常量而非硬编码：
   - `standard`: 标准页面布局 (max-w-7xl)
   - `article`: 文章阅读布局 (max-w-4xl)
   - `home`: 首页布局 (更大间距)
   - `docs`: 文档页面布局 (无右侧边距，留给 TOC)

4. **组件复用原则**：
   - 页面头部使用 `PageHeader` 或 `PageHeaderWithActions`
   - 避免重复实现标题+描述+BlurFade 的布局模式
   - 相似功能提取为可复用组件或工具函数

5. **资产模式配置规范**：
   使用 `projectConfig.assetPatterns` 进行平台资产匹配，避免硬编码：
   - **配置位置**：`src/config/project.ts` 中的 `assetPatterns` 对象
   - **格式示例**：
     ```typescript
     assetPatterns: {
       android: [
         { pattern: /app-arm64-v8a-release\.apk$/i, displayName: "ARM64" },
       ],
       linux: [
         { pattern: /watermeter-linux-release-amd64\.zip$/i, displayName: "ZIP (amd64)" },
       ],
     }
     ```
   - **使用方式**：`projectConfig.assetPatterns.android[0].pattern.test(asset.name)`
   - **优势**：统一资产匹配逻辑、易于维护、类型安全

6. **Markdown 内容规范**：
   - **文档** (`contents/docs/*.md`)：
     ```md
     ---
     title: "功能说明"
     description: "简短描述"
     order: 10
     category: "使用指南"
     ---
     ```
   - **新闻** (`contents/news/*.md`)：
     ```md
     ---
     title: "新功能发布"
     date: "2026-01-01"
     author: "作者名"
     tags: ["release", "news"]
     lang: "zh"
     ---
     ```
   - 文件名即 slug（新闻需包含日期前缀，如 `2026-01-01-title-zh.md`）

常见任务与示例（具体操作）💡
- **新增文档页**：
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

- **新增新闻**：
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

- **新增 i18n 文本**：
  1. 在 `src/lib/i18n/locales/en.json` 和 `zh.json` 中添加相同结构的键值对
  2. 如果是客户端使用，需同步更新 `src/lib/i18n/client.tsx` 中的 `Dictionary` 类型定义
  3. 在组件中通过 `dict.section.key` 访问

- **新增页面**：
  1. 参考"代码架构最佳实践"中的模板
  2. 使用统一的 `PageProps` 类型
  3. 使用 `generateSimpleMetadata` 生成元数据
  4. 使用 `getPageI18n` 获取 locale 和 dict
  5. 使用 `PAGE_CONTAINER_CLASSES` 选择容器样式
  6. 使用 `PageHeader` 组件渲染标题

- **文档 TOC 实现**：
  - 文档页面使用 `DocToc` 组件（`src/components/project/doc-toc.tsx`）
  - 从渲染后的 HTML DOM 提取标题（而非 Markdown 解析）
  - 使用 `querySelector('.prose')` 查找 h1-h6 元素
  - 读取 `element.id`（由 rehype-slug 服务端生成）、`textContent`、`tagName`
  - 支持滚动跟踪和锚点导航
- 如果要在页面里引用外部图片徽章（shields.io），会用普通 `<img>` 显示；其它图片使用 `next/image`（受限于 Next 的 images config）。

调试与运维提示 ⚠️
- **开发前准备**：
  1. 确认 Node 版本在 18.18.0 ~ 22 范围内
  2. 使用 `pnpm install` 安装依赖
  3. 了解要修改的模块和相关文件

- **开发过程**：
  1. 启动开发服务器：`pnpm dev`
  2. 按需修改代码、配置或内容
  3. 浏览器实时预览更改（Turbopack 热刷新）
  4. 遵循项目约定（见"代码架构最佳实践"）

- **提交前验证**（必须执行）：
  1. `pnpm lint` - 检查代码风格与 ESLint 规则
  2. `pnpm build` - 验证构建无错误（TypeScript 类型检查 + 静态生成）
  3. 确认构建成功（19 个静态页面生成）
  4. 执行 `git commit` 提交变更

- **常见开发场景**：
  - **修改配置**：编辑 `src/config/*.ts`，自动类型检查
  - **新增内容**：在 `contents/` 添加 Markdown 文件，无需重启
  - **调整样式**：修改 Tailwind 类名或 `globals.css`，即时生效
  - **更新 i18n**：同步修改 `locales/en.json` 和 `zh.json`
  - **添加组件**：客户端组件使用 `-client.tsx` 后缀

- **调试技巧**：
  - 使用 VS Code 的 TypeScript 错误提示
  - 检查浏览器控制台的运行时错误
  - 使用 `console.log` 调试（仅开发环境）
  - 查看 Next.js 编译输出（终端信息）

这确保提交的代码符合项目标准且能成功构建部署。

贡献与 PR 建议 ✅
- 小改动：在 PR 描述中指明改动类型（文档/组件/样式）并引用相关 MD 文件或页面路由。
- 内容变更：确保 frontmatter 字段齐全并且日期/slug 唯一（新闻根据文件名生成 slug）。
- 新功能开发：
  - 遵循"代码架构最佳实践"中的规范
  - 复用现有辅助函数和组件
  - 避免重复实现已有功能
  - 保持 i18n 完整性（同步更新英文和中文）

性能优化实践指南 ⚡
- **图片使用**：
  - 优先使用 WebP 格式
  - 使用 Next.js Image 组件而非 `<img>` 标签
  - GitHub 头像会自动添加尺寸参数，无需手动处理
  - 避免添加过多 deviceSizes 和 imageSizes 配置
  
- **依赖管理**：
  - 定期检查未使用的依赖（`pnpm list`）
  - 移除不需要的库减少打包体积
  - 优先选择体积小的替代方案
  
- **服务端优先**：
  - 优先使用 Server Components（默认）
  - 仅在需要交互时使用 Client Components
  - 数据获取和计算在服务端完成
  
- **Markdown 处理**：
  - Markdown 在服务端预渲染为 HTML
  - 客户端通过 DOM 操作处理已渲染内容
  - 避免在客户端重复解析 Markdown
  
- **资源配置**：
  - 使用配置文件管理资产模式（`assetPatterns`）
  - 避免硬编码文件名和正则表达式
  - 保持配置集中化便于维护

如果有遗漏或想补充的实践点，请指出我将更新此文件（例如：CI 流程、发布脚本、或更详细的组件开发约定）。
