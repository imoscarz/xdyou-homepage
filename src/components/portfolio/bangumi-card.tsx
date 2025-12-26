"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { BangumiCollection, getCollectionTypeLabel } from "@/lib/bangumi";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";

interface BangumiCardProps {
  collection: BangumiCollection;
  locale: Locale;
  dict?: {
    anime: {
      progress: string;
    };
  } | null;
}

export function BangumiCard({ collection, locale, dict }: BangumiCardProps) {
  const { subject } = collection;
  const displayName = locale === "zh" && subject.name_cn ? subject.name_cn : subject.name;
  const bangumiUrl = `https://bgm.tv/subject/${subject.id}`;
  const statusLabel = getCollectionTypeLabel(collection.type, locale);
  
  // Get episode info from infobox
  const totalEpisodes = subject.total_episodes || 0;
  const watchedEpisodes = collection.ep_status;
  
  // Get tags from subject (not collection) and extract tag names
  const tags = (subject.tags || [])
    .slice(0, env.bangumiMaxTags)
    .map(tag => tag.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link
        href={bangumiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group border-border bg-card focus-visible:ring-ring block overflow-hidden rounded-xl border shadow-sm transition-shadow duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className="flex flex-col">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
            {subject.images?.large && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={subject.images.large}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="flex flex-col p-3 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <h3 className="text-sm font-medium tracking-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {displayName}
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0.5 h-auto leading-tight align-middle">
                {statusLabel}
              </Badge>
            </h3>
          
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map((tag, index) => (
                  <Badge 
                    key={`${collection.subject.id}-tag-${index}`} 
                    variant="outline" 
                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 h-auto leading-tight"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              {totalEpisodes > 0 && (
                <span>
                  {dict?.anime.progress || (locale === "zh" ? "进度" : "Progress")}: {watchedEpisodes}/{totalEpisodes}
                </span>
              )}
              {subject.rating?.score > 0 && (
                <Badge variant="secondary" className="text-xs">
                  ⭐ {subject.rating.score.toFixed(1)}
                </Badge>
              )}
            </div>

            {subject.date && (
              <p className="text-xs text-muted-foreground">
                {new Date(subject.date).getFullYear()}
              </p>
            )}
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
