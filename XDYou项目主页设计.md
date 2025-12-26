# XDYou项目主页设计

项目地址 https://github.com/BenderBlog/traintime_pda

## 页面与路由

- `/`：Homepage，主页

  - Hero Section

    - 左侧：项目名称，简单介绍
    - 右侧：项目LOGO
    - 下方：主流版本下载按钮，更多下载（链接到#downloads）

  - 功能简述（#functions）

  - 屏幕截图（#screenshots）

  - 下载（#downloads）
    - 最新版本更新信息（可折叠卡片）
    - 下载（按平台分组，PC端水平排列，移动端竖直排列）

- `/news`：News，新闻

  - 发布通知和公告，通过`Markdown`编译，支持搜索和筛选
  - 提供RSS，API
  - markdown源文件位于目录树的`contents/news`中
- `/releases`：Release Note，发行记录，同步Github-Releases
  - https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#list-releases
  - 通过Github Rest API抓取
  - 默认一次只抓取5条，下方显示`加载更多`按钮
  
- `/docs`：Documents，文档，类似于vuepress模式
  - 通过Markdown编译渲染
  - 左侧Menu
  - 中间正文
  - 右侧本页目录（TOC）
  - 移动端中折叠
  - 源文件位于目录树的`/contents/docs`中

## 新增Icons(lucide)

| icon             | 应用                      |
| ---------------- | ------------------------- |
| laptop           | 下载页面中PC              |
| penguin          | 下载页面中linux           |
| smartphone       | 下载页面中手机            |
| apple            | 下载页面中MAC             |
| file-box         | 发行记录页面中assets      |
| file-code-corner | 发行记录页面中source code |
| tag              | 发行记录中version         |
| book-marked      | navbar中文档              |
| library-big      | navbar中发行记录          |
| newspaper        | navbar中新闻              |



