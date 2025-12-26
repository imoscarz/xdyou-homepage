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

  const loadMore = async () => {
    setIsLoading(true);
    // 从已有的releases中显示更多
    setDisplayCount((prev) => Math.min(prev + 5, releases.length));
    
    // 如果需要从API加载更多
    if (displayCount >= releases.length && releases.length < 50) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${projectConfig.repo.owner}/${projectConfig.repo.name}/releases?per_page=10&page=${Math.floor(releases.length / 10) + 1}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        if (response.ok) {
          const newReleases: GitHubRelease[] = await response.json();
          setReleases((prev) => [...prev, ...newReleases]);
        }
      } catch (error) {
        console.error("Failed to load more releases:", error);
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
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {displayedReleases.map((release, idx) => (
          <ReleaseCard
            key={release.id}
            release={release}
            delay={delay + idx * 0.05}
            dict={{
              releasedOn: dict.releasedOn,
              assets: dict.assets,
              sourceCode: dict.sourceCode,
              downloadCount: dict.downloadCount,
            }}
          />
        ))}

        {/* Load More Button - Always visible at bottom */}
        {displayCount < releases.length && (
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
        hasMore={displayCount < releases.length}
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
