import DownloadClient, {
  type DownloadDictionary,
  type Platform,
} from "@/components/project/download-client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GitHubAsset } from "@/lib/github";

type LatestRelease = {
  version: string;
  date: string;
  notes: string;
  notesHtml?: string;
  downloadUrl: string;
  assets?: GitHubAsset[];
};
export default function DownloadsSection({
  platforms,
  latestRelease,
  dict,
}: {
  platforms: Platform[];
  latestRelease?: LatestRelease;
  dict: DownloadDictionary & {
    title: string;
    badge: string;
    latestVersion: string;
    releaseNotes: string;
  };
}) {
  return (
    <section id="downloads" className="scroll-mt-10 py-12">
      <div className="mx-auto w-full space-y-8">
        <div className="space-y-3 text-center">
          <span className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
            {dict.badge}
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {dict.title}
          </h2>
        </div>
        {latestRelease && (
          <Card className="mx-auto max-w-6xl">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-xl">
                  {dict.latestVersion}: {latestRelease.version}
                </CardTitle>
                <Badge variant="outline">{latestRelease.date}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <details>
                <summary className="text-foreground cursor-pointer rounded-lg py-2 text-sm font-medium focus-visible:outline-2">
                  {dict.releaseNotes}
                </summary>
                {latestRelease.notesHtml ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none pt-4"
                    dangerouslySetInnerHTML={{
                      __html: latestRelease.notesHtml,
                    }}
                  />
                ) : (
                  <p className="pt-4 whitespace-pre-wrap">
                    {latestRelease.notes}
                  </p>
                )}
              </details>
            </CardContent>
          </Card>
        )}
        <DownloadClient
          platforms={platforms}
          assets={latestRelease?.assets}
          dict={dict}
        />
      </div>
    </section>
  );
}
