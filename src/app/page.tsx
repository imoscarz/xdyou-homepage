import dynamic from "next/dynamic";

import DownloadsSection from "@/components/project/downloads-section";
import HeroSection from "@/components/project/hero-section";
import HomeChapters from "@/components/project/home-chapters";
import HomeEffects from "@/components/project/home-effects-client";
import HomeToc from "@/components/project/home-toc-client";
import JoinSection from "@/components/project/join-section";
import { getContributors } from "@/config/contributors";
import { homeSections } from "@/config/home-chapters";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { fetchLatestRelease } from "@/lib/github";
import { renderMarkdownToHTML } from "@/lib/markdown-server";
import {
  getPageI18n,
  type PageProps,
  selectLocalizedText,
} from "@/lib/page-helpers";

// 懒加载非首屏组件
const ContributorsSectionDynamic = dynamic(
  () => import("@/components/project/contributors-section"),
  { ssr: true },
);

export default async function Page({ searchParams }: PageProps) {
  const { locale, dict } = await getPageI18n(searchParams);

  const tocItems = homeSections.map((id) => ({
    id,
    label:
      id === "hero"
        ? dict.home.pages.overview
        : id === "downloads"
          ? dict.home.downloads.badge
          : id === "join"
            ? dict.home.pages.join.label
            : id === "contributors"
              ? dict.home.contributors.badge
              : dict.home.pages.chapters[id].label,
  }));

  // Prepare platforms
  const platforms = [...projectConfig.platforms];

  // Fetch latest release from GitHub
  const release = await fetchLatestRelease(
    projectConfig.repo.owner,
    projectConfig.repo.name,
  );

  const latestRelease = release
    ? {
        version: release.tag_name,
        date: new Date(release.published_at).toLocaleDateString(locale),
        notes: release.body || dict.home.downloads.noReleaseNotes,
        notesHtml: await renderMarkdownToHTML(
          release.body || dict.home.downloads.noReleaseNotes,
        ),
        downloadUrl: release.html_url,
        assets: release.assets,
      }
    : undefined;

  const iosUrl =
    platforms.find((p) => p.id === "ios")?.downloadUrl || "#download-ios";

  return (
    <main className="home-pages mx-auto w-full max-w-[1440px] px-6 pt-16 pb-24 md:px-12 md:pt-24 xl:px-16">
      {/* Hero spans the full width; only subsequent chapters reserve a TOC column. */}
      <HeroSection
        projectName={projectConfig.fullName}
        slogan={selectLocalizedText(locale, projectConfig.slogan)}
        description={selectLocalizedText(locale, projectConfig.description)}
        logo={projectConfig.logo}
        assets={
          release?.assets.map(({ name, browser_download_url }) => ({
            name,
            browser_download_url,
          })) || []
        }
        iosUrl={iosUrl}
        githubUrl={projectConfig.repo.url}
        delay={BLUR_FADE_DELAY}
        dict={{
          downloadButton: dict.home.hero.downloadButton,
          moreDownloads: dict.home.hero.moreDownloads,
          viewOnGithub: dict.home.hero.viewOnGithub,
        }}
      />

      <div className="grid grid-cols-1 gap-x-12 xl:grid-cols-[minmax(0,1fr)_144px]">
        <div className="min-w-0">
          <HomeChapters locale={locale} dict={dict} />

          {/* Downloads Section */}
          <DownloadsSection
            platforms={platforms}
            latestRelease={latestRelease}
            dict={{
              badge: dict.home.downloads.badge,
              title: dict.home.downloads.title,
              latestVersion: dict.home.downloads.latestVersion,
              thirdParty: dict.home.downloads.thirdParty,
              ohosNotice: dict.home.downloads.ohosNotice,
              appGallery: dict.home.downloads.appGallery,
              releaseNotes: dict.home.downloads.releaseNotes,
              downloadFor: dict.home.downloads.downloadFor,
              comingSoon: dict.home.downloads.comingSoon,
              unavailable: dict.home.downloads.unavailable,
              maintenanceLabel: dict.home.downloads.maintenanceLabel,
              maintenanceNotice: dict.home.downloads.maintenanceNotice,
            }}
          />

          <JoinSection copy={dict.home.pages.join} locale={locale} />
          {/* Contributors Section */}
          <ContributorsSectionDynamic
            contributors={getContributors(locale)}
            dict={{
              badge: dict.home.contributors.badge,
              title: dict.home.contributors.title,
              description: dict.home.contributors.description,
              close: dict.home.screenshots.close,
            }}
          />
        </div>
        <HomeToc items={tocItems} label={dict.home.pages.toc} />
      </div>
      <HomeEffects />
    </main>
  );
}
