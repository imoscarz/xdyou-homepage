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
- **Markdown 渲染**：`src/components/react-markdown.tsx`
  - 支持：KaTeX 数学公式、代码高亮（Shiki）、GitHub 风格警告、图像优化
  - Heading ID 自动生成、TOC 目录对齐
- **样式系统**：
  - Tailwind CSS 4.1（配置于 `globals.css`）
  - 主题支持：`next-themes`（light/dark/system）
  - 动画：自定义 keyframes（slide-fade、slide-left、slide-right）
  - 字体：Geist Sans、Geist Mono（由 `next/font` 加载）
- **国际化（i18n）**：
  - 双语支持：中文（默认）、英文
  - 策略：查询参数 `?lang=en`（无中间件重定向）
  - Cookie 持久化：`NEXT_LOCALE` cookie（1年有效期）
  - 解析优先级：URL 参数 > Cookie > Accept-Language > 默认

一致性与约定 ✅
- 新的客户端组件建议使用 `-client.tsx` 命名并在文件头部添加 `"use client"`。
- 配置集中在 `src/config/`（`site.ts`, `project.ts`, `navbar.ts`, `footer.ts` 等）。多数配置使用 `as const`，请保持类型不变。
- 内容 frontmatter：遵循现有样例（参见 `contents/docs/*.md` 与 `contents/news/*.md`），解析由 `gray-matter` 完成。
- **页面开发规范**：
  - 使用 `src/lib/page-helpers.ts` 中的统一辅助函数（`PageProps`, `getPageI18n`, `generateSimpleMetadata`, `selectLocalizedText`, `PAGE_CONTAINER_CLASSES`）
  - 使用 `src/components/layout/page-header.tsx` 中的可复用头部组件（`PageHeader`, `PageHeaderWithActions`）
  - 避免重复实现元数据生成、locale 获取、容器类名等逻辑

项目特色功能 🌟
- **动态图标系统**：
  - `src/app/favicon.ico` 和 `src/app/icon.png` - 动态生成带圆角的 favicon
  - 使用 `sharp` 库进行图像处理（32x32 favicon，192x192 icon）
  
- **截图轮播系统**（`src/components/project/screenshots-section.tsx`）：
  - 自动播放（6秒间隔）+ 手动导航
  - 智能图片预加载（当前 + 前后各 1 张）
  - 方向感知动画（slide-left / slide-right）
  - 全屏模式支持触摸滑动和键盘导航
  - 响应式设计（移动端优化）
  
- **GitHub 深度集成**：
  - 自动获取最新 releases（`src/lib/github.ts`）
  - 下载统计和校验和信息（SHA-256）
  - 多平台下载按钮（Windows/Linux/macOS）
  - 贡献者信息展示（avatar + GitHub 链接）
  
- **Feed 支持**（`src/app/api/news/`）：
  - RSS 2.0 格式（`/api/news/rss`）
  - Atom 1.0 格式（`/api/news/atom`）
  - CDN 友好缓存策略（s-maxage=3600, stale-while-revalidate）
  - 自动生成基于 Markdown 新闻内容
  
- **SEO 全面优化**：
  - JSON-LD 结构化数据（`src/app/jsonld.tsx` - WebSite + Organization）
  - 动态 sitemap（`src/app/sitemap.ts` - 包含所有页面）
  - robots.txt 配置（`src/app/robots.ts` - 允许所有爬虫）
  - PWA manifest（`src/app/manifest.ts` - 支持安装到桌面）
  - Open Graph 和 Twitter Cards（每页自动生成）
  
- **性能优化**：
  - 图片优化（Next.js Image 组件 + WebP 格式）
  - 字体优化（Geist 字体 next/font 自动优化）
  - 代码分割（按路由自动分割）
  - 静态生成 20 个页面（首次加载快）

重要文件参考（快速跳转）📚
- **内容与生成**： 
  - `src/lib/docs.ts` - 文档内容读取与处理
  - `src/lib/news.ts` - 新闻内容读取与处理
  - `src/lib/github.ts` - GitHub API 集成（releases、contributors）
  - `src/lib/contributors.ts` - 贡献者信息处理
  
- **页面辅助工具**： 
  - `src/lib/page-helpers.ts` - 统一的页面逻辑（元数据、i18n、容器类名）
  - `src/lib/api-helpers.ts` - API 路由辅助函数（请求解析、过滤、响应）
  - `src/lib/utils.tsx` - 通用工具函数（cn、formatDate、jsonldScript）
  - `src/lib/env.ts` - 环境变量管理
  - `src/lib/hooks/useSearch.ts` - 通用搜索过滤 Hook
  
- **路由页面**： 
  - `src/app/page.tsx` - 首页
  - `src/app/docs/[slug]/page.tsx` - 文档详情页
  - `src/app/news/[slug]/page.tsx` - 新闻详情页
  - `src/app/releases/page.tsx` - 发行记录页
  - `src/app/contributors/page.tsx` - 贡献者页
  - `src/app/not-found.tsx` - 404 页面
  
- **API / Feed**： 
  - `src/app/api/news/route.ts` - 新闻 JSON API
  - `src/app/api/news/rss/route.ts` - RSS feed
  - `src/app/api/news/atom/route.ts` - Atom feed
  
- **组件库**： 
  - `src/components/react-markdown.tsx` - Markdown 渲染器
  - `src/components/project/*` - 项目特定组件（hero、features、screenshots 等）
  - `src/components/ui/*` - UI 基础组件（shadcn/ui）
  - `src/components/blocks/navbar/` - 导航栏组件（navbar、language-toggle、mode-toggle）
  - `src/components/blocks/footer.tsx` - 页脚组件
  - `src/components/layout/page-header.tsx` - 可复用页面头部
  
- **配置中心**： 
  - `src/config/site.ts` - 站点基础配置（URL、favicon、lastUpdated）
  - `src/config/project.ts` - 项目配置（名称、描述、功能、截图、平台）
  - `src/config/navbar.ts` - 导航栏配置
  - `src/config/footer.ts` - 页脚配置
  - `src/config/contact.ts` - 联系方式配置
  - `src/config/contributors.ts` - 贡献者配置
  - `src/data.tsx` - 全局数据聚合（整合所有配置）
  
- **国际化（i18n）**： 
  - `src/lib/i18n/config.ts` - i18n 配置（locales、defaultLocale）
  - `src/lib/i18n/locales/zh.json` - 中文字典
  - `src/lib/i18n/locales/en.json` - 英文字典
  - `src/lib/i18n/resolve.ts` - 统一的 locale 解析器
  - `src/lib/i18n/server-headers.ts` - 服务端 locale 解析（server-only）
  - `src/lib/i18n/client.tsx` - 客户端 hooks（useLocale、useDictionary）
  - `src/lib/i18n/dictionaries.ts` - 字典加载器
  - `src/lib/i18n/server.ts` - 服务端辅助函数
  
- **基础设施**： 
  - `src/middleware.ts` - Next.js 中间件（当前为空实现，i18n 使用查询参数策略）
  - `src/app/layout.tsx` - 根布局（元数据、主题、字体）
  - `src/app/globals.css` - 全局样式（Tailwind、动画、主题变量）
  - `next.config.ts` - Next.js 配置（图片优化、远程模式）
  - `eslint.config.mts` - ESLint 配置
  - `tsconfig.json` - TypeScript 配置
  
- **内容文件**： 
  - `contents/docs/*.md` - 文档 Markdown 文件（frontmatter: title, description, order, category）
  - `contents/news/*.md` - 新闻 Markdown 文件（frontmatter: title, date, author, tags, lang）

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

5. **Markdown 内容规范**：
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

- 编辑文档注意：`react-markdown` 的 heading id 生成有特定规则（见 `generateHeadingId`），若需要 TOC 锚点请遵循它的字符处理。
- 如果要在页面里引用外部图片徽章（shields.io），`react-markdown` 会用普通 `<img>` 显示；其它图片使用 `next/image`（受限于 Next 的 images config）。

调试与运维提示 ⚠️
- **开发服务器**：
  - 使用 Turbopack：`pnpm dev` (等同于 `next dev --turbopack`)
  - 热刷新：Markdown 内容、组件更改即时可见
  - 端口：默认 `http://localhost:3000`
  
- **API 路由**：
  - `/api/news` - JSON 格式新闻列表（支持 `?lang=en/zh` 过滤）
  - `/api/news/rss` - RSS 2.0 feed（带缓存：`s-maxage=3600, stale-while-revalidate`）
  - `/api/news/atom` - Atom 1.0 feed（同样缓存策略）
  
- **环境变量**：
  - 通过 `src/lib/env.ts` 管理（使用 `@t3-oss/env-nextjs` 验证）
  - 公共变量：`NEXT_PUBLIC_*` 前缀
  
- **图片优化**：
  - 远程图片域名在 `next.config.ts` 中配置 `remotePatterns`
  - 支持域名：`cdn.imoscarz.me`、GitHub avatars、shields.io 等
  - 格式：WebP（自动优化）
  - 缓存：31 天 TTL
  
- **构建输出**：
  - 静态页面：20 个（docs、news、其他）
  - 路由类型：○ Static、● SSG、ƒ Dynamic
  - First Load JS：约 102 KB 共享，首页 ~556 KB
  
- **跨平台注意**：
  - Windows：`dev` 脚本使用 `set NODE_OPTIONS=...`
  - CI/CD：考虑使用 `cross-env` 确保环境变量跨平台兼容
  
- **脚本工具**：
  - `scripts/update-build-date.mjs` - 自动更新构建日期到 `site.ts`
  - `scripts/check-external-images.mjs` - 检查外部图片链接有效性
  - 构建前自动执行：`pnpm prebuild`

功能开发工作流 🚀
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
  3. 确认构建成功（20 个静态页面生成）
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

功能开发工作流 🚀
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
  3. 确认构建成功（20 个静态页面生成）
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

如果有遗漏或想补充的实践点，请指出我将更新此文件（例如：CI 流程、发布脚本、或更详细的组件开发约定）。
