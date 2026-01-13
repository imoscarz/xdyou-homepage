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

### 贡献文档

项目文档的源文件位于`contents/docs`目录中。

出于维护方便考虑，从文档目录进入文档内容后会将i18n选项固定为中文。因此，文档不需要考虑国际化。

Markdown文件的文件名将作为`slug`参数，即网页URL的后缀。

Markdown文件frontmatter配置如下：

| parameter   | type   | description                            |
| ----------- | ------ | -------------------------------------- |
| title       | string | 文档的标题                             |
| description | string | 文档的简介，将会在目录页显示在标题下方 |
| category    | string | 文档的分类                             |
| order       | int    | 文档排序时的权重，将会决定文档的顺序。 |

以下是一个示例：

```markdown
---
title: "配置指南"
description: "了解如何配置XDYou"
category: "入门指南"
order: 2
---
```

此外，在编写文档时需要注意：

1. 由于next.js的安全策略限制，您无法引用在`next.config.js`中`remotePatterns`声明过的hostname之外的站点的图片。因此，在引用图片时，请将图片存放在`public/img`下的适当位置并通过相对链接引用图片。
2. 文档支持使用一些GFM的特性，如带有提示的引用。
3. 文档支持使用$\LaTeX$公式，通过`$`或`$$`调用。

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

### 贡献代码

项目使用`pnpm`进行包管理。

使用`nodejs 22`。

```shell
pnpm install #安装依赖
pnpm dev     #启动开发服务器
pnpm lint    #执行语法检查
pnpm build   #执行构建
```




---

<div align="center">

**Made with ❤️ for Xidian University students**

</div>