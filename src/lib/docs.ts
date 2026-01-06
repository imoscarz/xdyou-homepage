import fs from "fs";
import matter from "gray-matter";
import path from "path";

const docsDirectory = path.join(process.cwd(), "contents/docs");

export type DocMetadata = {
  title: string;
  description: string;
  order?: number;
  category?: string;
};

export type Doc = {
  slug: string;
  metadata: DocMetadata;
  content: string;
};

/**
 * Get all doc slugs
 */
export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(docsDirectory);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

/**
 * Get doc by slug
 */
export function getDocBySlug(slug: string): Doc | null {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      metadata: data as DocMetadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading doc ${slug}:`, error);
    return null;
  }
}

/**
 * Get all docs with metadata
 */
export function getAllDocs(): Doc[] {
  const slugs = getAllDocSlugs();
  const docs = slugs
    .map((slug) => getDocBySlug(slug))
    .filter((doc): doc is Doc => doc !== null)
    .sort((a, b) => {
      const orderA = a.metadata.order ?? 999;
      const orderB = b.metadata.order ?? 999;
      return orderA - orderB;
    });

  return docs;
}

/**
 * Get docs grouped by category
 */
export function getDocsByCategory(): Record<string, Doc[]> {
  const docs = getAllDocs();
  const grouped: Record<string, Doc[]> = {};

  docs.forEach((doc) => {
    const category = doc.metadata.category || "未分类";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  });

  return grouped;
}
