import { NextResponse } from "next/server";

import { getAllNewsPosts } from "@/lib/news";

export async function GET() {
  try {
    const posts = await getAllNewsPosts();

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
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/news/${post.slug}`,
        })),
        total: posts.length,
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
