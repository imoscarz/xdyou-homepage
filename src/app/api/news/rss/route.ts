import { NextResponse } from "next/server";

import { getAllNewsPosts } from "@/lib/news";

export async function GET() {
  try {
    const posts = await getAllNewsPosts();

    // 生成RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>XDYou News</title>
    <link>${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/news</link>
    <description>Latest news and updates from XDYou</description>
    <language>zh-cn</language>
    <atom:link href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/news/rss" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/news/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/news/${post.slug}</guid>
      <author>${post.author}</author>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return NextResponse.json(
      { error: "Failed to generate RSS feed" },
      { status: 500 }
    );
  }
}
