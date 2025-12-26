import { Icons } from "@/components/icons";

export const navbar = [
  { href: "/", icon: Icons.home, label: "Home" },
  { href: "/docs", icon: Icons.bookmarked, label: "Docs" },
  { href: "/news", icon: Icons.newspaper, label: "News" },
  { href: "/releases", icon: Icons.librarybig, label: "Releases" },
] as const;

export const contact = {
  social: {
    GitHub: {
      name: "GitHub",
      url: "https://github.com/BenderBlog/traintime_pda",
      icon: Icons.github,
      navbar: false,
      content: true,
      footer: true,
    },
    Email: {
      name: "Email",
      url: "mailto:support@xdyou.example.com",
      icon: Icons.email,
      navbar: false,
      content: true,
      footer: true,
    },
  },
} as const;
