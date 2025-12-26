import DownloadsSection from "@/components/project/downloads-section";
import FeaturesSection from "@/components/project/features-section";
import HeroSection from "@/components/project/hero-section";
import ScreenshotsSection from "@/components/project/screenshots-section";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  // Select data based on locale
  const isEnglish = locale === "en";
  const slogan = isEnglish
    ? projectConfig.slogan.en
    : projectConfig.slogan.zh;
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
    caption: isEnglish ? screenshot.caption.en : screenshot.caption.zh,
  }));

  // Prepare platforms
  const platforms = projectConfig.platforms;

  // Mock latest release data (will be replaced with real GitHub API data later)
  const latestRelease = {
    version: "v1.0.0",
    date: "2025-12-26",
    notes:
      "首次发布！\n\n新功能：\n- 课程表查询\n- 考试安排查询\n- 校园卡余额查询\n- 图书馆服务\n- 校园导航\n- 通知提醒",
    downloadUrl: projectConfig.repo.url + "/releases/latest",
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-16 px-6 py-8 pb-24 sm:space-y-20 sm:px-16 md:px-20 md:py-16 md:pt-14 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      {/* Hero Section */}
      <HeroSection
        projectName={projectConfig.fullName}
        slogan={slogan}
        description={description}
        logo={projectConfig.logo}
        primaryDownloadUrl={projectConfig.repo.url + "/releases/latest"}
        delay={BLUR_FADE_DELAY}
        dict={{
          downloadButton: dict.home.hero.downloadButton,
          moreDownloads: dict.home.hero.moreDownloads,
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
        }}
      />
    </main>
  );
}
