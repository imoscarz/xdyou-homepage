"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type PlatformDownloadButtonProps = {
  dict: {
    downloadButton: string;
    moreDownloads: string;
  };
  androidUrl: string;
  iosUrl: string;
  windowsUrl: string;
  linuxUrl: string;
};

function detectPlatform(): "android" | "ios" | "windows" | "linux" | "unknown" {
  if (typeof window === "undefined") return "unknown";

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/android/.test(userAgent)) {
    return "android";
  }
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }
  if (/win/.test(userAgent)) {
    return "windows";
  }
  if (/linux/.test(userAgent)) {
    return "linux";
  }

  return "unknown";
}

export default function PlatformDownloadButton({
  dict,
  androidUrl,
  iosUrl,
  windowsUrl,
  linuxUrl,
}: PlatformDownloadButtonProps) {
  const [downloadUrl, setDownloadUrl] = useState<string>("#downloads");

  useEffect(() => {
    const platform = detectPlatform();

    switch (platform) {
      case "android":
        setDownloadUrl(androidUrl);
        break;
      case "ios":
        setDownloadUrl(iosUrl);
        break;
      case "windows":
        setDownloadUrl(windowsUrl);
        break;
      case "linux":
        setDownloadUrl(linuxUrl);
        break;
      default:
        setDownloadUrl("#downloads");
    }
  }, [androidUrl, iosUrl, windowsUrl, linuxUrl]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" className="text-base font-semibold">
        <Link href={downloadUrl} target="_blank" rel="noopener noreferrer">
          {dict.downloadButton}
        </Link>
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
