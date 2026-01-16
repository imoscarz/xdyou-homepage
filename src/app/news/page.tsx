import Link from "next/link";

import { Icons } from "@/components/icons";
import { PageHeaderWithActions } from "@/components/layout/page-header";
import NewsListClient from "@/components/project/news-list-client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { BLUR_FADE_DELAY } from "@/data";
import { getAllNewsPosts } from "@/lib/news";
import {
  generateSimpleMetadata,
  getPageI18n,
  PAGE_CONTAINER_CLASSES,
  type PageProps,
} from "@/lib/page-helpers";

export async function generateMetadata({ searchParams }: PageProps) {
  return generateSimpleMetadata(
    searchParams,
    "news.title",
    "news.description",
  );
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { locale, dict } = await getPageI18n(searchParams);

  // Get all news posts
  const allPosts = await getAllNewsPosts();

  // Filter posts by current language
  const posts = allPosts.filter((post) => post.lang === locale);

  return (
    <main className={PAGE_CONTAINER_CLASSES.standard}>
      <PageHeaderWithActions
        title={dict.news.title}
        description={dict.news.description}
        actions={
          <>
            {/* RSS Subscribe Buttons */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
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
                  <Button variant="outline" size="icon" asChild>
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
          </>
        }
      />

      {/* News List */}
      <section>
        <NewsListClient
          posts={posts}
          locale={locale}
          dict={{
            search: dict.news.search,
            searchTags: dict.news.searchTags,
            filterByTags: dict.news.filterByTags,
            filterByDate: dict.news.filterByDate,
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
