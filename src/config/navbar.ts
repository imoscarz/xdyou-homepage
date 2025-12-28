import { Icons } from "@/components/icons";

export const navbar = [
  { href: "/", icon: Icons.home, label: "Home" },
  { href: "/docs", icon: Icons.bookmarked, label: "Docs" },
  { href: "/news", icon: Icons.newspaper, label: "News" },
  { href: "/releases", icon: Icons.librarybig, label: "Releases" },
] as const;
