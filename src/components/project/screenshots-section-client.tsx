"use client";

import Image from "next/image";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

type Screenshot = {
  src: string;
  alt: string;
  caption: string;
  type: "desktop" | "mobile";
};

type ScreenshotsCarouselProps = {
  screenshots: Screenshot[];
};

/**
 * 轻量级截图轮播组件（仅客户端交互部分）
 * 
 * 移除了：自动播放、全屏模式、触摸手势、设备检测、复杂分组逻辑
 * 保留了：基础导航（左右切换）、指示器
 */
export function ScreenshotsCarousel({ screenshots }: ScreenshotsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (screenshots.length === 0) return null;

  const current = screenshots[currentIndex];
  const isDesktop = current.type === "desktop";

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-border bg-card">
      {/* 图片展示区 */}
      <div className="bg-muted/30 relative flex min-h-[400px] w-full items-center justify-center p-8 md:min-h-[600px]">
        {isDesktop ? (
          // 桌面截图：16:9 宽屏展示
          <div className="relative aspect-video w-full max-w-4xl">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="rounded-lg object-cover shadow-lg"
              priority={currentIndex === 0}
              loading={currentIndex === 0 ? undefined : "lazy"}
            />
          </div>
        ) : (
          // 移动截图：手机比例展示
          <div className="relative aspect-[9/19.5] w-[280px]">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="rounded-lg object-contain shadow-lg"
              priority={currentIndex === 0}
              loading={currentIndex === 0 ? undefined : "lazy"}
            />
          </div>
        )}
      </div>

      {/* 导航栏 */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          aria-label="上一张截图"
          disabled={screenshots.length <= 1}
        >
          <Icons.chevronleft className="size-4" />
        </Button>

        <div className="text-center">
          <p className="text-sm font-medium">{current.caption}</p>
          <p className="text-muted-foreground text-xs">
            {currentIndex + 1} / {screenshots.length}
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          aria-label="下一张截图"
          disabled={screenshots.length <= 1}
        >
          <Icons.chevronright className="size-4" />
        </Button>
      </div>

      {/* 指示器 */}
      {screenshots.length > 1 && (
        <div className="flex justify-center gap-2 pb-4">
          {screenshots.map((_, idx) => (
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
    </div>
  );
}
