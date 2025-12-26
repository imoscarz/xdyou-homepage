"use client";

import { FileBox, FileCode, Tag } from "lucide-react";
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
  const [releases] = useState<GitHubRelease[]>(initialReleases);
  const [openReleases, setOpenReleases] = useState<Set<number>>(new Set());

  const toggleRelease = (id: number) => {
    setOpenReleases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
      {releases.map((release, idx) => {
        const isOpen = openReleases.has(release.id);

        return (
          <BlurFade key={release.id} delay={delay + idx * 0.05}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Tag className="size-5" />
                      {release.name || release.tag_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{release.tag_name}</Badge>
                      <span>•</span>
                      <span>
                        {dict.releasedOn} {formatReleaseDate(release.published_at)}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="default">
                    <Link href={release.html_url} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Release Notes */}
                {release.body && (
                  <Collapsible open={isOpen} onOpenChange={() => toggleRelease(release.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        Release Notes {isOpen ? "▼" : "▶"}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="prose prose-sm dark:prose-invert mt-4 max-w-none">
                        <CustomReactMarkdown>{release.body}</CustomReactMarkdown>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Assets */}
                {release.assets.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <FileBox className="size-4" />
                      {dict.assets}
                    </h4>
                    <div className="grid gap-2">
                      {release.assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-accent"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(asset.size)} • {dict.downloadCount}:{" "}
                              {asset.download_count.toLocaleString()}
                            </p>
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={asset.browser_download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
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
    </div>
  );
}
