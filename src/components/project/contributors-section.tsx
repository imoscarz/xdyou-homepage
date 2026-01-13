"use client";

import Link from "next/link";

import { CustomReactMarkdown } from "@/components/react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { contributors } from "@/config/contributors";
import { projectConfig } from "@/config/project";

type Contributor = (typeof contributors)[number];

interface ContributorsSectionProps {
  contributors: readonly Contributor[];
  delay?: number;
  dict: {
    badge: string;
    title: string;
    subtitle: string;
    viewProfile: string;
    viewDetails: string;
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
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="group flex flex-col items-center space-y-2 rounded-lg border bg-card p-4 transition-all hover:shadow-lg w-full"
                    >
                      <Avatar className="h-16 w-16 ring-2 ring-transparent transition-all group-hover:ring-primary">
                        <AvatarImage
                          src={contributor.avatar}
                          alt={contributor.name}
                        />
                        <AvatarFallback>
                          {contributor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center w-full">
                        <p className="text-sm font-medium truncate max-w-full">
                          {contributor.name}
                        </p>
                        {contributor.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {contributor.subtitle}
                          </p>
                        )}
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={contributor.avatar}
                            alt={contributor.name}
                          />
                          <AvatarFallback>
                            {contributor.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <DialogTitle>{contributor.name}</DialogTitle>
                          {contributor.subtitle && (
                            <DialogDescription>
                              {contributor.subtitle}
                            </DialogDescription>
                          )}
                        </div>
                      </div>
                    </DialogHeader>
                    {contributor.profile && (
                      <div className="prose prose-sm dark:prose-invert max-w-none mt-4">
                        <CustomReactMarkdown>
                          {contributor.profile}
                        </CustomReactMarkdown>
                      </div>
                    )}
                    {contributor.url && (
                      <div className="mt-4">
                        <Button asChild className="w-full">
                          <Link
                            href={contributor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {dict.viewProfile}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
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
