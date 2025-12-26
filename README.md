# XDYou 项目主页

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)](https://tailwindcss.com/)

XDYou（西电You）项目的官方主页，一个基于 Next.js 15 的现代化项目展示网站。

[English](#english) | [中文](#中文)

## 中文

### 项目简介

XDYou 是专为西安电子科技大学学生打造的综合性校园应用，提供课程表、考试查询、校园卡、图书馆服务等功能。

本项目是 XDYou 的官方主页，用于展示项目信息、发布新闻、提供下载和文档支持。

### 功能特性

- 📱 **响应式设计** - 完美适配手机、平板和桌面设备
- 🌐 **多语言支持** - 中英文内容自由切换
- 🎨 **暗色模式** - 护眼的暗色主题
- ⚡ **高性能** - 基于 Next.js 15 App Router
- 📝 **Markdown 支持** - 新闻和文档使用 Markdown 编写
- 🔗 **GitHub 集成** - 自动同步 Release 信息

### 页面结构

- `/` - 首页：项目介绍、功能展示、截图、下载
- `/news` - 新闻：项目动态和公告
- `/releases` - 发行记录：版本历史和下载
- `/docs` - 文档：使用指南和帮助

### 技术栈

- **框架**: Next.js 15 (App Router)
- **UI 库**: React 19
- **样式**: TailwindCSS 4
- **组件**: Radix UI
- **动画**: Motion (Framer Motion)
- **语言**: TypeScript
- **图标**: Lucide React
- **部署**: Vercel (推荐)

### 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

访问 http://localhost:3000 查看网站。

### 项目结构

```
├── .github/
│   └── copilot-instruction.md    # 开发指南
├── contents/
│   ├── docs/                      # 文档源文件 (Markdown)
│   └── news/                      # 新闻源文件 (Markdown)
├── public/
│   ├── icon/                      # Logo 和图标
│   └── img/                       # 图片资源
├── src/
│   ├── app/                       # Next.js 页面
│   ├── components/                # React 组件
│   ├── config/                    # 配置文件
│   ├── lib/                       # 工具函数
│   └── data.tsx                   # 全局数据
└── REFACTOR_SUMMARY.md            # 重构总结
```

### 内容管理

#### 添加新闻

在 `contents/news/` 目录下创建 `.md` 文件：

```markdown
---
title: "新闻标题"
date: "2025-12-26"
author: "作者名"
tags: ["标签1", "标签2"]
lang: "zh"
---

新闻内容...
```

#### 添加文档

在 `contents/docs/` 目录下创建 `.md` 文件：

```markdown
---
title: "文档标题"
order: 1
---

文档内容...
```

### 配置

主要配置文件：

- `src/config/project.ts` - 项目信息、功能、下载平台
- `src/config/contact.ts` - 导航栏和联系方式
- `src/config/footer.ts` - 页脚链接
- `src/lib/env.ts` - 环境变量配置

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SITE_URL=https://xdyou.example.com
NEXT_PUBLIC_SITE_NAME=XDYou - 西电You
NEXT_PUBLIC_DISPLAY_NAME=XDYou
```

### 部署

#### Vercel (推荐)

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

#### 其他平台

```bash
# 构建
pnpm build

# 输出目录
.next/
```

将 `.next/` 目录部署到支持 Node.js 的服务器。

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

提交信息规范：
- `feat:` 新功能
- `fix:` 修复 Bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具配置

### 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

### 相关链接

- [XDYou 应用仓库](https://github.com/BenderBlog/traintime_pda)
- [西安电子科技大学](https://www.xidian.edu.cn/)

---

## English

### Introduction

XDYou is a comprehensive campus application designed for Xidian University students, providing features like course schedules, exam queries, campus card services, library services, and more.

This is the official homepage of the XDYou project, showcasing project information, publishing news, providing downloads and documentation.

### Features

- 📱 **Responsive Design** - Perfect for mobile, tablet, and desktop
- 🌐 **Multi-language** - Switch between Chinese and English
- 🎨 **Dark Mode** - Eye-friendly dark theme
- ⚡ **High Performance** - Built with Next.js 15 App Router
- 📝 **Markdown Support** - News and docs written in Markdown
- 🔗 **GitHub Integration** - Auto-sync release information

### Page Structure

- `/` - Home: Project intro, features, screenshots, downloads
- `/news` - News: Project updates and announcements
- `/releases` - Releases: Version history and downloads
- `/docs` - Docs: User guides and help

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Styling**: TailwindCSS 4
- **Components**: Radix UI
- **Animation**: Motion (Framer Motion)
- **Language**: TypeScript
- **Icons**: Lucide React
- **Deploy**: Vercel (Recommended)

### Quick Start

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

Visit http://localhost:3000 to view the site.

### Project Structure

```
├── .github/
│   └── copilot-instruction.md    # Development guide
├── contents/
│   ├── docs/                      # Documentation (Markdown)
│   └── news/                      # News posts (Markdown)
├── public/
│   ├── icon/                      # Logo and icons
│   └── img/                       # Image assets
├── src/
│   ├── app/                       # Next.js pages
│   ├── components/                # React components
│   ├── config/                    # Configuration files
│   ├── lib/                       # Utility functions
│   └── data.tsx                   # Global data
└── REFACTOR_SUMMARY.md            # Refactor summary
```

### Content Management

#### Add News

Create a `.md` file in `contents/news/`:

```markdown
---
title: "News Title"
date: "2025-12-26"
author: "Author Name"
tags: ["tag1", "tag2"]
lang: "en"
---

News content...
```

#### Add Documentation

Create a `.md` file in `contents/docs/`:

```markdown
---
title: "Doc Title"
order: 1
---

Doc content...
```

### Configuration

Main config files:

- `src/config/project.ts` - Project info, features, platforms
- `src/config/contact.ts` - Navbar and contact info
- `src/config/footer.ts` - Footer links
- `src/lib/env.ts` - Environment variables

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://xdyou.example.com
NEXT_PUBLIC_SITE_NAME=XDYou
NEXT_PUBLIC_DISPLAY_NAME=XDYou
```

### Deployment

#### Vercel (Recommended)

1. Fork this repository
2. Import project in Vercel
3. Configure environment variables
4. Deploy

#### Other Platforms

```bash
# Build
pnpm build

# Output directory
.next/
```

Deploy the `.next/` directory to a Node.js server.

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Commit message conventions:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting
- `refactor:` Refactoring
- `test:` Testing
- `chore:` Build/tool configuration

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Links

- [XDYou App Repository](https://github.com/BenderBlog/traintime_pda)
- [Xidian University](https://www.xidian.edu.cn/)

---

**Made with ❤️ for Xidian University students**
