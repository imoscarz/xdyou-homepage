import { ScreenshotsCarousel } from "./screenshots-section-client";

type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  type: "desktop" | "mobile";
};

type ScreenshotsSectionProps = {
  screenshots: Screenshot[];
  delay?: number;
  dict: {
    title: string;
    badge: string;
  };
};

/**
 * 截图展示区块（优化版 - Server Component）
 *
 * 优化策略：
 * - 拆分为 Server Component（标题+布局） + Client Component（轮播交互）
 * - 移除：自动播放、全屏模式、触摸手势、复杂分组、设备检测、BlurFade 动画
 * - 保留：基础左右导航、指示器
 * - 目标：减少 5-8 KB JS，改善 LCP 和 INP
 */
export default function ScreenshotsSection({
  screenshots,
  dict,
}: ScreenshotsSectionProps) {
  if (screenshots.length === 0) {
    return null;
  }

  return (
    <section id="screenshots" className="py-12">
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

        <ScreenshotsCarousel screenshots={screenshots} />
      </div>
    </section>
  );
}
