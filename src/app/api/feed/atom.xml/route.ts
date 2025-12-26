import { DATA, getEmail } from "@/data";
import { env } from "@/lib/env";
import { getFeedItems } from "@/lib/rss";

// ISR configuration - revalidate every hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  try {
    const posts = await getFeedItems();

    // Check if we have any posts
    if (posts.length === 0) {
      const feedMode = env.feedMode;
      let subtitle = "No content available";
      
      if (feedMode === "rss" && !env.rssFeedUrl) {
        subtitle = "RSS feed not configured";
      } else if (feedMode === "news") {
        subtitle = "No news items available";
      } else if (feedMode === "both") {
        subtitle = "No content available from RSS or news";
      }

      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${DATA.name} - Blog</title>
  <subtitle>${subtitle}</subtitle>
  <link href="${DATA.url}/blog" rel="self"/>
  <link href="${DATA.url}"/>
  <id>${DATA.url}/blog</id>
  <updated>${new Date().toISOString()}</updated>
</feed>`,
        {
          headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        }
      );
    }

    const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${DATA.name} - Blog</title>
  <subtitle>${DATA.description}</subtitle>
  <link href="${DATA.url}/blog" rel="self"/>
  <link href="${DATA.url}"/>
  <id>${DATA.url}/blog</id>
  <author>
    <name>${DATA.name}</name>
    <email>${getEmail()}</email>
  </author>
  <updated>${new Date().toISOString()}</updated>
  ${posts
    .map((post) => {
      const publishedDate = new Date(post.pubDate).toISOString();
      const updatedDate = new Date(post.pubDate).toISOString();

      return `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${post.link}"/>
    <id>${post.guid || post.link}</id>
    <published>${publishedDate}</published>
    <updated>${updatedDate}</updated>
    ${post.author ? `<author><name>${escapeXml(post.author)}</name></author>` : ""}
    ${post.description ? `<summary>${escapeXml(post.description)}</summary>` : ""}
    ${post.content ? `<content type="html">${escapeXml(post.content)}</content>` : ""}
  </entry>`;
    })
    .join("")}
</feed>`;

    return new Response(atomFeed, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating Atom feed:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${DATA.name} - Blog</title>
  <subtitle>Error loading feed</subtitle>
  <link href="${DATA.url}/blog" rel="self"/>
  <link href="${DATA.url}"/>
  <id>${DATA.url}/blog</id>
  <updated>${new Date().toISOString()}</updated>
</feed>`,
      {
        status: 500,
        headers: {
          "Content-Type": "application/atom+xml; charset=utf-8",
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      }
    );
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
