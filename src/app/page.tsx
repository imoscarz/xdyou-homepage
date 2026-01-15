import ContributorsSection from "@/components/project/contributors-section";
import DownloadsSection from "@/components/project/downloads-section";
import FeaturesSection from "@/components/project/features-section";
import HeroSection from "@/components/project/hero-section";
import ScreenshotsSection from "@/components/project/screenshots-section";
import { contributors } from "@/config/contributors";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { fetchLatestRelease } from "@/lib/github";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  // Select data based on locale
  const isEnglish = locale === "en";
  const slogan = isEnglish ? projectConfig.slogan.en : projectConfig.slogan.zh;
  const description = isEnglish
    ? projectConfig.description.en
    : projectConfig.description.zh;

  // Prepare features with localized text
  const features = projectConfig.features.map((feature) => ({
    icon: feature.icon,
    title: isEnglish ? feature.title.en : feature.title.zh,
    description: isEnglish ? feature.description.en : feature.description.zh,
  }));

  // Prepare screenshots with localized captions
  const screenshots = projectConfig.screenshots.map((screenshot) => ({
    src: screenshot.src,
    alt: screenshot.alt,
    type: screenshot.type,
    caption: isEnglish ? screenshot.caption.en : screenshot.caption.zh,
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

  // Find platform-specific download URLs
  const androidAsset = release?.assets.find((a) =>
    a.name.includes("arm64-v8a-release.apk"),
  );
  const iosUrl = platforms.find((p) => p.id === "ios")?.downloadUrl || "#";
  const windowsAsset = release?.assets.find((a) =>
    a.name.includes("windows-release-amd64.zip"),
  );
  const linuxAsset = release?.assets.find((a) =>
    a.name.includes("linux-release-amd64.zip"),
  );

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-16 px-6 py-8 pb-24 sm:space-y-20 sm:px-16 md:px-20 md:py-16 md:pt-14 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      {/* Hero Section */}
      <HeroSection
        projectName={projectConfig.fullName}
        slogan={slogan}
        description={description}
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
        delay={BLUR_FADE_DELAY * 5}
        dict={{
          badge: dict.home.features.badge,
          title: dict.home.features.title,
        }}
      />

      {/* Screenshots Section */}
      <ScreenshotsSection
        screenshots={screenshots}
        delay={BLUR_FADE_DELAY * 10}
        dict={{
          badge: dict.home.screenshots.badge,
          title: dict.home.screenshots.title,
        }}
      />

      {/* Downloads Section */}
      <DownloadsSection
        platforms={platforms}
        latestRelease={latestRelease}
        delay={BLUR_FADE_DELAY * 15}
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
        delay={BLUR_FADE_DELAY * 17}
        dict={{
          badge: dict.home.contributors.badge,
          title: dict.home.contributors.title,
          viewAll: dict.home.contributors.viewAll,
        }}
      />
    </main>
  );
}
