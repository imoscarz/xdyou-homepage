import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CustomReactMarkdown } from "@/components/react-markdown";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { BLUR_FADE_DELAY } from "@/data";
import { getAllNewsPosts, getNewsPost } from "@/lib/news";
import { getPageI18n, PAGE_CONTAINER_CLASSES } from "@/lib/page-helpers";

type NewsPostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const posts = await getAllNewsPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Try exact slug first
  let post = await getNewsPost(slug);

  // If not found and slug ends with '404', try trimming it and redirect
  if (!post && slug.endsWith("404")) {
    const fixedSlug = slug.replace(/404$/, "");
    const fixedPost = await getNewsPost(fixedSlug);
    if (fixedPost) {
      post = fixedPost;
    }
  }

  if (!post) {
    return {
      title: "News Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({
  params,
  searchParams,
}: NewsPostPageProps) {
  const { slug } = await params;
  const { locale, dict } = await getPageI18n(searchParams);

  // Try exact slug first
  const post = await getNewsPost(slug);

  // If not found and slug ends with '404', try trimming it and redirect to correct URL
  if (!post && slug.endsWith("404")) {
    const fixedSlug = slug.replace(/404$/, "");
    const fixedPost = await getNewsPost(fixedSlug);
    if (fixedPost) {
      redirect(`/news/${fixedSlug}?lang=${locale}`);
    }
  }

  if (!post || post.lang !== locale) {
    notFound();
  }

  return (
    <main className={PAGE_CONTAINER_CLASSES.article}>
      {/* Back Button */}
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href={`/news?lang=${locale}`}>
            <ArrowLeft className="mr-2 size-4" />
            {dict.news.backToNews}
          </Link>
        </Button>
      </BlurFade>

      {/* Article Header */}
      <article className="space-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div className="text-sm text-muted-foreground">
              {dict.news.by}
              {post.author} • {dict.news.publishedOn} {post.date}
            </div>
          </div>
        </BlurFade>

        {/* Article Content */}
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <CustomReactMarkdown>{post.content}</CustomReactMarkdown>
          </div>
        </BlurFade>
      </article>
    </main>
  );
}
