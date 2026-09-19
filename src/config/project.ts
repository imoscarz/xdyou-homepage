/**
 * XDYou项目配置
 */

export const projectConfig = {
  // 项目基本信息
  name: "XDYou",
  fullName: "XDYou / Traintime PDA",
  slogan: {
    en: "Your Essential Campus Companion",
    zh: "你的校园生活助手",
  },
  description: {
    en: "A comprehensive mobile application designed for Xidian University students, providing course schedules, exam queries, campus services, and more.",
    zh: "专为西安电子科技大学学生打造的综合性移动应用，提供课程表查询、考试安排、校园服务等功能。",
  },

  // 项目仓库信息
  repo: {
    owner: "BenderBlog",
    name: "traintime_pda",
    url: "https://github.com/BenderBlog/traintime_pda",
  },

  // 文档仓库信息（用于获取文档的最后编辑信息）
  docsRepo: {
    owner: "imoscarz",
    name: "xdyou-homepage",
    branch: "master",
  },

  // 项目Logo
  logo: "/icon/logo.png",

  // 安装包格式配置（用于识别不同平台的安装包）
  assetPatterns: {
    android: [
      { pattern: /app-arm64-v8a-release\.apk$/i, displayName: "ARM64" },
      { pattern: /app-armeabi-v7a-release\.apk$/i, displayName: "ARMv7" },
      { pattern: /app-x86_64-release\.apk$/i, displayName: "x86_64" },
    ],
    linux: [
      {
        pattern: /watermeter-linux-release-amd64\.zip$/i,
        displayName: "ZIP (amd64)",
      },
      { pattern: /watermeter\.Appimage$/i, displayName: "AppImage" },
    ],
    windows: [
      {
        pattern: /watermeter-windows-release-amd64\.zip$/i,
        displayName: "ZIP (amd64)",
      },
    ],
    ios: [],
  },

  // 下载平台配置
  platforms: [
    {
      id: "android",
      name: "Android",
      icon: "smartphone",
      available: true,
      alternativeUrl:
        "https://f-droid.org/zh_Hans/packages/io.github.benderblog.traintime_pda/",
      alternativeName: "F-Droid",
    },
    {
      id: "ios",
      name: "iOS",
      icon: "apple",
      available: true,
      downloadUrl:
        "https://apps.apple.com/cn/app/xdyou/id6461723688?l=zh-Hans-CN",
      alternativeUrl: "https://testflight.apple.com/join/pLKe5B4q",
      alternativeName: "TestFlight",
    },
    {
      id: "windows",
      name: "Windows",
      notice: "maintenance",
      icon: "laptop",
      available: true,
    },
    {
      id: "linux",
      name: "Linux",
      notice: "maintenance",
      icon: "computer",
      available: true,
    },
    {
      id: "ohos",
      name: "HarmonyOS / OHOS",
      icon: "smartphone",
      available: true,
      notice: "thirdParty",
      downloadUrl: "https://appgallery.huawei.com/app/detail?id=com.xdyou.hmos",
    },
  ],
} as const;
