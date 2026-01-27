"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import type { contributors } from "@/config/contributors";

type Contributor = (typeof contributors)[number];

interface ContributorsSectionProps {
  contributors: readonly Contributor[];
  delay?: number;
  dict: {
    badge: string;
    title: string;
    viewAll: string;
  };
}

export default function ContributorsSection({
  contributors,
  delay = 0,
  dict,
}: ContributorsSectionProps) {
  if (contributors.length === 0) {
    return null;
  }

  return (
    <section id="contributors" className="py-12">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {contributors.map((contributor, index) => (
              <BlurFade
                key={contributor.name}
                delay={delay + 0.1 + index * 0.02}
              >
                <ContributorDialog contributor={contributor} />
              </BlurFade>
            ))}
          </div>
        </BlurFade>
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

function ContributorDialog({ contributor }: { contributor: Contributor }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-card hover:bg-accent flex h-full w-full cursor-pointer flex-col items-center space-y-2 rounded-lg border p-4 transition">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contributor.avatar} alt={contributor.name} />
            <AvatarFallback>
              {contributor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="w-full text-center">
            <p className="max-w-full truncate text-sm font-medium">
              {contributor.name}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{contributor.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 双栏布局：左侧avatar，右侧subtitle */}
          <div className="flex items-center gap-8">
            <div className="shrink-0">
              {/* 使用原生 img 标签，避免消耗 Vercel 图片优化限额 */}
              <img
                src={(function addSize(src: string) {
                  try {
                    const u = new URL(src);
                    if (u.hostname === "avatars.githubusercontent.com") {
                      if (!u.searchParams.has("s") && !u.searchParams.has("size")) {
                        u.searchParams.set("s", "96");
                      }
                      return u.toString();
                    }
                  } catch {
                    return src;
                  }
                  return src;
                })(contributor.avatar)}
                alt={contributor.name}
                className="h-24 w-24 rounded-full"
                loading="lazy"
              />
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
            <div className="flex items-center justify-center gap-4">
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
