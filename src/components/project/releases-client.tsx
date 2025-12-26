"use client";

import { useState } from "react";

import ReleaseCard from "@/components/project/release-card";
import ReleaseToc from "@/components/project/release-toc";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { projectConfig } from "@/config/project";
import { GitHubRelease } from "@/lib/github";

type ReleasesClientProps = {
  initialReleases: GitHubRelease[];
  dict: {
    version: string;
    releasedOn: string;
    releaseNotes: string;
    assets: string;
    sourceCode: string;
    downloadCount: string;
    loadMore: string;
    noReleases: string;
    toc: string;
  };
  delay?: number;
};

export default function ReleasesClient({
  initialReleases,
  dict,
  delay = 0,
}: ReleasesClientProps) {
  const [releases, setReleases] = useState<GitHubRelease[]>(initialReleases);
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    setIsLoading(true);
    
    // 如果还有未显示的已加载releases，先显示它们
    if (displayCount < releases.length) {
      setDisplayCount((prev) => Math.min(prev + 5, releases.length));
      setIsLoading(false);
      return;
    }
    
    // 如果需要从API加载更多
    if (hasMore) {
      try {
        const nextPage = page + 1;
        const response = await fetch(
          `https://api.github.com/repos/${projectConfig.repo.owner}/${projectConfig.repo.name}/releases?per_page=10&page=${nextPage}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        
        if (response.ok) {
          const newReleases: GitHubRelease[] = await response.json();
          
          if (newReleases.length === 0) {
            setHasMore(false);
          } else {
            setReleases((prev) => [...prev, ...newReleases]);
            setDisplayCount((prev) => prev + 5);
            setPage(nextPage);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to load more releases:", error);
        setHasMore(false);
      }
    }
    
    setIsLoading(false);
  };

  const displayedReleases = releases.slice(0, displayCount);

  if (releases.length === 0) {
    return (
      <BlurFade delay={delay}>
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center p-8">
            <p className="text-muted-foreground">{dict.noReleases}</p>
          </CardContent>
        </Card>
      </BlurFade>
    );
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-4 sm:space-y-6">
        {displayedReleases.map((release, idx) => (
          <ReleaseCard
            key={release.id}
            release={release}
            delay={delay + idx * 0.05}
            dict={{
              releasedOn: dict.releasedOn,
              releaseNotes: dict.releaseNotes,
              assets: dict.assets,
              sourceCode: dict.sourceCode,
              downloadCount: dict.downloadCount,
            }}
          />
        ))}

        {/* Load More Button - Always visible at bottom */}
        {(displayCount < releases.length || hasMore) && (
          <BlurFade delay={delay + displayedReleases.length * 0.05}>
            <div className="flex justify-center pt-4">
              <Button
                onClick={loadMore}
                disabled={isLoading}
                variant="outline"
                size="lg"
              >
                {isLoading ? "Loading..." : dict.loadMore}
              </Button>
            </div>
          </BlurFade>
        )}
      </div>

      {/* TOC Sidebar */}
      <ReleaseToc
        releases={releases}
        displayCount={displayCount}
        hasMore={displayCount < releases.length || hasMore}
        onLoadMore={loadMore}
        isLoading={isLoading}
        dict={{
          toc: dict.toc,
          loadMore: dict.loadMore,
        }}
      />
    </div>
  );
}
