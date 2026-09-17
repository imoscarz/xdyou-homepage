# 首页维护说明

## 运行环境与 CI

使用 Node.js 24 LTS；本次生产验证使用官方 Node 24.21.0。`.nvmrc` 选择 24 系列，`package.json` 固定 pnpm 10.34.5，安装必须使用 `pnpm install --frozen-lockfile`。不要提交 node_modules。

依赖已刷新到锁文件中的稳定版本。TypeScript 保持 6.0 系列，以符合 typescript-eslint 的 `<6.1.0` peer 范围；不盲目升级到 TypeScript 7。Next、React 和相关类型保持配套。安全检查运行 `pnpm audit`，结果具有时效性。

GitHub CI 只负责安装、图片检查、Lint、测试、构建与类型检查，不负责部署。Vercel 使用仓库的构建命令及 Node 24；若项目控制台另设了旧 Node 版本，应将该覆盖设置改为 24.x。

当前已移除不执行路由逻辑的 middleware。构建日期通过 Next 配置注入，不再改写源码；Next 16 所需的 tsconfig 改动已纳入版本控制。

推荐验证顺序：

```sh
pnpm install --frozen-lockfile
pnpm check:images
pnpm lint
pnpm test
pnpm build
pnpm typecheck
pnpm audit
```

## 贡献者同步

`pnpm sync:contributors` 先获取 BenderBlog/traintime_pda 的 main 提交 SHA，再从同一提交读取：

- `lib/model/about_page.dart`：身份、姓名、头像、主页、排列顺序。
- `assets/flutter_i18n/zh_CN.yaml`：中文贡献说明。
- `assets/flutter_i18n/en_US.yaml`：英文贡献说明；缺失时显示中文原文。

解析器只接受字面量 Developer 列表，不执行 Dart，也不使用 GitHub 提交贡献者 API 替代设计、翻译和支持人员名单。身份键使用完整的 descriptionI18nKey，因此改名不会丢失网站补充资料。重复身份、空名单、非法链接、格式变化或缺失中文说明都会中止同步，旧快照保留。快照原子写入；名单和内容没有改变时不改文件。

生成结果位于 `src/generated/contributors.json`，记录来源 SHA、路径和 MPL-2.0 标识。源文件版权属于 Traintime PDA authors，原文出处可通过记录的提交追溯；其许可见 <https://github.com/BenderBlog/traintime_pda/blob/main/LICENSE>。不要将同步数据的许可误写为本站代码的 MIT。

网站专属简介和额外链接在 `src/config/contributor-overrides.json`，以身份键关联。同步不覆盖该文件；上游删除的人员不再显示，其补充数据保留以便恢复。头像使用上游 HTTPS 地址和失败回退，GitHub 头像请求限制为 128px。

工作流 `Sync contributors` 每周一 03:17 UTC（北京时间 11:17）或手动触发。同步后完成检查，再创建/更新同一个 PR，人工合并后才更新站点。需要仓库 Settings → Actions → General 允许 GitHub Actions 创建 PR；仅提交工作流不会自行开启此权限。机器人 PR 的 GITHUB_TOKEN 不会触发另一轮普通 CI，因此同步工作流自身执行完整检查。上游不可用会使同步任务失败，不影响网站读取已有快照。

## 截图与卡片

首页章节结构位于 `src/config/home-chapters.ts`，正文与全页目录共用顺序，双语文案位于 `home.pages`。五章分别为学习安排、自习空间、校园信息、生活服务、轻松一刻；原功能卡片网格和独立截图轮播不再挂载。`src/config/screenshots.ts` 继续管理真实截图导入，当前使用 2026-09-17 用户提供的十一张截图，保留原图比例、颜色与已有遮挡处理。

介绍章节采用原生 sticky 叠页，桌面高度为 100svh 减 80px 顶部导航，手机为 100svh，手机底部预留导航空间。使用独立正常流锚点，避免 sticky 元素覆盖时目录不能返回前一页。目录在 Hero 隐藏，进入介绍后出现；下载后依次为开发邀请和贡献者气泡。极短视口（≤540px 高）及减少动态效果模式回退为自然流以保证内容完整。

下载区采用上移、淡入及轻微缩放的入场过渡；页面保持不透明的黑白背景。贡献者继续读取原有同步快照，42 个头像均可访问并点击打开原详情，悬停、聚焦和离屏时暂停漂浮，减少动态效果模式无漂浮。各断点均使用确定性随机分布和碰撞避让，不提供暂停按钮，保留完整无障碍名称。

截图保持比例并在一屏剩余空间内等比缩放，支持点击放大、Esc、焦点约束与返回。学习与自习章节可切换手机和横屏截图，手机默认竖屏；校园信息可切换浅色首页、深色首页、校园卡和图书馆，生活服务保留双图。切换按钮保持紧凑，无自动播放。源码参考研究见 `docs/reference-study.md`。

统一卡片样式定义在 globals.css：`surface-card` 为内容容器，`surface-interactive` 仅用于可操作内容，`surface-notice` 为维护提醒。不要给所有卡片增加缩放或 hover 动效。截图实际图片尺寸和 sizes 声明供 Next 图片优化使用，非首屏截图不抢占首屏优先加载。

## 下载

平台卡片收起时固定为 160px 高。鼠标悬停、键盘焦点或触屏点击展开下载选项；选项浮在下方，不改变后续区块位置。点击外部或 Esc 收起，关闭时内容设为 inert，避免键盘进入隐藏链接。浮层会临时遮挡下方内容，长内容可独立滚动。

所有断点共享平台配置和下载选项逻辑。无 GitHub 数据或找不到匹配安装包时回退到主仓库 Releases；iOS 和 OHOS 始终使用自己的商店链接。OHOS 为项目认可的第三方版本，与主仓库版本树不同步。检测到 HarmonyOS 的首页快捷按钮导航到下载区，让用户先看到说明。

首页快捷按钮通过 `src/lib/platform-detection.ts` 匹配：HarmonyOS 优先于 Android；iPad 桌面模式结合 Mac 平台标识和多点触控识别；ChromeOS、macOS 和未知平台回到平台选择。只有识别架构且存在匹配资产才直达安装包，否则定位并展开对应平台卡片。可用时读取 Client Hints 的 architecture/bitness，拒绝或不支持时保留回退。识别仍是启发式，不能据此保证所有设备准确；参考 [MDN UA 检测说明](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent) 和 [Client Hints 可用性](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData)。保留“更多下载选项”供用户自行选择。

平台图标为内置图像生成工具生成的透明 WebP，源于五个独立提示词，详见 `docs/platform-icons.md`。最终文件位于 `public/images/platforms/`，每张 128px，网页以 48px 展示，深色模式反色。

## 性能测量边界

截图展示直接嵌入功能章节，不再提供轮播控件。页面/语言切换使用 180ms 轻微位移淡入，主题切换优先使用浏览器 View Transition，展开动画为 200ms；遵循 prefers-reduced-motion。语言切换保留锚点并避免主动滚回页首。

升级前现有 node_modules 实际为 Next 15.5.9，尽管 package.json 声明 Next 16。旧生产构建报告首页 First Load JS 为 210 kB。Next 16 的输出格式不同，不能直接用两次构建文本宣称相同口径的提升百分比。

本次结构优化包括下载区服务端渲染、原生 details 更新日志、去除无效 middleware、简化截图交互、按尺寸加载图片、限制 GitHub 请求等待时间，以及避免入场动画隐藏首屏。上线后继续用现有 Speed Insights 观察真实流量的 LCP、INP、CLS；本机预览不能替代线上指标。

## 配置与组件基准

- 平台顺序、下载地址、维护状态统一在 `src/config/project.ts` 的 `platforms` 维护；`notice` 只表示 `maintenance` 或 `thirdParty`，具体文案来自双语字典。Windows/Linux 的维护说明与发行记录复用同一文案。
- 手机双列网格中 HarmonyOS 跨两列；从 `sm` 三列布局起恢复单列跨度。
- 参与开发与贡献者章节共用 `section-heading.tsx`，参与方式入口位于 `join-section.tsx`；依据 `contents/docs/dev.md` 描述参与方向，不承诺简单文档修改会计入贡献。
- 原功能卡片、独立截图图库及其客户端组件已删除；旧 `features`、`contributors.maxDisplay`、`supportedFormats` 配置不再保留。截图文件与图片标题留在 `screenshots.ts`，正文只由章节双语字典维护。
- 文档正文目前仅中文，列表链接和详情界面保留 `lang`；最后编辑信息与目录按所选语言显示。
