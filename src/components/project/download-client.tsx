import Link from "next/link";

import { Icons } from "@/components/icons";
import DownloadCard from "@/components/project/download-card-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectConfig } from "@/config/project";
import { getDownloadOptions } from "@/lib/download-options";
import type { GitHubAsset } from "@/lib/github";

export type Platform = {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  downloadUrl?: string;
  alternativeUrl?: string;
  alternativeName?: string;
  available: boolean;
  comingSoon?: boolean;
  notice?: "thirdParty" | "maintenance";
};
export type DownloadDictionary = {
  downloadFor: string;
  comingSoon: string;
  unavailable: string;
  maintenanceNotice: string;
  maintenanceLabel: string;
  thirdParty: string;
  ohosNotice: string;
  appGallery: string;
};

export default function DownloadClient({
  platforms,
  assets = [],
  dict,
}: {
  platforms: Platform[];
  assets?: GitHubAsset[];
  dict: DownloadDictionary;
}) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {platforms.map((platform) => {
        const patterns =
          projectConfig.assetPatterns[
            platform.id as keyof typeof projectConfig.assetPatterns
          ] || [];
        const links = getDownloadOptions(
          platform,
          assets,
          patterns,
          `${projectConfig.repo.url}/releases/latest`,
          platform.id === "ohos" ? dict.appGallery : dict.downloadFor,
        );
        const note =
          platform.notice === "thirdParty"
            ? dict.thirdParty
            : platform.notice === "maintenance"
              ? dict.maintenanceLabel
              : undefined;
        const notice =
          platform.notice === "thirdParty"
            ? dict.ohosNotice
            : platform.notice === "maintenance"
              ? dict.maintenanceNotice
              : undefined;
        return (
          <DownloadCard
            key={platform.id}
            id={platform.id}
            name={platform.name}
            icon={platform.icon}
            note={note}
            className={
              platform.id === "ohos" ? "col-span-2 sm:col-span-1" : undefined
            }
          >
            {notice && (
              <div className="space-y-3">
                <Badge variant="secondary">{note}</Badge>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {notice}
                </p>
              </div>
            )}
            <div className="mt-auto space-y-2 pt-2">
              {platform.available ? (
                links.map((link) => (
                  <Button
                    key={link.url}
                    asChild
                    className="h-auto min-h-9 w-full px-2 py-2 text-center break-words whitespace-normal"
                  >
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </Link>
                  </Button>
                ))
              ) : (
                <Badge variant="secondary">
                  {platform.comingSoon ? dict.comingSoon : dict.unavailable}
                </Badge>
              )}
              {platform.available && platform.alternativeUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="h-auto min-h-9 w-full px-2 py-2 text-center break-words whitespace-normal"
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
            </div>
          </DownloadCard>
        );
      })}
    </div>
  );
}
