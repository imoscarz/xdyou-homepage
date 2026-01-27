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

  // 贡献者配置
  contributors: {
    maxDisplay: 12, // 最多显示的贡献者数量
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
      supportedFormats: ["apk"],
      alternativeUrl:
        "https://f-droid.org/zh_Hans/packages/io.github.benderblog.traintime_pda/",
      alternativeName: "F-Droid",
    },
    {
      id: "ios",
      name: "iOS",
      icon: "apple",
      available: true,
      supportedFormats: ["ipa"],
      downloadUrl:
        "https://apps.apple.com/us/app/xdyou/id6461723688?l=zh-Hans-CN",
    },
    {
      id: "windows",
      name: "Windows",
      icon: "laptop",
      available: true,
      supportedFormats: ["zip", "exe"],
    },
    {
      id: "linux",
      name: "Linux",
      icon: "computer",
      available: true,
      supportedFormats: ["zip", "appimage", "deb", "rpm"],
    },
  ],

  // 功能特性
  features: [
    {
      icon: "calendar",
      title: {
        en: "Course Schedule",
        zh: "课程表",
      },
      description: {
        en: "View your weekly course schedule at a glance, with automatic sync from the campus system.",
        zh: "一目了然的查看每周课程安排，自动从校园系统同步。",
      },
    },
    {
      icon: "clipboardlist",
      title: {
        en: "Exam Queries",
        zh: "考试查询",
      },
      description: {
        en: "Check exam schedules, locations, and results with ease.",
        zh: "轻松查询考试安排、地点和成绩。",
      },
    },
    {
      icon: "creditcard",
      title: {
        en: "Campus Card",
        zh: "校园卡",
      },
      description: {
        en: "Monitor your campus card balance and transaction history in real-time.",
        zh: "实时监控校园卡余额和消费记录。",
      },
    },
    {
      icon: "bookopen",
      title: {
        en: "Library Services",
        zh: "图书馆服务",
      },
      description: {
        en: "Search books, check borrowing status.",
        zh: "搜索图书、查看借阅状态。",
      },
    },
    {
      icon: "network",
      title: {
        en: "Network Services",
        zh: "校园网服务",
      },
      description: {
        en: "Check campus network plans and usage.",
        zh: "查询校园网套餐及用量。",
      },
    },
    {
      icon: "bell",
      title: {
        en: "Notifications",
        zh: "通知提醒",
      },
      description: {
        en: "Get timely reminders for classes, exams, and important campus announcements.",
        zh: "及时收到课程、考试和重要校园公告的提醒。",
      },
    },
  ],

  // 截图配置
  screenshots: [
    // Mobile Screenshots
    {
      src: "/img/screenshots/homepage-mobile.png",
      alt: "XDYou Mobile Screenshot 1",
      type: "mobile",
      caption: {
        en: "Homepage View",
        zh: "首页界面",
      },
    },
    {
      src: "/img/screenshots/schedule-mobile.png",
      alt: "XDYou Mobile Screenshot 2",
      type: "mobile",
      caption: {
        en: "Course Schedule View",
        zh: "课程表界面",
      },
    },
    {
      src: "/img/screenshots/classroom-mobile.png",
      alt: "XDYou Mobile Screenshot 3",
      type: "mobile",
      caption: {
        en: "Available Classrooms",
        zh: "空闲教室",
      },
    },
    {
      src: "/img/screenshots/club-mobile.png",
      alt: "XDYou Mobile Screenshot 4",
      type: "mobile",
      caption: {
        en: "Clubs",
        zh: "社团",
      },
    },
    // Desktop Screenshots
    {
      src: "/img/screenshots/schedule-desktop.png",
      alt: "XDYou Desktop Screenshot 1",
      type: "desktop",
      caption: {
        en: "Course Schedule View",
        zh: "课程表界面(桌面端)",
      },
    },
    {
      src: "/img/screenshots/homepage-desktop.png",
      alt: "XDYou Desktop Screenshot 2",
      type: "desktop",
      caption: {
        en: "Homepage View",
        zh: "首页界面(桌面端)",
      },
    },
    {
      src: "/img/screenshots/classroom-desktop.png",
      alt: "XDYou Desktop Screenshot 3",
      type: "desktop",
      caption: {
        en: "Available Classrooms",
        zh: "空闲教室(桌面端)",
      },
    },
  ],
} as const;
