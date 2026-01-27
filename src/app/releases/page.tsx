import { PageHeader } from "@/components/layout/page-header";
import ReleasesClient from "@/components/project/releases-client";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { fetchGitHubReleases } from "@/lib/github";
import {
  generateSimpleMetadata,
  getPageI18n,
  PAGE_CONTAINER_CLASSES,
  type PageProps,
} from "@/lib/page-helpers";

export async function generateMetadata({ searchParams }: PageProps) {
  return generateSimpleMetadata(
    searchParams,
    "releases.title",
    "releases.description",
  );
}

export default async function ReleasesPage({ searchParams }: PageProps) {
  const { dict } = await getPageI18n(searchParams);

  // Fetch releases from GitHub
  const releases = await fetchGitHubReleases(
    projectConfig.repo.owner,
    projectConfig.repo.name,
    10 // Fetch 10 releases initially
  );

  return (
    <main className={PAGE_CONTAINER_CLASSES.standard}>
      <PageHeader
        title={dict.releases.title}
        description={dict.releases.description}
      />

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
            checksum: dict.releases.checksum,
            loadMore: dict.releases.loadMore,
            noReleases: dict.releases.noReleases,
            toc: dict.releases.toc || "Table of Contents",
            windowsMaintenanceWarning: dict.releases.windowsMaintenanceWarning,
          }}
          delay={BLUR_FADE_DELAY * 2}
        />
      </section>
    </main>
  );
}
