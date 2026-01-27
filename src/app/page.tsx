import dynamic from "next/dynamic";

import FeaturesSection from "@/components/project/features-section";
import HeroSection from "@/components/project/hero-section";
import { contributors } from "@/config/contributors";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { fetchLatestRelease } from "@/lib/github";
import {
  getPageI18n,
  PAGE_CONTAINER_CLASSES,
  type PageProps,
  selectLocalizedText,
} from "@/lib/page-helpers";

// 懒加载非首屏组件
const ScreenshotsSection = dynamic(
  () => import("@/components/project/screenshots-section"),
  { ssr: true } // 保留 SSR 以支持 SEO
);
const DownloadsSection = dynamic(
  () => import("@/components/project/downloads-section"),
  { ssr: true }
);
const ContributorsSection = dynamic(
  () => import("@/components/project/contributors-section"),
  { ssr: true }
);

export default async function Page({ searchParams }: PageProps) {
  const { locale, dict } = await getPageI18n(searchParams);

  // Prepare features with localized text
  const features = projectConfig.features.map((feature) => ({
    icon: feature.icon,
    title: selectLocalizedText(locale, feature.title),
    description: selectLocalizedText(locale, feature.description),
  }));

  // Prepare screenshots with localized captions
  const screenshots = projectConfig.screenshots.map((screenshot) => ({
    src: screenshot.src,
    alt: screenshot.alt,
    type: screenshot.type,
    caption: selectLocalizedText(locale, screenshot.caption),
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
        notes: release.body || "No release notes available.",
        downloadUrl: release.html_url,
        assets: release.assets,
      }
    : undefined;

  // Find platform-specific download URLs using configured patterns
  const androidAsset = release?.assets.find((a) =>
    projectConfig.assetPatterns.android[0].pattern.test(a.name),
  );
  const iosUrl = platforms.find((p) => p.id === "ios")?.downloadUrl || "#";
  const windowsAsset = release?.assets.find((a) =>
    projectConfig.assetPatterns.windows[0].pattern.test(a.name),
  );
  const linuxAsset = release?.assets.find((a) =>
    projectConfig.assetPatterns.linux[0].pattern.test(a.name),
  );

  return (
    <main className={PAGE_CONTAINER_CLASSES.home}>
      {/* Hero Section */}
      <HeroSection
        projectName={projectConfig.fullName}
        slogan={selectLocalizedText(locale, projectConfig.slogan)}
        description={selectLocalizedText(locale, projectConfig.description)}
        logo={projectConfig.logo}
        androidUrl={
          androidAsset?.browser_download_url ||
          projectConfig.repo.url + "/releases/latest"
        }
        iosUrl={iosUrl}
        windowsUrl={
          windowsAsset?.browser_download_url ||
          projectConfig.repo.url + "/releases/latest"
        }
        linuxUrl={
          linuxAsset?.browser_download_url ||
          projectConfig.repo.url + "/releases/latest"
        }
        githubUrl={projectConfig.repo.url}
        delay={BLUR_FADE_DELAY}
        dict={{
          downloadButton: dict.home.hero.downloadButton,
          moreDownloads: dict.home.hero.moreDownloads,
          viewOnGithub: dict.home.hero.viewOnGithub,
        }}
      />

      {/* Features Section */}
      <FeaturesSection
        features={features}
        dict={{
          badge: dict.home.features.badge,
          title: dict.home.features.title,
        }}
      />

      {/* Screenshots Section */}
      <ScreenshotsSection
        screenshots={screenshots}
        dict={{
          badge: dict.home.screenshots.badge,
          title: dict.home.screenshots.title,
        }}
      />

      {/* Downloads Section */}
      <DownloadsSection
        platforms={platforms}
        latestRelease={latestRelease}
        dict={{
          badge: dict.home.downloads.badge,
          title: dict.home.downloads.title,
          latestVersion: dict.home.downloads.latestVersion,
          releaseNotes: dict.home.downloads.releaseNotes,
          downloadFor: dict.home.downloads.downloadFor,
          comingSoon: dict.home.downloads.comingSoon,
          unavailable: dict.home.downloads.unavailable,
          windowsMaintenanceWarning:
            dict.home.downloads.windowsMaintenanceWarning,
        }}
      />

      {/* Contributors Section */}
      <ContributorsSection
        contributors={contributors}
        dict={{
          badge: dict.home.contributors.badge,
          title: dict.home.contributors.title,
          viewAll: dict.home.contributors.viewAll,
        }}
      />
    </main>
  );
}
