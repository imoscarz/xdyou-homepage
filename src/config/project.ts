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
  
  // 项目Logo
  logo: "/icon/logo.png",
  
  // 下载平台配置
  platforms: [
    {
      id: "android",
      name: "Android",
      icon: "smartphone",
      downloadUrl: "https://github.com/BenderBlog/traintime_pda/releases/latest",
      alternativeUrl: "https://f-droid.org/zh_Hans/packages/io.github.benderblog.traintime_pda/",
      alternativeName: "F-Droid",
      available: true,
    },
    {
      id: "ios",
      name: "iOS",
      icon: "apple",
      downloadUrl: "https://apps.apple.com/us/app/xdyou/id6461723688?l=zh-Hans-CN",
      available: true,
    },
    {
      id: "windows",
      name: "Windows",
      icon: "laptop",
      downloadUrl: "https://github.com/BenderBlog/traintime_pda/releases/latest",
      available: true,
    },
    {
      id: "linux",
      name: "Linux",
      icon: "computer",
      downloadUrl: "https://github.com/BenderBlog/traintime_pda/releases/latest",
      available: true,
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
    {
      src: "/img/placeholder1.png",
      alt: "XDYou Screenshot 1",
      caption: {
        en: "Course Schedule View",
        zh: "课程表界面",
      },
    },
    {
      src: "/img/placeholder2.png",
      alt: "XDYou Screenshot 2",
      caption: {
        en: "Exam Query Interface",
        zh: "考试查询界面",
      },
    },
    {
      src: "/img/placeholder3.png",
      alt: "XDYou Screenshot 3",
      caption: {
        en: "Campus Services",
        zh: "校园服务",
      },
    },
  ],
} as const;
