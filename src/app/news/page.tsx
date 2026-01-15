import { Metadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons";
import NewsListClient from "@/components/project/news-list-client";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
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
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.news.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {dict.news.description}
              </p>
            </div>
            
            {/* RSS Subscribe Buttons */}
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <Link
                        href={`${siteConfig.url}/api/news/rss?lang=${locale}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="RSS Feed"
                      >
                        <Icons.rss className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>RSS Feed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <Link
                        href={`${siteConfig.url}/api/news/atom?lang=${locale}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Atom Feed"
                      >
                        <Icons.atom className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Atom Feed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
