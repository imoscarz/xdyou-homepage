import { Metadata } from "next";

import NewsListClient from "@/components/project/news-list-client";
import { BlurFade } from "@/components/ui/blur-fade";
import { BLUR_FADE_DELAY } from "@/data";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";
import { getAllNewsPosts } from "@/lib/news";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  return {
    title: dict.news.title,
    description: dict.news.description,
  };
}

export default async function NewsPage({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  // Get all news posts
  const allPosts = await getAllNewsPosts();

  // Filter posts by current language
  const posts = allPosts.filter((post) => post.lang === locale);

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      {/* Header */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {dict.news.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dict.news.description}
            </p>
          </div>
        </BlurFade>
      </section>

      {/* News List */}
      <section>
        <NewsListClient
          posts={posts}
          locale={locale}
          dict={{
            search: dict.news.search,
            readMore: dict.news.readMore,
            noNews: dict.news.noNews,
            by: dict.news.by,
            publishedOn: dict.news.publishedOn,
          }}
          delay={BLUR_FADE_DELAY * 2}
        />
      </section>
    </main>
  );
}
