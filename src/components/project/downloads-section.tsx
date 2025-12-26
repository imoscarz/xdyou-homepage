"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Platform = {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  downloadUrl: string;
  available: boolean;
  comingSoon?: boolean;
};

type LatestRelease = {
  version: string;
  date: string;
  notes: string;
  downloadUrl: string;
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
  };
};

export default function DownloadsSection({
  platforms,
  latestRelease,
  delay = 0,
  dict,
}: DownloadsSectionProps) {
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);

  return (
    <section id="downloads" className="py-12">
      <div className="mx-auto w-full space-y-8">
        <BlurFade delay={delay}>
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
        </BlurFade>

        {/* Latest Release Info */}
        {latestRelease && (
          <BlurFade delay={delay + 0.1}>
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
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                        {latestRelease.notes}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </BlurFade>
        )}

        {/* Download Buttons */}
        <BlurFade delay={delay + 0.2}>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {platforms.map((platform) => {
              const Icon = Icons[platform.icon];
              return (
                <Card
                  key={platform.id}
                  className={`${!platform.available ? "opacity-60" : ""}`}
                >
                  <CardContent className="flex flex-col items-center justify-center space-y-3 p-6">
                    <Icon className="size-12 text-primary" />
                    <h3 className="text-lg font-semibold">{platform.name}</h3>
                    {platform.available ? (
                      <Button asChild size="sm" className="w-full">
                        <Link href={platform.downloadUrl}>
                          {dict.downloadFor}
                        </Link>
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="w-full justify-center">
                        {platform.comingSoon ? dict.comingSoon : dict.unavailable}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
