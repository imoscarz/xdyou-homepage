import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import {
  API_CACHE_HEADERS,
  apiErrorResponse,
  getFilteredNewsPosts,
} from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { posts, lang } = await getFilteredNewsPosts(request);

    return NextResponse.json(
      {
        posts: posts.map((post) => ({
          slug: post.slug,
          title: post.title,
          date: post.date,
          author: post.author,
          tags: post.tags,
          lang: post.lang,
          excerpt: post.excerpt,
          url: `${siteConfig.url}/news/${post.slug}`,
        })),
        total: posts.length,
        lang: lang || "all",
      },
      {
        headers: API_CACHE_HEADERS,
      },
    );
  } catch (error) {
    return apiErrorResponse("Failed to fetch news posts", error);
  }
}
