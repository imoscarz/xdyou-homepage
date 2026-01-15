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
    checksum: string;
    windowsMaintenanceWarning?: string;
  };
};

export default function ReleaseCard({
  release,
  delay = 0,
  dict,
}: ReleaseCardProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(true); // 默认展开
  const [areAssetsOpen, setAreAssetsOpen] = useState(false);
  const [copiedChecksum, setCopiedChecksum] = useState<string | null>(null);

  const copyChecksum = async (checksum: string, assetName: string) => {
    try {
      await navigator.clipboard.writeText(checksum);
      setCopiedChecksum(assetName);
      setTimeout(() => setCopiedChecksum(null), 2000);
    } catch (err) {
      console.error("Failed to copy checksum:", err);
    }
  };

  const truncateChecksum = (checksum: string) => {
    return checksum.length > 8 ? `${checksum.slice(0, 8)}...` : checksum;
  };

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
                  <Card className="border-muted mt-2 border-0 sm:border">
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
                    {release.assets.map((asset) => {
                      const isDesktopAsset = asset.name
                        .toLowerCase()
                        .includes("watermeter");
                      return (
                        <Card
                          key={asset.id}
                          className="border-muted transition-all duration-300 hover:shadow-md dark:hover:shadow-lg"
                        >
                          <CardContent className="p-3 sm:p-4">
                            {/* Windows或Linux维护警告 */}
                            {isDesktopAsset &&
                              dict.windowsMaintenanceWarning && (
                                <div className="mb-3 rounded-md border border-yellow-200 bg-yellow-50 p-2 dark:border-yellow-900 dark:bg-yellow-950">
                                  <p className="text-xs text-yellow-800 dark:text-yellow-100">
                                    ⚠️ {dict.windowsMaintenanceWarning}
                                  </p>
                                </div>
                              )}
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
                                  <span className="hidden lg:inline">•</span>
                                  <span className="hidden lg:inline">
                                    {asset.content_type.split("/")[1] ||
                                      asset.content_type}
                                  </span>
                                </div>
                              </div>

                              {asset.checksum && (
                                <div className="hidden items-center gap-2 pr-4 sm:flex">
                                  <span className="text-muted-foreground text-xs">
                                    SHA256:
                                  </span>
                                  <code
                                    className={`bg-muted hover:bg-muted/80 cursor-pointer rounded px-1.5 py-0.5 font-mono text-[5px] transition-colors ${
                                      copiedChecksum === asset.name
                                        ? "text-green-600"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      copyChecksum(asset.checksum!, asset.name)
                                    }
                                    title="Click to copy checksum"
                                  >
                                    {copiedChecksum === asset.name
                                      ? "copied!"
                                      : truncateChecksum(asset.checksum)}
                                  </code>
                                </div>
                              )}

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
                      );
                    })}
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
