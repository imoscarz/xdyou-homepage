import { MetadataRoute } from "next";

import { DATA } from "@/data";

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

  return staticRoutes;
}
