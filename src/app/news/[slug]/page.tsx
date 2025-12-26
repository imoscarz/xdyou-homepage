import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomReactMarkdown } from "@/components/react-markdown";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { BLUR_FADE_DELAY } from "@/data";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";
import { getAllNewsPosts, getNewsPost } from "@/lib/news";

type PageProps = {
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
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

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
}: PageProps) {
  const { slug } = await params;
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  const post = await getNewsPost(slug);

  if (!post || post.lang !== locale) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20">
      {/* Back Button */}
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Button asChild variant="ghost" size="sm" className="w-fit">
          <Link href={`/news?lang=${locale}`}>
            <ArrowLeft className="mr-2 size-4" />
            {locale === "en" ? "Back to News" : "返回新闻列表"}
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
