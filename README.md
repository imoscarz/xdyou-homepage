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
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── docs/           # 文档页面
│   │   ├── news/           # 新闻页面
│   │   ├── releases/       # 版本发布页面
│   │   └── globals.css     # 全局样式
│   ├── components/         # React 组件
│   │   ├── blocks/         # 页面块组件
│   │   ├── project/        # 项目相关组件
│   │   └── ui/             # UI 基础组件
│   ├── config/             # 配置文件
│   ├── data/               # 静态数据
│   ├── lib/                # 工具库
│   │   ├── github.ts       # GitHub API 工具
│   │   ├── i18n/           # 国际化
│   │   └── utils.tsx       # 通用工具
│   └── contents/           # 内容文件
│       ├── docs/           # 文档 Markdown
│       └── news/           # 新闻 Markdown
├── public/                 # 静态资源
└── package.json            # 项目配置
```

## 配置

主页的配置文件位于`src/config`目录下，其中可能需要修改的大部分位于`project.ts`中。

## 贡献

TODO

##

--

<div align="center">

**Made with ❤️ for Xidian University students**

</div>