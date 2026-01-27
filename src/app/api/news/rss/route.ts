import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import {
  apiErrorResponse,
  buildLangDescription,
  buildLangParam,
  buildLangTag,
  getFilteredNewsPosts,
} from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { posts, lang } = await getFilteredNewsPosts(request);

    // 生成RSS feed
    const siteUrl = siteConfig.url;
    const lastBuildDate = new Date().toUTCString();
    const langParam = buildLangParam(lang);
    const langDesc = buildLangDescription(lang);
    const langTag = buildLangTag(lang);

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>XDYou News${langDesc}</title>
    <link>${siteUrl}/news${langParam}</link>
    <description>Latest news and updates from XDYou${langDesc}</description>
    <language>${langTag}</language>
    <atom:link href="${siteUrl}/api/news/rss${langParam}" rel="self" type="application/rss+xml" />
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
    </item>`,
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
    return apiErrorResponse("Failed to generate RSS feed", error);
  }
}
