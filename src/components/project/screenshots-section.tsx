"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Screenshot = {
  src: string;
  alt: string;
  caption: string;
};

type ScreenshotsSectionProps = {
  screenshots: Screenshot[];
  delay?: number;
  dict: {
    title: string;
    badge: string;
  };
};

export default function ScreenshotsSection({
  screenshots,
  delay = 0,
  dict,
}: ScreenshotsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

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
          <Card className="mx-auto max-w-4xl overflow-hidden">
            <div className="relative aspect-video w-full">
              <Image
                src={screenshots[currentIndex].src}
                alt={screenshots[currentIndex].alt}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="size-4" />
              </Button>

              <div className="text-center">
                <p className="text-sm font-medium">
                  {screenshots[currentIndex].caption}
                </p>
                <p className="text-muted-foreground text-xs">
                  {currentIndex + 1} / {screenshots.length}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                aria-label="Next screenshot"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {/* Dots indicator */}
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
                  aria-label={`Go to screenshot ${idx + 1}`}
                />
              ))}
            </div>
          </Card>
        </BlurFade>
      </div>
    </section>
  );
}
