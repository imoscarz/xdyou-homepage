"use client";

import Link from "next/link";

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
              <BlurFade key={contributor.name} delay={delay + 0.1 + index * 0.02}>
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
        <div className="flex h-full w-full cursor-pointer flex-col items-center space-y-2 rounded-lg border bg-card p-4 hover:bg-accent transition">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contributor.avatar} alt={contributor.name} />
            <AvatarFallback>
              {contributor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center w-full">
            <p className="text-sm font-medium truncate max-w-full">
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
              <img
                src={contributor.avatar}
                alt={contributor.name}
                className="w-24 h-24 rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <ul className="list-disc list-inside text-sm space-y-1">
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
              <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                {contributor.profile}
              </p>
            </>
          )}
          
          {/* 联系方式链接 */}
          {contributor.contacts && Array.isArray(contributor.contacts) ? (
            <Link
              href={contributor.contacts[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline text-sm inline-block"
            >
              主页链接
            </Link>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
