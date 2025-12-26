"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { AnimeCategorySelect } from "@/components/portfolio/anime-category-select";
import { AnimeTagSelect } from "@/components/portfolio/anime-tag-select";
import { BangumiCard } from "@/components/portfolio/bangumi-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { BLUR_FADE_DELAY } from "@/data";
import type { BangumiCollection, CollectionType } from "@/lib/bangumi";
import { useDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

type AnimeListClientProps = {
  groupedCollections: Record<CollectionType, BangumiCollection[]>;
  categories: Array<{ key: CollectionType; label: string }>;
  locale: Locale;
  noAnimeText: string;
  tagFilterPlaceholder: string;
  tagSearchPlaceholder: string;
  tagEmptyText: string;
  searchPlaceholder: string;
};

export function AnimeListClient({
  groupedCollections,
  categories,
  locale,
  noAnimeText,
  tagFilterPlaceholder,
  tagSearchPlaceholder,
  tagEmptyText,
  searchPlaceholder,
}: AnimeListClientProps) {
  const dict = useDictionary();
  const [selectedCategory, setSelectedCategory] = React.useState<CollectionType>("all");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Get collections for selected category
  const categoryCollections = groupedCollections[selectedCategory];
  
  // Extract all unique tags from current category
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    categoryCollections.forEach(collection => {
      collection.subject.tags?.forEach(tag => {
        tagSet.add(tag.name);
      });
    });
    return Array.from(tagSet).sort();
  }, [categoryCollections]);
  
  // Filter collections by selected tags and search query
  const collections = React.useMemo(() => {
    let filtered = categoryCollections;
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(collection => 
        selectedTags.every(selectedTag =>
          collection.subject.tags?.some(tag => tag.name === selectedTag)
        )
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(collection => {
        const name = collection.subject.name.toLowerCase();
        const nameCn = collection.subject.name_cn?.toLowerCase() || "";
        return name.includes(query) || nameCn.includes(query);
      });
    }
    
    return filtered;
  }, [categoryCollections, selectedTags, searchQuery]);
  
  // Reset filters when category changes
  React.useEffect(() => {
    setSelectedTags([]);
    setSearchQuery("");
  }, [selectedCategory]);

  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: groupedCollections[cat.key].length,
  }));

  if (Object.values(groupedCollections).every(arr => arr.length === 0)) {
    return (
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{noAnimeText}</p>
        </div>
      </BlurFade>
    );
  }

  return (
    <div className="relative">
      {/* Floating controls - top on mobile, bottom on desktop */}
      <div className="sticky top-16 sm:top-20 md:fixed md:bottom-8 md:top-auto md:left-1/2 md:-translate-x-1/2 z-10 w-full md:w-auto md:max-w-4xl">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-lg shadow-lg p-3 sm:p-4">
            <div className="flex flex-row gap-2 items-center">
              <div className="shrink-0">
                <AnimeCategorySelect
                  categories={categoriesWithCount}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  compact={true}
                />
              </div>
              
              {/* Search box */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background/100 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              
              {allTags.length > 0 && (
                <div className="shrink-0">
                  <AnimeTagSelect
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                    placeholder={tagFilterPlaceholder}
                    searchPlaceholder={tagSearchPlaceholder}
                    emptyText={tagEmptyText}
                    compact={true}
                  />
                </div>
              )}
            </div>
          </div>
        </BlurFade>
      </div>

      {/* Content with padding to avoid overlap with floating controls */}
      <div className="pt-6 pb-6 md:pb-32">
        {/* Masonry layout using CSS columns */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 sm:gap-5 [column-fill:balance]">
          {collections.map((collection) => (
            <div 
              key={`${selectedCategory}-${collection.subject.id}`}
              className="inline-block w-full mb-4 sm:mb-5"
            >
              <BangumiCard 
                collection={collection} 
                locale={locale}
                dict={dict}
              />
            </div>
          ))}
        </div>
        
        {collections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{noAnimeText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
