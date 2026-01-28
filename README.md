<div align="center">


# XDYou 主页

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

XDYou 项目的主页，为西安电子科技大学学生提供课程表查询、考试安排、校园服务等功能的移动应用。

</div>

## 项目结构

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API 路由（新闻 RSS/Atom feed）
│   │   ├── docs/               # 文档页面
│   │   ├── news/               # 新闻页面
│   │   ├── releases/           # 版本发布页面
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── blocks/             # 页面块组件（导航栏、底栏）
│   │   ├── layout/             # 布局组件（页面头部等）
│   │   ├── project/            # 项目相关组件
│   │   ├── ui/                 # UI 基础组件（shadcn/ui）
│   │   └── icons.tsx           # 图标组件集中管理
│   ├── config/                 # 配置文件
│   │   ├── project.ts          # 项目主配置
│   │   ├── contributors.ts     # 贡献者信息
│   │   ├── navbar.ts           # 导航栏配置
│   │   ├── footer.ts           # 页脚配置
│   │   └── ...
│   ├── lib/                    # 工具库
│   │   ├── github.ts           # GitHub API 工具
│   │   ├── docs.ts             # 文档处理
│   │   ├── news.ts             # 新闻处理
│   │   ├── markdown-server.ts  # 服务端 Markdown 渲染
│   │   ├── page-helpers.ts     # 页面开发辅助函数
│   │   ├── i18n/               # 国际化
│   │   └── utils.tsx           # 通用工具
│   └── contents/               # Markdown 内容文件
│       ├── docs/               # 文档 Markdown
│       └── news/               # 新闻 Markdown
├── public/                     # 静态资源
│   ├── img/                    # 图片资源
│   └── icon/                   # 图标资源
└── package.json                # 项目配置
```

## 配置

主页的配置文件位于 `src/config` 目录下，主要配置文件说明：

- **`project.ts`** - 项目核心配置（截图、功能列表、下载链接、资产模式等）
- **`contributors.ts`** - 贡献者信息配置
- **`navbar.ts`** - 导航栏配置
- **`footer.ts`** - 页脚配置
- **`site.ts`** - 站点元数据配置

### 重要配置说明

#### 资产模式配置 (`project.ts`)

项目使用集中化的资产模式配置来匹配不同平台的发布资产：

```typescript
assetPatterns: {
  android: [
    { pattern: /app-arm64-v8a-release\.apk$/i, displayName: "ARM64" },
    { pattern: /app-armeabi-v7a-release\.apk$/i, displayName: "ARMv7" },
  ],
  linux: [
    { pattern: /watermeter-linux-release-amd64\.zip$/i, displayName: "ZIP (amd64)" },
  ],
  // ...
}
```

#### 截图配置 (`project.ts`)

截图支持两种类型标记：

```typescript
{
  src: "/img/screenshots/desktop-1.png",
  alt: "桌面端截图",
  caption: "课程表视图",
  type: "desktop"  // 或 "mobile"
}
```

- **desktop 类型**：桌面端单张显示，移动端不显示
- **mobile 类型**：桌面端两张一组并排显示，移动端单张显示

#### 贡献者链接配置 (`contributors.ts`)

贡献者的社交链接需按以下格式配置：

```typescript
links: [
  { icon: "github", text: "GitHub", url: "https://github.com/username" },
  { icon: "email", text: "邮件", url: "mailto:user@example.com" }
]
```

**注意**：图标必须在 `src/components/icons.tsx` 中预先声明，不要直接从 `lucide-react` 导入。



## 贡献

### 快速开始

项目使用 `pnpm` 进行包管理，推荐使用 Node.js 18-22 版本。

```shell
# 安装依赖
pnpm install

# 启动开发服务器（支持 Turbopack）
pnpm dev

# 检查外部图片引用
pnpm check:images

# 执行代码检查
pnpm lint

# 执行生产构建
pnpm build

# 启动生产服务器
pnpm start
```

### 贡献文档

项目文档的源文件位于 `contents/docs` 目录中。

**注意事项：**
- 出于维护方便考虑，从文档目录进入文档内容后会将 i18n 选项固定为中文，因此文档不需要考虑国际化
- Markdown 文件的文件名将作为 `slug` 参数，即网页 URL 的后缀

#### Markdown Frontmatter 配置

| 参数        | 类型   | 说明                                      |
| ----------- | ------ | ----------------------------------------- |
| title       | string | 文档的标题                                |
| description | string | 文档的简介，将会在目录页显示在标题下方    |
| category    | string | 文档的分类                                |
| order       | number | 文档排序时的权重，将会决定文档的显示顺序  |

**示例：**

```markdown
---
title: "配置指南"
description: "了解如何配置 XDYou"
category: "入门指南"
order: 2
---
```

#### 编写文档时的注意事项

1. **图片引用**：由于 Next.js 的安全策略限制与图片优化需要，您无法引用在 `next.config.ts` 中 `remotePatterns` 声明过的 hostname 之外的站点的图片。因此，在引用图片时，请将图片存放在 `public/img` 下的适当位置并通过相对链接引用图片。
   
   **图片检查**：项目已配置 CI 自动检查，本地也可运行 `pnpm check:images` 验证所有图片引用是否合规。

2. **GFM 支持**：文档支持使用 GitHub Flavored Markdown 的特性，如带有提示的引用块（alerts）：
   ```markdown
   > [!NOTE]
   > 这是一个提示信息
   
   > [!WARNING]
   > 这是一个警告信息
   ```

3. **代码高亮**：支持语法高亮的代码块（Shiki），使用三个反引号并指定语言。

### 添加新闻

新闻的源文件位于`contents/news`目录下，与文档大致相同。

frontmatter配置如下：

| parameter | type   | description                      |
| --------- | ------ | -------------------------------- |
| title     | string | 新闻的标题                       |
| date      | string | 新闻发布日期，格式为“YYYY-MM-DD” |
| author    | string | 新闻发布者                       |
| tags      | list   | 新闻标签                         |
| lang      | string | “zh”/“en”，新闻语言              |

需要注意：当国际化设置为对应语言时只会显示对应语言的新闻。

其他需要注意的事项与贡献文档中的相同。

### 添加或修改图标

项目中的图标统一在 `src/components/icons.tsx` 中管理。

**添加新图标的步骤：**

1. 在 `icons.tsx` 顶部从 `lucide-react` 导入需要的图标：
   ```typescript
   import { NewIcon } from "lucide-react";
   ```

2. 在 `Icons` 对象中添加图标定义：
   ```typescript
   export const Icons = {
     // ... 其他图标
     newicon: (props: IconProps) => <NewIcon {...props} />,
   };
   ```

3. 在组件中使用：
   ```typescript
   import { Icons } from "@/components/icons";
   
   <Icons.newicon className="size-4" />
   ```

**注意**：不要在组件中直接从 `lucide-react` 导入图标，所有图标必须通过 `Icons` 对象统一管理。

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置规则
- 组件文件使用 PascalCase 命名
- 客户端组件文件建议使用 `-client.tsx` 后缀并在文件头部添加 `"use client"`
- 提交前执行 `pnpm lint` 和 `pnpm build` 确保代码质量

## 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) - React 服务端渲染框架
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Markdown**: [unified](https://unifiedjs.com/) + [remark-gfm](https://github.com/remarkjs/remark-gfm) + [remark-github-blockquote-alert](https://github.com/binyamin/remark-github-blockquote-alert) + [rehype-slug](https://github.com/rehypejs/rehype-slug)
- **代码高亮**: [Shiki](https://shiki.matsu.io/)
- **图标**: [Lucide React](https://lucide.dev/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)
- **分析**: [Vercel Analytics](https://vercel.com/analytics) & [Speed Insights](https://vercel.com/docs/speed-insights)

## 许可证

本项目源代码采用 [MIT License](LICENSE) 开源协议。

本项目中的文档（见`contents`目录）遵循 [BenderBlog/traintime_pda](https://github.com/BenderBlog/traintime_pda) 采用 [MPL-2.0 License](https://github.com/BenderBlog/traintime_pda/blob/main/LICENSE) 开源协议。

XDYou Logo等一些美术资源，许可信息参见 [这个文件](https://github.com/BenderBlog/traintime_pda/blob/main/assets/README.MD)

---

<div align="center">

**Made with ❤️ for Xidian University students**

</div>