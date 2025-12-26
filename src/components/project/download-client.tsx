"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GitHubAsset } from "@/lib/github";

type Platform = {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  downloadUrl: string;
  alternativeUrl?: string;
  alternativeName?: string;
  available: boolean;
  comingSoon?: boolean;
};

type DownloadClientProps = {
  platforms: Platform[];
  assets: GitHubAsset[] | undefined;
  delay: number;
  dict: {
    downloadFor: string;
    comingSoon: string;
    unavailable: string;
  };
};

export default function DownloadClient({
  platforms,
  assets = [],
  delay,
  dict,
}: DownloadClientProps) {
  // 定义每个平台的安装包命名模式
  const platformAssets: Record<
    string,
    { pattern: RegExp; displayName: string }[]
  > = {
    android: [
      { pattern: /app-arm64-v8a-release\.apk$/, displayName: "ARM64" },
      { pattern: /app-armeabi-v7a-release\.apk$/, displayName: "ARMv7" },
      { pattern: /app-x86_64-release\.apk$/, displayName: "x86_64" },
    ],
    linux: [
      {
        pattern: /watermeter-linux-release-amd64\.zip$/,
        displayName: "ZIP (amd64)",
      },
      { pattern: /watermeter.*\.AppImage$/, displayName: "AppImage" },
    ],
    windows: [
      {
        pattern: /watermeter-windows-release-amd64\.zip$/,
        displayName: "ZIP (amd64)",
      },
    ],
  };

  const getPlatformAssets = (platformId: string) => {
    const patterns = platformAssets[platformId];
    if (!patterns) return [];

    return patterns
      .map((p) => {
        const asset = assets.find((a) => p.pattern.test(a.name));
        return asset
          ? { ...asset, displayName: p.displayName }
          : null;
      })
      .filter(Boolean) as (GitHubAsset & { displayName: string })[];
  };

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {platforms.map((platform, idx) => {
        const Icon = Icons[platform.icon];
        const platformVersions = getPlatformAssets(platform.id);
        const hasMultipleVersions = platformVersions.length > 1;

        return (
          <BlurFade key={platform.id} delay={delay + idx * 0.05}>
            <Card
              className={`${!platform.available ? "opacity-60" : ""}`}
            >
              <CardContent className="flex flex-col items-center justify-center space-y-3 p-6">
                <Icon className="size-12 text-primary" />
                <h3 className="text-lg font-semibold">{platform.name}</h3>

                {platform.available ? (
                  <>
                    {/* 如果有多个版本，显示选择按钮 */}
                    {hasMultipleVersions ? (
                      <div className="w-full space-y-2">
                        {platformVersions.map((asset) => (
                          <Button
                            key={asset.id}
                            asChild
                            size="sm"
                            className="w-full"
                          >
                            <Link
                              href={asset.browser_download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {asset.displayName}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Button asChild size="sm" className="w-full">
                        <Link
                          href={
                            platformVersions[0]?.browser_download_url ||
                            platform.downloadUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {dict.downloadFor}
                        </Link>
                      </Button>
                    )}

                    {/* 显示备用下载链接 */}
                    {platform.alternativeUrl && (
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link
                          href={platform.alternativeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {platform.alternativeName}
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <Badge variant="secondary" className="w-full justify-center">
                    {platform.comingSoon ? dict.comingSoon : dict.unavailable}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </BlurFade>
        );
      })}
    </div>
  );
}
