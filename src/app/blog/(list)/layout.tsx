import { Metadata } from "next";

import { DATA } from "@/data";

export const metadata: Metadata = {
  title: "博客",
  description: DATA.chinese.blogDescription,
  openGraph: {
    title: `${DATA.chinese.name}的博客`,
    description: DATA.chinese.blogDescription,
    url: `${DATA.url}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${DATA.chinese.name}的博客`,
    description: DATA.chinese.blogDescription,
  },
  alternates: {
    canonical: `${DATA.url}/blog`,
    languages: {
      "en-US": `${DATA.url}/blog/`,
      "zh-CN": `${DATA.url}/blog`,
    },
    types: {
      "application/atom+xml": "/api/feed/atom.xml",
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
