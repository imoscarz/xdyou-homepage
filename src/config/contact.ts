import { Icons } from "@/components/icons";

export const contact = {
  social: {
    GitHub: {
      name: "GitHub",
      url: "https://github.com/BenderBlog/traintime_pda",
      icon: Icons.github,
      navbar: false,
      footer: true,
    },
    Email: {
      name: "Email",
      url: "mailto:superbart_chen@qq.com",
      icon: Icons.email,
      navbar: false,
      footer: true,
    },
    QQ: {
      name: "QQ", 
      url: "https://qm.qq.com/q/G6JHg3G68o",
      icon: Icons.qq,
      navbar: false,
      footer: true,
    },
  },
} as const;
