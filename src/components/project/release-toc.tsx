"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GitHubRelease } from "@/lib/github";

type ReleaseTocProps = {
  releases: GitHubRelease[];
  displayCount: number;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  dict: {
    toc: string;
    loadMore: string;
  };
};

export default function ReleaseToc({
  releases,
  displayCount,
  hasMore,
  onLoadMore,
  isLoading,
  dict,
}: ReleaseTocProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-release-id");
            if (id) {
              setActiveId(Number(id));
            }
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    const releaseCards = document.querySelectorAll("[data-release-id]");
    releaseCards.forEach((card) => observer.observe(card));

    return () => {
      releaseCards.forEach((card) => observer.unobserve(card));
    };
  }, [displayCount]);

  const scrollToRelease = (id: number) => {
    const element = document.querySelector(`[data-release-id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const displayedReleases = releases.slice(0, displayCount);

  return (
    <div className="sticky top-24 hidden h-fit max-h-[calc(100vh-8rem)] xl:block">
      <Card className="flex w-64 flex-col">
        <CardHeader className="flex-none pb-3">
          <CardTitle className="text-base">{dict.toc}</CardTitle>
        </CardHeader>
        <CardContent
          className="scrollbar-thin flex-1 space-y-1 overflow-y-auto"
          style={{ maxHeight: "60vh" }}
        >
          {displayedReleases.map((release) => (
            <button
              key={release.id}
              onClick={() => scrollToRelease(release.id)}
              className={`block w-full truncate rounded px-2 py-1.5 text-left text-sm transition-colors ${
                activeId === release.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={release.name || release.tag_name}
            >
              {release.tag_name}
            </button>
          ))}
          {hasMore && (
            <div className="border-t pt-2">
              <Button
                onClick={onLoadMore}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isLoading ? "Loading..." : dict.loadMore}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
