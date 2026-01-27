import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import {
  apiErrorResponse,
  buildLangDescription,
  buildLangParam,
  getFilteredNewsPosts,
} from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { posts, lang } = await getFilteredNewsPosts(request);

    const siteUrl = siteConfig.url;
    const latestDate =
      posts.length > 0
        ? new Date(posts[0].date).toISOString()
        : new Date().toISOString();
    const langParam = buildLangParam(lang);
    const langDesc = buildLangDescription(lang);

    // 生成Atom feed
    const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>XDYou News${langDesc}</title>
  <link href="${siteUrl}/news${langParam}" rel="alternate" type="text/html"/>
  <link href="${siteUrl}/api/news/atom${langParam}" rel="self" type="application/atom+xml"/>
  <id>${siteUrl}/news${langParam}</id>
  <updated>${latestDate}</updated>
  <subtitle>Latest news and updates from XDYou${langDesc}</subtitle>
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
  </entry>`,
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
    return apiErrorResponse("Failed to generate Atom feed", error);
  }
}
