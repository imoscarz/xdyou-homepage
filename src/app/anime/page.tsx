import { Metadata } from "next";

import { AnimeListClient } from "@/components/portfolio/anime-list-client";
import { BlurFade } from "@/components/ui/blur-fade";
import { BLUR_FADE_DELAY } from "@/data";
import { type CollectionType,getBangumiCollections } from "@/lib/bangumi";
import { env } from "@/lib/env";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);
  
  return {
    title: dict.anime.metadata.title,
    description: dict.anime.metadata.description,
  };
}

export default async function AnimePage({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);
  
  // Fetch all collection types
  const allCollectionsPromises = [1, 2, 3, 4, 5].map(type => 
    getBangumiCollections(env.bangumiUsername, type)
  );
  const allCollectionsArrays = await Promise.all(allCollectionsPromises);
  const allCollections = allCollectionsArrays.flat();
  
  // Group by collection type
  const groupedCollections: Record<CollectionType, typeof allCollections> = {
    all: allCollections,
    watching: allCollections.filter(c => c.type === 3),
    watched: allCollections.filter(c => c.type === 2),
    wish: allCollections.filter(c => c.type === 1),
    onHold: allCollections.filter(c => c.type === 4),
    dropped: allCollections.filter(c => c.type === 5),
  };

  const categories: { key: CollectionType; label: string }[] = [
    { key: 'all' as const, label: dict.anime.categories.all },
    { key: 'watching' as const, label: dict.anime.categories.watching },
    { key: 'watched' as const, label: dict.anime.categories.watched },
    { key: 'wish' as const, label: dict.anime.categories.wish },
    { key: 'onHold' as const, label: dict.anime.categories.onHold },
    { key: 'dropped' as const, label: dict.anime.categories.dropped },
  ].filter(cat => cat.key === 'all' || groupedCollections[cat.key].length > 0);

  return (
    <section className="pt-16 pb-12 sm:pt-24 sm:pb-14 md:pt-32 md:pb-16 lg:pt-36 xl:pt-40">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-10">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="mb-8 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
              {dict.anime.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              {dict.anime.description}
            </p>
          </div>
        </BlurFade>

        <AnimeListClient
          groupedCollections={groupedCollections}
          categories={categories}
          locale={locale}
          noAnimeText={dict.anime.noAnime}
          tagFilterPlaceholder={dict.anime.tagFilter}
          tagSearchPlaceholder={dict.anime.tagSearch}
          tagEmptyText={dict.anime.tagEmpty}
          searchPlaceholder={dict.anime.search}
        />
      </div>
    </section>
  );
}
