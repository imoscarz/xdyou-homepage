"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { projectConfig } from "@/config/project";
import type { GitHubContributor } from "@/lib/contributors";

interface ContributorsSectionProps {
  contributors: GitHubContributor[];
  delay?: number;
  dict: {
    badge: string;
    title: string;
    contributions: string;
    viewProfile: string;
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
              <BlurFade key={contributor.id} delay={delay + 0.1 + index * 0.02}>
                <a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center space-y-2 rounded-lg border bg-card p-4 transition-all hover:shadow-lg"
                  title={`${dict.viewProfile}: ${contributor.login}`}
                >
                  <Avatar className="h-16 w-16 ring-2 ring-transparent transition-all group-hover:ring-primary">
                    <AvatarImage
                      src={contributor.avatar_url}
                      alt={contributor.login}
                    />
                    <AvatarFallback>
                      {contributor.login.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-full">
                      {contributor.login}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contributor.contributions} {dict.contributions}
                    </p>
                  </div>
                </a>
              </BlurFade>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={delay + 0.2}>
          <div className="text-center">
            <Link
              href={`${projectConfig.repo.url}/graphs/contributors`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {dict.viewAll}
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
