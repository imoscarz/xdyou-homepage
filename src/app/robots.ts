import { MetadataRoute } from "next";

import { DATA } from "@/data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${DATA.url}/sitemap.xml`,
  };
}
