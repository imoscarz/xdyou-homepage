import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getAllNewsPosts } from "@/lib/news";

export async function GET() {
  try {
    const posts = await getAllNewsPosts();
    const siteUrl = env.siteUrl;
    const latestDate = posts.length > 0 ? new Date(posts[0].date).toISOString() : new Date().toISOString();

    // 生成Atom feed
    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>XDYou News</title>
  <link href="${siteUrl}/news" rel="alternate" type="text/html"/>
  <link href="${siteUrl}/api/news/atom" rel="self" type="application/atom+xml"/>
  <id>${siteUrl}/news</id>
  <updated>${latestDate}</updated>
  <subtitle>Latest news and updates from XDYou</subtitle>
  <generator>XDYou Homepage</generator>
  ${posts
    .map(
      (post) => `
  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${siteUrl}/news/${post.slug}" rel="alternate" type="text/html"/>
    <id>${siteUrl}/news/${post.slug}</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <author>
      <name>${post.author}</name>
    </author>
    <summary type="html"><![CDATA[${post.excerpt}]]></summary>
  </entry>`
    )
    .join("")}
</feed>`;

    return new NextResponse(atom, {
      headers: {
        "Content-Type": "application/atom+xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating Atom feed:", error);
    return NextResponse.json(
      { error: "Failed to generate Atom feed" },
      { status: 500 }
    );
  }
}
