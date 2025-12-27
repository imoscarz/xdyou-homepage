"use client";

import { ChevronDown, FileBox, FileCode, ScrollText, Tag } from "lucide-react";
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
import { formatFileSize, formatReleaseDate, GitHubRelease } from "@/lib/github";

type ReleaseCardProps = {
  release: GitHubRelease;
  delay?: number;
  dict: {
    releasedOn: string;
    releaseNotes: string;
    assets: string;
    sourceCode: string;
    downloadCount: string;
  };
};

export default function ReleaseCard({
  release,
  delay = 0,
  dict,
}: ReleaseCardProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(true); // 默认展开
  const [areAssetsOpen, setAreAssetsOpen] = useState(false);

  return (
    <BlurFade delay={delay}>
      <Card className="scroll-mt-24" data-release-id={release.id}>
        <CardHeader className="bg-muted/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Tag className="size-4 sm:size-5" />
                {release.name || release.tag_name}
              </CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <Badge variant="outline" className="text-xs">
                  {release.tag_name}
                </Badge>
                <span>•</span>
                <span>
                  {dict.releasedOn} {formatReleaseDate(release.published_at)}
                </span>
              </div>
            </div>
            <Button
              asChild
              variant="default"
              size="sm"
              className="w-full sm:w-auto"
            >
              <Link
                href={release.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
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
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-0 hover:bg-transparent"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <ScrollText className="size-4" />
                      {dict.releaseNotes}
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform ${
                        isNotesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="border-muted mt-2">
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
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-0 hover:bg-transparent"
                  >
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
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium break-all sm:text-base">
                                {asset.name}
                              </p>
                              <div className="text-muted-foreground flex flex-wrap gap-1.5 text-xs">
                                <span>{formatFileSize(asset.size)}</span>
                                <span>•</span>
                                <span>
                                  {dict.downloadCount}:{" "}
                                  {asset.download_count.toLocaleString()}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline">
                                  {asset.content_type}
                                </span>
                              </div>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              className="w-full shrink-0 sm:w-auto"
                            >
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
                <Link
                  href={release.zipball_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ZIP
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link
                  href={release.tarball_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TAR.GZ
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </BlurFade>
  );
}
