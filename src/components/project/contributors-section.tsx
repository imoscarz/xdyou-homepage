"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
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
                <div className="flex h-full flex-col items-center space-y-2 rounded-lg border bg-card p-4">
                  <Avatar className="h-16 w-16">
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
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {Array.isArray(contributor.subtitle) ? (
                          contributor.subtitle.map((line, idx) => (
                            <p key={idx} className="truncate">{line}</p>
                          ))
                        ) : (
                          <p className="truncate">{contributor.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Contact Links - Always reserve space */}
                  <div className="flex gap-1 pt-1 min-h-[28px]">
                    {contributor.contacts && contributor.contacts.map((contact, idx) => {
                      const IconComponent = Icons[contact.icon as keyof typeof Icons];
                      return IconComponent ? (
                        <Button
                          key={idx}
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Link
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={contact.icon}
                          >
                            <IconComponent className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      ) : null;
                    })}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={delay + 0.2}>
          <div className="text-center">
            <Link
              href="/contributors"
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
