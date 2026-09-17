"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { Icons } from "@/components/icons";
import SectionHeading from "@/components/project/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Contributor } from "@/config/contributors";
import {
  type BubblePosition,
  scatterContributors,
} from "@/lib/contributor-layout";

interface ContributorsSectionProps {
  contributors: readonly Contributor[];
  dict: {
    badge: string;
    title: string;
    description: string;
    close: string;
  };
}

export default function ContributorsSection({
  contributors,
  dict,
}: ContributorsSectionProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<BubblePosition[]>([]);
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setPositions(scatterContributors(contributors.length, width, height));
    });
    observer.observe(field);
    return () => observer.disconnect();
  }, [contributors.length]);
  if (!contributors.length) return null;
  return (
    <section
      id="contributors"
      className="home-contributors"
      aria-labelledby="contributors-title"
    >
      <SectionHeading
        id="contributors-title"
        label={dict.badge}
        title={dict.title}
        description={dict.description}
      />
      <div
        className="contributor-field"
        ref={fieldRef}
        data-ready={positions.length > 0}
      >
        {contributors.map((contributor, index) => (
          <div
            key={contributor.id}
            className="contributor-bubble"
            style={
              {
                "--float-time": `${4 + (index % 4)}s`,
                "--float-delay": `${-(index % 7)}s`,
                left: positions[index]?.x ?? 0,
                top: positions[index]?.y ?? 0,
                "--bubble-size": `${positions[index]?.size ?? 40}px`,
                "--float-x": `${index % 2 ? 4 : -4}px`,
              } as CSSProperties
            }
          >
            <ContributorDialog
              contributor={contributor}
              closeLabel={dict.close}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

function ContributorDialog({
  contributor,
  closeLabel,
}: {
  contributor: Contributor;
  closeLabel: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={contributor.name}
          className="bubble-trigger flex w-full cursor-pointer flex-col items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Avatar className="bubble-avatar">
            <AvatarImage
              src={contributor.avatar}
              alt={contributor.name}
              loading="lazy"
            />
            <AvatarFallback>
              {contributor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="bubble-name text-center">
            <p className="max-w-full truncate text-sm font-medium">
              {contributor.name}
            </p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg"
        closeLabel={closeLabel}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{contributor.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 双栏布局：左侧avatar，右侧subtitle */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="shrink-0">
              <Avatar className="size-16 sm:size-24">
                <AvatarImage src={contributor.avatar} alt={contributor.name} />
                <AvatarFallback>{contributor.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 flex-1">
              <ul className="list-inside list-disc space-y-1 text-sm">
                {Array.isArray(contributor.subtitle) &&
                  contributor.subtitle.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Profile */}
          {contributor.profile && (
            <>
              <Separator />
              <p className="text-muted-foreground text-sm break-words whitespace-pre-wrap">
                {contributor.profile}
              </p>
            </>
          )}

          {/* 主页 / 链接（图标 + 文本，居中） */}
          {contributor.links &&
          Array.isArray(contributor.links) &&
          contributor.links.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {contributor.links.map(
                (
                  link: { icon: string; text?: string; url: string },
                  idx: number,
                ) => {
                  const IconComponent = Icons[link.icon as keyof typeof Icons];
                  return (
                    <Link
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.text ?? link.icon}
                      className="text-primary flex items-center gap-2 text-sm hover:underline"
                    >
                      {IconComponent ? (
                        <IconComponent className="h-5 w-5" />
                      ) : (
                        <Icons.externalLink className="h-5 w-5" />
                      )}
                      <span>{link.text ?? link.icon}</span>
                    </Link>
                  );
                },
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
