import fs from "fs";
import matter from "gray-matter";
import path from "path";

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  lang: string;
  content: string;
  excerpt: string;
};

const newsDirectory = path.join(process.cwd(), "contents/news");

export async function getAllNewsPosts(): Promise<NewsPost[]> {
  // Check if directory exists
  if (!fs.existsSync(newsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(newsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(newsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // Create excerpt from content (first 200 chars)
      const excerpt = content
        .replace(/^#.*$/gm, "") // Remove headers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
        .replace(/[#*_`]/g, "") // Remove markdown symbols
        .trim()
        .slice(0, 200) + "...";

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || "",
        author: data.author || "Unknown",
        tags: data.tags || [],
        lang: data.lang || "en",
        content,
        excerpt,
      };
    });

  // Sort by date (newest first)
  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const fullPath = path.join(newsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const excerpt = content
    .replace(/^#.*$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`]/g, "")
    .trim()
    .slice(0, 200) + "...";

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || "",
    author: data.author || "Unknown",
    tags: data.tags || [],
    lang: data.lang || "en",
    content,
    excerpt,
  };
}
