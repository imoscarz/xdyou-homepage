// RSS Blog utilities
import Parser from "rss-parser";

import { DATA } from "@/data";

import { env } from "./env";

export interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  content?: string;
  author?: string;
  categories?: string[];
  guid?: string;
  image?: string;
}

const parser = new Parser({
  customFields: {
    item: [
      ["description", "description"],
      ["content:encoded", "content"],
      ["dc:creator", "author"],
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
    ],
  },
});

/**
 * Fetch blog posts from RSS feed
 * @param feedUrl - RSS feed URL, defaults to env.rssFeedUrl
 * @returns Array of blog posts
 */
export async function fetchRSSFeed(
  feedUrl?: string
): Promise<BlogPost[]> {
  try {
    const url = feedUrl || env.rssFeedUrl;
    
    if (!url) {
      console.warn("No RSS feed URL configured");
      return [];
    }

    const feed = await parser.parseURL(url);
    
    return feed.items.map((item) => {
      // Try to extract image from various sources
      let image: string | undefined;
      
      // 1. Check enclosure for image
      if (item.enclosure?.url && item.enclosure?.type?.startsWith("image/")) {
        image = item.enclosure.url;
      }
      
      // 2. Check media:content
      if (!image && item.mediaContent) {
        const mediaContent = Array.isArray(item.mediaContent) ? item.mediaContent[0] : item.mediaContent;
        if (mediaContent?.$ && mediaContent.$.url) {
          image = mediaContent.$.url;
        }
      }
      
      // 3. Check media:thumbnail
      if (!image && item.mediaThumbnail) {
        const mediaThumbnail = Array.isArray(item.mediaThumbnail) ? item.mediaThumbnail[0] : item.mediaThumbnail;
        if (mediaThumbnail?.$ && mediaThumbnail.$.url) {
          image = mediaThumbnail.$.url;
        }
      }
      
      // 4. Try to extract from content or description
      const content = item["content:encoded"] || item.content || "";
      const description = item.description || "";
      if (!image) {
        image = extractImageFromHtml(content) || extractImageFromHtml(description);
      }
      
      return {
        title: item.title || "Untitled",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        description: item.description || item.contentSnippet || "",
        content,
        author: item["dc:creator"] || item.creator || "",
        categories: item.categories || [],
        guid: item.guid || item.link || "",
        image,
      };
    });
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
}

/**
 * Get blog posts with caching (60 minutes)
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  return fetchRSSFeed();
}

/**
 * Convert news items to BlogPost format
 */
export function getNewsAsPosts(): BlogPost[] {
  return DATA.news.map((newsItem) => ({
    title: newsItem.title,
    link: `${DATA.url}/#news`, // Link to news section on homepage
    pubDate: new Date(`${newsItem.date}.01`).toISOString(), // Convert YYYY.MM to ISO date
    description: newsItem.content,
    content: newsItem.content,
    author: DATA.name,
    categories: ["News"],
    guid: `${DATA.url}/news/${newsItem.date}-${newsItem.title.replace(/\s+/g, "-").toLowerCase()}`,
  }));
}

/**
 * Get feed items based on configured mode
 * @returns Array of blog posts based on feedMode setting
 */
export async function getFeedItems(): Promise<BlogPost[]> {
  const mode = env.feedMode;

  switch (mode) {
    case "news":
      // Only show latest news
      return getNewsAsPosts();

    case "rss":
      // Only show RSS feed
      return fetchRSSFeed();

    case "both": {
      // Combine both sources
      const [rssPosts, newsPosts] = await Promise.all([
        fetchRSSFeed(),
        Promise.resolve(getNewsAsPosts()),
      ]);
      
      // Merge and sort by date
      const allPosts = [...rssPosts, ...newsPosts].sort((a, b) => {
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      });
      
      return allPosts;
    }

    default:
      // Default to RSS for backward compatibility
      return fetchRSSFeed();
  }
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, locale: string = "en"): string {
  const date = new Date(dateString);
  
  if (locale === "zh") {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Strip HTML tags from text
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  
  let text = html;
  
  // Remove script tags and their content
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  
  // Remove style tags and their content
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  
  // Remove code blocks (pre and code tags) and their content
  text = text.replace(/<pre\b[^<]*(?:(?!<\/pre>)<[^<]*)*<\/pre>/gi, " [code] ");
  text = text.replace(/<code\b[^<]*(?:(?!<\/code>)<[^<]*)*<\/code>/gi, " ");
  
  // Remove comments
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  
  // Replace common block elements with spaces to preserve word boundaries
  text = text.replace(/<\/(div|p|br|li|h[1-6]|blockquote|article|section)>/gi, " ");
  
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, "");
  
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "...")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  
  // Remove excessive whitespace and normalize
  text = text
    .replace(/\s+/g, " ")
    .replace(/\[code\]\s*/g, "")
    .trim();
  
  return text;
}

/**
 * Extract excerpt from HTML content
 */
export function getExcerpt(html: string, maxLength: number = 200): string {
  // Strip HTML tags
  const text = stripHtml(html);
  // Trim and truncate
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Extract first image URL from HTML content
 */
export function extractImageFromHtml(html: string): string | undefined {
  if (!html) return undefined;
  
  // Try to find img tag
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  
  // Try to find og:image or twitter:image meta tags
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (ogImageMatch && ogImageMatch[1]) {
    return ogImageMatch[1];
  }
  
  const twitterImageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (twitterImageMatch && twitterImageMatch[1]) {
    return twitterImageMatch[1];
  }
  
  return undefined;
}
