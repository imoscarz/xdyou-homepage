import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import { getAllNewsPosts } from "@/lib/news";

export async function GET() {
  try {
    const posts = await getAllNewsPosts();

    // 生成RSS feed
    const siteUrl = siteConfig.url;
    const lastBuildDate = new Date().toUTCString();
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>XDYou News</title>
    <link>${siteUrl}/news</link>
    <description>Latest news and updates from XDYou</description>
    <language>zh-cn</language>
    <atom:link href="${siteUrl}/api/news/rss" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>XDYou Homepage</generator>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/news/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${siteUrl}/news/${post.slug}</guid>
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
