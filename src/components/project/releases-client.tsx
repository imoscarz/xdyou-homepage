"use client";

import { ChevronDown, FileBox, FileCode, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CustomReactMarkdown } from "@/components/react-markdown";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { projectConfig } from "@/config/project";
import {
  formatFileSize,
  formatReleaseDate,
  GitHubRelease,
} from "@/lib/github";

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
    <div className="space-y-6">
      {displayedReleases.map((release, idx) => {
        const [isNotesOpen, setIsNotesOpen] = useState(true); // 默认展开
        const [areAssetsOpen, setAreAssetsOpen] = useState(false);

        return (
          <BlurFade key={release.id} delay={delay + idx * 0.05}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Tag className="size-5" />
                      {release.name || release.tag_name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{release.tag_name}</Badge>
                      <span>•</span>
                      <span>
                        {dict.releasedOn} {formatReleaseDate(release.published_at)}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="default" size="sm">
                    <Link href={release.html_url} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Release Notes - 默认展开 */}
                {release.body && (
                  <div className="space-y-3">
                    <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
                          <span className="text-sm font-semibold">Release Notes</span>
                          <ChevronDown
                            className={`size-4 transition-transform ${
                              isNotesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Card className="mt-2 border-muted">
                          <CardContent className="prose prose-sm dark:prose-invert max-w-none p-4">
                            <CustomReactMarkdown>{release.body}</CustomReactMarkdown>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}

                {/* Assets */}
                {release.assets.length > 0 && (
                  <div className="space-y-3">
                    <Collapsible open={areAssetsOpen} onOpenChange={setAreAssetsOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
                          <h4 className="flex items-center gap-2 text-sm font-semibold">
                            <FileBox className="size-4" />
                            {dict.assets} ({release.assets.length})
                          </h4>
                          <ChevronDown
                            className={`size-4 transition-transform ${
                              areAssetsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 grid gap-2">
                          {release.assets.map((asset) => (
                            <Card key={asset.id} className="border-muted">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-1">
                                    <p className="font-medium">{asset.name}</p>
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                      <span>{formatFileSize(asset.size)}</span>
                                      <span>•</span>
                                      <span>{dict.downloadCount}: {asset.download_count.toLocaleString()}</span>
                                      <span>•</span>
                                      <span>{asset.content_type}</span>
                                    </div>
                                  </div>
                                  <Button asChild size="sm">
                                    <Link
                                      href={asset.browser_download_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Download
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}

                {/* Source Code */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <FileCode className="size-4" />
                    {dict.sourceCode}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={release.zipball_url} target="_blank" rel="noopener noreferrer">
                        ZIP
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={release.tarball_url} target="_blank" rel="noopener noreferrer">
                        TAR.GZ
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        );
      })}

      {/* Load More Button */}
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
  );
}
