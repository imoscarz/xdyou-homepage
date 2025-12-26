import { Metadata } from "next";

import ReleasesClient from "@/components/project/releases-client";
import { BlurFade } from "@/components/ui/blur-fade";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { fetchGitHubReleases } from "@/lib/github";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  return {
    title: dict.releases.title,
    description: dict.releases.description,
  };
}

export default async function ReleasesPage({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  // Fetch releases from GitHub
  const releases = await fetchGitHubReleases(
    projectConfig.repo.owner,
    projectConfig.repo.name,
    10 // Fetch 10 releases initially
  );

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      {/* Header */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {dict.releases.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dict.releases.description}
            </p>
          </div>
        </BlurFade>
      </section>

      {/* Releases List */}
      <section>
        <ReleasesClient
          initialReleases={releases}
          dict={{
            version: dict.releases.version,
            releasedOn: dict.releases.releasedOn,
            releaseNotes: dict.releases.releaseNotes,
            assets: dict.releases.assets,
            sourceCode: dict.releases.sourceCode,
            downloadCount: dict.releases.downloadCount,
            loadMore: dict.releases.loadMore,
            noReleases: dict.releases.noReleases,
            toc: dict.releases.toc || "Table of Contents",
          }}
          delay={BLUR_FADE_DELAY * 2}
        />
      </section>
    </main>
  );
}
