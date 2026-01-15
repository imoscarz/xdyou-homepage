import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import { getAllNewsPosts } from "@/lib/news";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang");
    
    let posts = await getAllNewsPosts();
    
    // 根据语言筛选
    if (lang) {
      posts = posts.filter((post) => post.lang === lang);
    }

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
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching news posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch news posts" },
      { status: 500 }
    );
  }
}
