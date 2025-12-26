import { Icons } from "@/components/icons";

export const navbar = [
  { href: "/", icon: Icons.home, label: "Home" },
  { href: "/blog", icon: Icons.notebook, label: "Blog" },
  { href: "/anime", icon: Icons.tv, label: "Anime" },
] as const;

export const contact = {
  social: {
    GitHub: {
      name: "GitHub",
      url: "https://github.com/imoscarz",
      icon: Icons.github,
      navbar: false,
      content: true,
      footer: true,
    },
    Zhihu: {
      name: "Zhihu",
      url: "https://www.zhihu.com/people/imozang",
      icon: Icons.zhihu,
      navbar: false,
      content: true,
      footer: true,
    },
    Email: {
      name: "Email",
      url: "mailto:one@imoscarz.me",
      icon: Icons.email,
      navbar: false,
      content: true,
      footer: false,
    },
    RSS: {
      name: "RSS",
      url: "https://blog.imoscarz.me/post/index.xml",
      icon: Icons.rss,
      navbar: false,
      content: false,
      footer: true,
    },
  },
} as const;
