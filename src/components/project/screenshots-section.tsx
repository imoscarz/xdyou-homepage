"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
 * 截图展示区块
 *
 * 特性：
 * - 移动端设备：仅展示 mobile 类型截图，单张展示，手机屏幕尺寸
 * - 桌面端设备：展示所有截图，mobile 类型 2 张一组，desktop 类型 1 张一组
 * - 自动播放：可设置间隔自动切换截图
 * - 全屏查看：点击截图进入全屏查看模式
 */

export default function ScreenshotsSection({
  screenshots,
  delay = 0,
  dict,
}: ScreenshotsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"next" | "prev" | "">("");
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 触摸滑动支持
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // 检测设备类型
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 根据设备类型过滤和分组截图
  const screenshotGroups = useMemo(() => {
    if (isMobile) {
      // 移动端：只显示 mobile 类型，单张一组
      const mobileScreenshots = screenshots.filter((s) => s.type === "mobile");
      return mobileScreenshots.map((s) => [s]);
    } else {
      // 桌面端：所有截图，mobile 类型 2 张一组，desktop 类型 1 张一组
      const groups: Screenshot[][] = [];
      let i = 0;
      while (i < screenshots.length) {
        const current = screenshots[i];
        if (current.type === "mobile") {
          // mobile 类型：尝试取 2 张
          const nextIndex = i + 1;
          if (
            nextIndex < screenshots.length &&
            screenshots[nextIndex].type === "mobile"
          ) {
            groups.push([current, screenshots[nextIndex]]);
            i += 2;
          } else {
            groups.push([current]);
            i += 1;
          }
        } else {
          // desktop 类型：单张一组
          groups.push([current]);
          i += 1;
        }
      }
      return groups;
    }
  }, [screenshots, isMobile]);

  const totalSlides = screenshotGroups.length;

  // 预加载当前/前一张/后一张的图片以避免切换白屏
  useEffect(() => {
    if (typeof window === "undefined" || totalSlides === 0) return;

    const loaded = new Set<string>();
    const preloadGroup = (index: number) => {
      if (index < 0 || index >= totalSlides) return;
      screenshotGroups[index]?.forEach(({ src }) => {
        if (loaded.has(src)) return;
        const img = new window.Image();
        img.src = src;
        loaded.add(src);
      });
    };

    preloadGroup(currentIndex);
    preloadGroup((currentIndex + 1) % totalSlides);
    preloadGroup((currentIndex - 1 + totalSlides) % totalSlides);
  }, [currentIndex, screenshotGroups, totalSlides]);

  // 自动播放效果
  useEffect(() => {
    if (!isAutoPlay || isFullscreen || totalSlides <= 1) return;

    autoPlayTimerRef.current = setInterval(() => {
      setTransitionDirection("next");
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 4000); // 每 4 秒切换一次

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, isFullscreen, totalSlides]);

  // 计算容器最大可能高度
  // Desktop 单张：max-w-4xl (896px) * aspect-video = ~504px
  // Mobile 双张：280px * aspect-[9/19.5] = ~609px
  const containerHeight = useMemo(() => {
    if (isMobile) return "h-auto"; // 移动端自适应
    // 桌面端使用足够大的高度容纳两种布局
    return "h-[650px]";
  }, [isMobile]);

  const goToPrevious = () => {
    setTransitionDirection("prev");
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setTransitionDirection("next");
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // 触摸滑动处理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // 最小滑动距离
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // 左滑 - 下一张
        goToNext();
      } else {
        // 右滑 - 上一张
        goToPrevious();
      }
    }
    
    // 重置
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (screenshotGroups.length === 0) {
    return null;
  }

  const currentGroup = screenshotGroups[currentIndex];
  const isDesktopGroup = !isMobile && currentGroup[0].type === "desktop";
  const isMobileGroup = currentGroup[0].type === "mobile";
  const fullscreenAnimationClass = transitionDirection === "prev"
    ? "animate-slide-right"
    : transitionDirection === "next"
      ? "animate-slide-left"
      : "animate-slide-fade";

  return (
    <section id="screenshots" className="py-12">
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

        <BlurFade delay={delay + 0.1}>
          <Card className="mx-auto w-full max-w-6xl overflow-hidden">
            <div key={currentIndex} className="animate-slide-fade">
              {/* 移动端：单张移动端截图 */}
              {isMobile && (
                <div className="bg-muted/30 relative flex w-full items-center justify-center py-8">
                  <div className="relative aspect-[9/19.5] w-[280px]">
                    <Image
                      src={currentGroup[0].src}
                      alt={currentGroup[0].alt}
                      fill
                      className="rounded-lg object-contain shadow-lg"
                      priority={currentIndex === 0}
                    />
                  </div>
                </div>
              )}

              {/* 桌面端：根据类型展示 */}
              {!isMobile && (
                <div
                  className={`bg-muted/30 relative w-full p-8 ${containerHeight} flex items-center justify-center`}
                >
                  {/* Desktop 类型：单张展示 */}
                  {isDesktopGroup && (
                    <div className="w-full max-w-4xl">
                      <div className="relative aspect-video w-full">
                        <Image
                          src={currentGroup[0].src}
                          alt={currentGroup[0].alt}
                          fill
                          className="rounded-lg object-cover shadow-lg"
                          priority={currentIndex === 0}
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile 类型：1-2张并排展示 */}
                  {isMobileGroup && (
                    <div
                      className={`flex items-center justify-center gap-6 ${currentGroup.length === 1 ? "max-w-md" : ""}`}
                    >
                      {currentGroup.map((screenshot, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-[9/19.5] w-[280px]"
                        >
                          <Image
                            src={screenshot.src}
                            alt={screenshot.alt}
                            fill
                            className="rounded-lg object-contain shadow-lg"
                            priority={currentIndex === 0 && idx === 0}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  aria-label="上一张截图"
                  disabled={totalSlides <= 1}
                >
                  <Icons.chevronleft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  aria-label={isAutoPlay ? "暂停自动播放" : "开始自动播放"}
                  className={isAutoPlay ? "bg-primary/20" : ""}
                >
                  {isAutoPlay ? (
                    <Icons.pause className="size-4" />
                  ) : (
                    <Icons.play className="size-4" />
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">
                  {currentGroup.map((s) => s.caption).join(" / ")}
                </p>
                <p className="text-muted-foreground text-xs">
                  {currentIndex + 1} / {totalSlides}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setTransitionDirection("");
                    setIsFullscreen(true);
                  }}
                  aria-label="全屏查看"
                >
                  <Icons.maximize2 className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  aria-label="下一张截图"
                  disabled={totalSlides <= 1}
                >
                  <Icons.chevronright className="size-4" />
                </Button>
              </div>
            </div>

            {/* Dots indicator */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 pb-4">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-primary w-4"
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                    aria-label={`切换到第 ${idx + 1} 张截图`}
                  />
                ))}
              </div>
            )}
          </Card>
        </BlurFade>

        {/* 全屏查看模式 */}
        {isFullscreen && (
          <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTransitionDirection("");
                  setIsFullscreen(false);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTransitionDirection("");
                  setIsFullscreen(false);
                }}
                aria-label="关闭全屏"
                className="text-white hover:bg-white/20 active:bg-white/30 touch-none"
              >
                <Icons.x className="size-6" />
              </Button>
            </div>

            <div
              key={currentIndex}
              className={`relative flex h-full w-full max-w-6xl items-center justify-center ${fullscreenAnimationClass}`}
            >
              {isMobile && currentGroup[0].type === "mobile" && (
                <div className="relative aspect-[9/19.5] w-[280px]">
                  <Image
                    src={currentGroup[0].src}
                    alt={currentGroup[0].alt}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}

              {!isMobile && currentGroup[0].type === "desktop" && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={currentGroup[0].src}
                    alt={currentGroup[0].alt}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}

              {!isMobile && currentGroup[0].type === "mobile" && (
                <div className="flex items-center justify-center gap-8">
                  {currentGroup.map((screenshot, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[9/19.5] w-[320px]"
                    >
                      <Image
                        src={screenshot.src}
                        alt={screenshot.alt}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 全屏模式导航 */}
            <div className="absolute right-0 bottom-0 left-0 flex items-center justify-center p-4">
              <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 shadow-lg backdrop-blur-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  aria-label="上一张截图"
                  className="size-10 rounded-full text-white hover:bg-white/20"
                >
                  <Icons.chevronleft className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  aria-label="下一张截图"
                  className="size-10 rounded-full text-white hover:bg-white/20"
                >
                  <Icons.chevronright className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
