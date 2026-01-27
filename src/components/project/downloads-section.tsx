"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import DownloadClient from "@/components/project/download-client";
import { CustomReactMarkdown } from "@/components/react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { GitHubAsset } from "@/lib/github";

type Platform = {
  id: string;
  name: string;
  icon: keyof typeof import("@/components/icons").Icons;
  downloadUrl: string;
  alternativeUrl?: string;
  alternativeName?: string;
  available: boolean;
  comingSoon?: boolean;
};

type LatestRelease = {
  version: string;
  date: string;
  notes: string;
  downloadUrl: string;
  assets?: GitHubAsset[];
};

type DownloadsSectionProps = {
  platforms: Platform[];
  latestRelease?: LatestRelease;
  delay?: number;
  dict: {
    title: string;
    badge: string;
    latestVersion: string;
    releaseNotes: string;
    downloadFor: string;
    comingSoon: string;
    unavailable: string;
    windowsMaintenanceWarning?: string;
  };
};

export default function DownloadsSection({
  platforms,
  latestRelease,
  dict,
}: DownloadsSectionProps) {
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);

  return (
    <section id="downloads" className="py-12">
      <div className="mx-auto w-full space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
              {dict.badge}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {dict.title}
            </h2>
          </div>
        </div>

        {/* Latest Release Info */}
        {latestRelease && (
          <Card className="mx-auto max-w-4xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {dict.latestVersion}: {latestRelease.version}
                </CardTitle>
                <Badge variant="outline">{latestRelease.date}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Collapsible
                open={isReleaseNotesOpen}
                onOpenChange={setIsReleaseNotesOpen}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    <span>{dict.releaseNotes}</span>
                    <ChevronDown
                      className={`size-4 transition-transform ${
                        isReleaseNotesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <CustomReactMarkdown>
                      {latestRelease.notes}
                    </CustomReactMarkdown>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        )}

        {/* Download Buttons */}
        <DownloadClient
          platforms={platforms}
          assets={latestRelease?.assets}
          delay={0}
          dict={{
            downloadFor: dict.downloadFor,
            comingSoon: dict.comingSoon,
            unavailable: dict.unavailable,
            windowsMaintenanceWarning: dict.windowsMaintenanceWarning,
          }}
        />
      </div>
    </section>
  );
}
