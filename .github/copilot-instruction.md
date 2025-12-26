# XDYou项目主页开发指南

## 项目概述

这是XDYou（西电You）项目的官方主页，一个基于Next.js 15 + React 19 + TypeScript的多语言项目展示网站。

## 核心技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 19, TailwindCSS 4, Radix UI
- **动画**: Motion (Framer Motion)
- **内容**: Markdown (MDX), RSS
- **国际化**: 自定义i18n方案 (支持中英文)
- **包管理**: pnpm

## 项目结构

```
src/
├── app/              # Next.js App Router页面
│   ├── page.tsx      # 首页 - Hero + 功能 + 截图 + 下载
│   ├── news/         # 新闻页面 (Markdown渲染)
│   ├── releases/     # 发行记录 (GitHub API)
│   └── docs/         # 文档页面 (VuePress风格)
├── components/       # 可复用组件
│   ├── blocks/       # 布局块 (navbar, footer)
│   ├── portfolio/    # 项目相关组件
│   └── ui/           # UI基础组件
├── config/           # 配置文件
├── lib/              # 工具函数
│   └── i18n/         # 国际化配置
└── data.tsx          # 全局数据

contents/
├── docs/             # 文档Markdown源文件
└── news/             # 新闻Markdown源文件

public/
├── icon/             # Logo等图标
│   └── logo.png
└── img/              # 项目图片
    ├── placeholder1-3.png  # 占位图
    └── ...
```

## 页面路由设计

### 1. 首页 `/`
- **Hero Section**: 左侧项目信息 + 右侧Logo
- **功能简述** (#functions): 卡片式展示，包含icon+标题+描述
- **屏幕截图** (#screenshots): 轮播图展示
- **下载区域** (#downloads): 最新版本信息 + 按平台分组的下载按钮

### 2. 新闻页面 `/news`
- Markdown渲染的新闻列表
- 支持搜索和筛选
- 提供RSS订阅和API
- 源文件: `contents/news/*.md`

### 3. 发行记录 `/releases`
- 通过GitHub REST API同步Releases
- 默认显示5条，支持"加载更多"
- API参考: https://docs.github.com/en/rest/releases/releases

### 4. 文档页面 `/docs`
- VuePress风格布局
- 左侧: 菜单导航
- 中间: Markdown正文
- 右侧: 目录TOC (移动端折叠)
- 源文件: `contents/docs/*.md`

## 图标组件 (Lucide Icons)

使用以下Lucide图标：

| 图标 | 用途 | 导入方式 |
|------|------|----------|
| `Laptop` | PC下载 | `lucide-react` |
| `Penguin` | Linux下载 | 自定义SVG |
| `Smartphone` | 手机下载 | `lucide-react` |
| `Apple` | macOS下载 | `lucide-react` |
| `FileBox` | Release Assets | `lucide-react` |
| `FileCode` | Source Code | `lucide-react` |
| `Tag` | Version标签 | `lucide-react` |
| `BookMarked` | 文档导航 | `lucide-react` |
| `LibraryBig` | 发行记录导航 | `lucide-react` |
| `Newspaper` | 新闻导航 | `lucide-react` |

**注意**: Lucide不包含Penguin图标，需自定义实现。

## 开发规范

### TypeScript
- 严格类型检查
- 优先使用类型推导
- 为组件Props定义接口

### 组件设计
- 优先使用服务器组件 (Server Components)
- 客户端组件需添加 `"use client"` 指令
- 使用 `cn()` 工具函数合并className
- 遵循Radix UI的组合模式

### 样式规范
- 使用TailwindCSS utility classes
- 响应式优先: `sm:`, `md:`, `lg:` 断点
- 暗色模式支持: `dark:` 前缀
- 动画使用Motion库的 `<motion.*>` 组件

### 国际化 (i18n)
```typescript
// 服务器组件
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";

export default async function Page({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);
  
  return <h1>{dict.home.title}</h1>;
}

// 客户端组件
import { useDictionary } from "@/lib/i18n/client";

export default function Component() {
  const dict = useDictionary();
  return <p>{dict.home.description}</p>;
}
```

### 数据管理
- 全局配置统一在 `src/config/` 目录
- 通过 `src/data.tsx` 导出聚合数据
- 环境变量使用 `src/lib/env.ts` 验证和类型化

### Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具配置
```

### 代码质量
- 每次提交前运行 `pnpm lint`
- 修复所有ESLint警告和错误
- 确保类型检查通过

## API集成

### GitHub Releases API
```typescript
// 获取releases
const response = await fetch(
  'https://api.github.com/repos/BenderBlog/traintime_pda/releases',
  {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
);
const releases = await response.json();
```

### RSS订阅
- 提供Atom格式RSS: `/api/feed/atom.xml`
- 使用 `rss-parser` 库生成

## 资源引用

### 图片
```tsx
import Image from "next/image";

// Logo
<Image src="/icon/logo.png" alt="XDYou Logo" width={128} height={128} />

// 占位图
<Image src="/img/placeholder1.png" alt="Screenshot" fill />
```

### 链接
- 内部路由使用 `next/link`: `<Link href="/news">News</Link>`
- 外部链接添加 `rel="noopener noreferrer"` 和 `target="_blank"`

## 性能优化

- 使用Next.js Image组件自动优化图片
- 懒加载非首屏内容
- 合理使用服务器组件减少客户端JS
- 静态生成 (SSG) 优先于服务器渲染 (SSR)

## 无障碍 (A11y)
- 所有交互元素提供 `aria-label`
- 保持合理的色彩对比度
- 支持键盘导航
- 语义化HTML标签

## 测试建议
- 多语言切换测试
- 响应式布局测试 (手机/平板/桌面)
- 暗色/亮色模式测试
- 跨浏览器兼容性测试

## 部署
- 推荐Vercel自动部署
- 构建命令: `pnpm build`
- 输出目录: `.next/`
- Node版本: 18.18.0 - 22.x

---

**最后更新**: 2025-12-26
**项目仓库**: https://github.com/BenderBlog/traintime_pda
