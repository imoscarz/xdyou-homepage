import { Fragment } from "react";

import ChapterGallery from "@/components/project/chapter-gallery-client";
import ChapterImage from "@/components/project/chapter-image-client";
import { homeChapters, homeLegacyAnchors } from "@/config/home-chapters";
import { screenshotScenes } from "@/config/screenshots";
import type { Locale } from "@/lib/i18n/config";
import { selectLocalizedText } from "@/lib/page-helpers";
import { cn } from "@/lib/utils";

type Dictionary = typeof import("@/lib/i18n/locales/zh.json");

export default function HomeChapters({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <>
      {homeChapters.map((chapter, index) => {
        const copy = dict.home.pages.chapters[chapter.id];
        const wide = chapter.layout === "wide";
        const text = (
          <div className={cn("chapter-copy", wide && "max-w-2xl")}>
            <p className="text-muted-foreground text-xs font-medium tracking-[0.16em]">
              <span aria-hidden="true">0{index + 1} / </span>
              {copy.label}
            </p>
            <h2
              id={`${chapter.id}-title`}
              className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {copy.title}
            </h2>
            <p className="text-muted-foreground max-w-lg text-base leading-8 sm:text-lg">
              {copy.description}
            </p>
            <ul className="space-y-3 text-sm leading-6">
              {copy.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-foreground/40 mt-2.5 size-1 shrink-0 rounded-full"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        );
        return (
          <Fragment key={chapter.id}>
            <span
              id={chapter.id}
              className="home-page-marker"
              aria-hidden="true"
            />
            {Object.entries(homeLegacyAnchors)
              .filter(([, target]) => target === chapter.id)
              .map(([id]) => (
                <span
                  key={id}
                  id={id}
                  className="home-page-marker"
                  aria-hidden="true"
                />
              ))}
            <section
              data-page={chapter.id}
              data-layout={chapter.layout}
              style={{ zIndex: index + 1 }}
              aria-labelledby={`${chapter.id}-title`}
              className="home-chapter border-border/60 border-t"
            >
              <div
                className={cn(
                  "chapter-layout grid w-full items-center",
                  wide
                    ? "grid-cols-1"
                    : "md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]",
                  chapter.layout === "phone" && "md:grid-cols-2",
                )}
              >
                <div className={cn(chapter.layout === "phone" && "md:order-2")}>
                  {text}
                </div>
                <div
                  className={cn(
                    "chapter-media min-w-0",
                    chapter.layout === "daily" &&
                      "flex flex-col items-center gap-6 sm:flex-row sm:items-start",
                    chapter.layout === "phone" && "md:order-1",
                  )}
                >
                  {"switchImages" in chapter ? (
                    <ChapterGallery
                      title={copy.label}
                      labels={dict.home.screenshots}
                      captures={chapter.images.map((capture) => {
                        const scene = screenshotScenes.find(
                          (scene) => scene.id === capture.scene,
                        )!;
                        const image = scene.images.find(
                          (image) => image.type === capture.type,
                        )!.image;
                        const title = selectLocalizedText(locale, scene.title);
                        return {
                          image,
                          type: capture.type,
                          alt: `${title} · ${dict.home.screenshots[capture.type]}`,
                          label: wide
                            ? dict.home.screenshots[capture.type]
                            : title,
                        };
                      })}
                    />
                  ) : (
                    chapter.images.map((capture, imageIndex) => {
                      const scene = screenshotScenes.find(
                        (scene) => scene.id === capture.scene,
                      )!;
                      const image = scene.images.find(
                        (image) => image.type === capture.type,
                      )!.image;
                      const alt = `${selectLocalizedText(locale, scene.title)} · ${dict.home.screenshots[capture.type]}`;
                      return (
                        <div
                          key={`${capture.scene}-${capture.type}`}
                          className={cn(
                            "chapter-capture",
                            capture.type === "mobile" &&
                              "mx-auto w-full max-w-[240px]",
                            chapter.layout === "daily" &&
                              "sm:min-w-0 sm:flex-1",
                            chapter.layout === "daily" &&
                              imageIndex === 1 &&
                              "sm:mt-14",
                          )}
                        >
                          <ChapterImage
                            image={image}
                            alt={alt}
                            labels={dict.home.screenshots}
                            sizes={
                              capture.type === "mobile"
                                ? "240px"
                                : "(max-width: 768px) 90vw, (max-width: 1280px) 80vw, 1000px"
                            }
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
          </Fragment>
        );
      })}
    </>
  );
}
