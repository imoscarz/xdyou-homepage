"use client";

import type { StaticImageData } from "next/image";
import { useState, useSyncExternalStore } from "react";

import ChapterImage from "@/components/project/chapter-image-client";

const mobileQuery = "(max-width: 767px)";
function subscribe(callback: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function ChapterGallery({
  captures,
  labels,
  title,
}: {
  captures: {
    image: StaticImageData;
    alt: string;
    label: string;
    type: "mobile" | "desktop";
  }[];
  labels: { enlarge: string; close: string; imageError: string };
  title: string;
}) {
  const mobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(mobileQuery).matches,
    () => false,
  );
  const [selected, setSelected] = useState<number | null>(null);
  const index =
    selected ??
    (mobile
      ? Math.max(
          0,
          captures.findIndex((capture) => capture.type === "mobile"),
        )
      : 0);
  const capture = captures[index];

  return (
    <div className="chapter-gallery">
      <div className="chapter-gallery-stage">
        <div className="chapter-capture" data-format={capture.type}>
          <ChapterImage
            key={capture.alt}
            image={capture.image}
            alt={capture.alt}
            labels={labels}
            sizes={
              capture.type === "mobile"
                ? "280px"
                : "(max-width: 768px) 90vw, (max-width: 1280px) 80vw, 1000px"
            }
          />
        </div>
      </div>
      <div className="chapter-gallery-options" role="group" aria-label={title}>
        {captures.map((item, itemIndex) => (
          <button
            key={item.alt}
            type="button"
            aria-pressed={index === itemIndex}
            onClick={() => setSelected(itemIndex)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
