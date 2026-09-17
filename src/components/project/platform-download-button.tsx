"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  type DeviceInfo,
  type DownloadAsset,
  resolvePlatformDownload,
} from "@/lib/platform-detection";

type PlatformDownloadButtonProps = {
  dict: {
    downloadButton: string;
    moreDownloads: string;
  };
  iosUrl: string;
  assets: DownloadAsset[];
};

export default function PlatformDownloadButton({
  dict,
  iosUrl,
  assets,
}: PlatformDownloadButtonProps) {
  const [downloadUrl, setDownloadUrl] = useState<string>("#downloads");

  useEffect(() => {
    let cancelled = false;
    const nav = navigator as Navigator & {
      userAgentData?: {
        platform?: string;
        getHighEntropyValues?: (
          keys: string[],
        ) => Promise<{ architecture?: string; bitness?: string }>;
      };
    };
    const info: DeviceInfo = {
      userAgent: nav.userAgent,
      platform: nav.platform,
      maxTouchPoints: nav.maxTouchPoints,
      hintPlatform: nav.userAgentData?.platform,
    };
    setDownloadUrl(resolvePlatformDownload(info, assets, iosUrl));
    // Hints are optional and may be denied. The initial platform selector stays usable.
    void nav.userAgentData
      ?.getHighEntropyValues?.(["architecture", "bitness"])
      .then((hints) => {
        if (!cancelled)
          setDownloadUrl(
            resolvePlatformDownload({ ...info, ...hints }, assets, iosUrl),
          );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [assets, iosUrl]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" className="text-base font-semibold">
        <a
          href={downloadUrl}
          onClick={() => {
            if (downloadUrl.startsWith("#download-")) {
              window.dispatchEvent(
                new CustomEvent("platform-download", { detail: downloadUrl }),
              );
            }
          }}
          target={downloadUrl.startsWith("#") ? undefined : "_blank"}
          rel="noopener noreferrer"
        >
          {dict.downloadButton}
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="text-base font-semibold"
      >
        <Link href="#downloads">{dict.moreDownloads}</Link>
      </Button>
    </div>
  );
}
