"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ChapterImage({
  image,
  alt,
  className,
  sizes,
  labels,
}: {
  image: StaticImageData;
  alt: string;
  className?: string;
  sizes: string;
  labels: { enlarge: string; close: string; imageError: string };
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={failed}
          aria-label={`${labels.enlarge}: ${alt}`}
          className={cn(
            "bg-muted/20 relative block w-full cursor-zoom-in overflow-hidden rounded-xl border shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4",
            className,
          )}
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          {failed ? (
            <span
              role="status"
              className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm"
            >
              {labels.imageError}
            </span>
          ) : (
            <Image
              src={image}
              alt={alt}
              sizes={sizes}
              className="h-auto w-full"
              onError={() => setFailed(true)}
            />
          )}
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-6xl sm:max-w-6xl"
        closeLabel={labels.close}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
        </DialogHeader>
        <div className="flex h-[75dvh] items-center justify-center">
          <Image
            src={image}
            alt={alt}
            sizes="90vw"
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
