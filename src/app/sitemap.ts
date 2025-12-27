import { MetadataRoute } from "next";

import { DATA } from "@/data";
import { getAllDocSlugs } from "@/lib/docs";
import { getAllNewsPosts } from "@/lib/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = DATA.url;

  // Static routes for XDYou project
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/releases`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Dynamic routes: news posts
  const news = await getAllNewsPosts();
  const newsRoutes: MetadataRoute.Sitemap = news.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Dynamic routes: docs
  const docs = getAllDocSlugs();
  const docRoutes: MetadataRoute.Sitemap = docs.map((slug) => ({
    url: `${baseUrl}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...newsRoutes, ...docRoutes];
}
