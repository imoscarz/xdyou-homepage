import { Icons } from "@/components/icons";

export const projects = [
  {
    title: "home-next",
    href: "https://github.com/imoscarz/home-next/",
    dates: "Mar. 2024 - Mar. 2025",
    active: true,
    description:
      "A personal website built with Next.js, TypeScript, Tailwind CSS, and MDX. It features a blog, project showcases, and a contact form, all optimized for performance and SEO.",
    technologies: [],
    authors: "",
    links: [
      {
        type: "Github",
        href: "https://github.com/imoscarz/home-next/",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
  {
    title: "xianmetro",
    href: "https://github.com/imoscarz/xianmetro/",
    dates: "Mar. 2024 - Mar. 2025",
    active: true,
    description:
      "A metro information app, based on PyQT and Python, providing real-time updates, route planning, and station details for the Xi'an metro system.",
    technologies: [],
    authors: "",
    links: [
      {
        type: "Github",
        href: "https://github.com/imoscarz/xianmetro/",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
  {
    title: "lottery",
    href: "https://github.com/imoscarz/lottery/",
    dates: "Mar. 2024 - Mar. 2025",
    active: true,
    description:
      "A lottery application, based on PyGame.",
    technologies: [],
    authors: "",
    links: [
      {
        type: "Github",
        href: "https://github.com/imoscarz/lottery/",
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: "",
    video: "",
  },
] as const;
