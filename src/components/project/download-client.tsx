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
    windowsMaintenanceWarning?: string;
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
      { pattern: /watermeter\.Appimage$/i, displayName: "AppImage" },
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
        return asset ? { ...asset, displayName: p.displayName } : null;
      })
      .filter(Boolean) as (GitHubAsset & { displayName: string })[];
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* 移动端: 单列 */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {platforms.map((platform, idx) => {
          const Icon = Icons[platform.icon];
          const platformVersions = getPlatformAssets(platform.id);
          const hasMultipleVersions = platformVersions.length > 1;

          return (
            <BlurFade key={platform.id} delay={delay + idx * 0.05}>
              <Card
                className={`${!platform.available ? "opacity-60" : "hover:scale-105"}`}
              >
                <CardContent className="flex flex-col items-center justify-center space-y-3 p-6">
                  <Icon className="text-primary size-12" />
                  <h3 className="text-lg font-semibold">{platform.name}</h3>

                  {/* Windows维护警告 */}
                  {(platform.id === "windows" || platform.id === "linux") &&
                    dict.windowsMaintenanceWarning && (
                      <div className="w-full rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                        <p className="text-xs text-yellow-800 dark:text-yellow-100">
                          ⚠️ {dict.windowsMaintenanceWarning}
                        </p>
                      </div>
                    )}

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
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
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
                    <Badge
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      {platform.comingSoon ? dict.comingSoon : dict.unavailable}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </div>

      {/* 平板端: 两列 */}
      <div className="hidden grid-cols-2 gap-4 sm:grid lg:hidden">
        {platforms.map((platform, idx) => {
          const Icon = Icons[platform.icon];
          const platformVersions = getPlatformAssets(platform.id);
          const hasMultipleVersions = platformVersions.length > 1;

          return (
            <BlurFade key={platform.id} delay={delay + idx * 0.05}>
              <Card
                className={`${!platform.available ? "opacity-60" : "hover:scale-105"}`}
              >
                <CardContent className="flex flex-col items-center justify-center space-y-3 p-6">
                  <Icon className="text-primary size-12" />
                  <h3 className="text-lg font-semibold">{platform.name}</h3>

                  {/* Windows维护警告 */}
                  {(platform.id === "windows" || platform.id === "linux") &&
                    dict.windowsMaintenanceWarning && (
                      <div className="w-full rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                        <p className="text-xs text-yellow-800 dark:text-yellow-100">
                          ⚠️ {dict.windowsMaintenanceWarning}
                        </p>
                      </div>
                    )}

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
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
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
                    <Badge
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      {platform.comingSoon ? dict.comingSoon : dict.unavailable}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </div>

      {/* 桌面端: Flex 三列布局 */}
      <div className="hidden items-stretch gap-4 lg:flex">
        {/* Android 列 */}
        <div className="flex flex-1">
          <BlurFade delay={delay} key="android" className="flex w-full">
            <Card className="flex w-full flex-col hover:scale-105">
              <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                <Icons.smartphone className="text-primary size-12" />
                <h3 className="text-lg font-semibold">Android</h3>
                <div className="w-full space-y-2">
                  {getPlatformAssets("android").map((asset) => (
                    <Button key={asset.id} asChild size="sm" className="w-full">
                      <Link
                        href={asset.browser_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {asset.displayName}
                      </Link>
                    </Button>
                  )) || (
                    <Button asChild size="sm" className="w-full">
                      <Link
                        href={platforms[0]?.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {dict.downloadFor}
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link
                      href="https://f-droid.org/zh_Hans/packages/io.github.benderblog.traintime_pda/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      F-Droid
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* 中间列: iOS(上方) 和 Windows(下方) */}
        <div className="flex flex-1 flex-col gap-4">
          {/* iOS */}
          <BlurFade delay={delay + 0.05} key="ios">
            <Card className="flex flex-1 flex-col hover:scale-105">
              <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                <Icons.apple className="text-primary size-12" />
                <h3 className="text-lg font-semibold">iOS</h3>
                <div className="flex w-full flex-1 items-end">
                  <Button asChild size="sm" className="w-full">
                    <Link
                      href="https://apps.apple.com/us/app/xdyou/id6461723688?l=zh-Hans-CN"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {dict.downloadFor}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Windows */}
          <BlurFade delay={delay + 0.1} key="windows">
            <Card className="flex flex-1 flex-col hover:scale-105">
              <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                <Icons.laptop className="text-primary size-12" />
                <h3 className="text-lg font-semibold">Windows</h3>
                {dict.windowsMaintenanceWarning && (
                  <div className="w-full rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                    <p className="text-xs text-yellow-800 dark:text-yellow-100">
                      ⚠️ {dict.windowsMaintenanceWarning}
                    </p>
                  </div>
                )}
                <div className="w-full space-y-2">
                  {getPlatformAssets("windows").map((asset) => (
                    <Button key={asset.id} asChild size="sm" className="w-full">
                      <Link
                        href={asset.browser_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {asset.displayName}
                      </Link>
                    </Button>
                  )) || (
                    <Button asChild size="sm" className="w-full">
                      <Link
                        href={platforms[2]?.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {dict.downloadFor}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Linux 列 */}
        <div className="flex flex-1">
          <BlurFade delay={delay + 0.15} key="linux" className="flex w-full">
            <Card className="flex w-full flex-col hover:scale-105">
              <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
                <Icons.computer className="text-primary size-12" />
                <h3 className="text-lg font-semibold">Linux</h3>
                {dict.windowsMaintenanceWarning && (
                  <div className="w-full rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                    <p className="text-xs text-yellow-800 dark:text-yellow-100">
                      ⚠️ {dict.windowsMaintenanceWarning}
                    </p>
                  </div>
                )}
                <div className="w-full space-y-2">
                  {getPlatformAssets("linux").map((asset) => (
                    <Button key={asset.id} asChild size="sm" className="w-full">
                      <Link
                        href={asset.browser_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {asset.displayName}
                      </Link>
                    </Button>
                  )) || (
                    <Button asChild size="sm" className="w-full">
                      <Link
                        href={platforms[3]?.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {dict.downloadFor}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
