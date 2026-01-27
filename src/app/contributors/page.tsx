import { Metadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { contributors } from "@/config/contributors";
import { BLUR_FADE_DELAY } from "@/data";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  return {
    title: dict.contributors.title,
    description: dict.contributors.description,
  };
}

export default async function ContributorsPage({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      {/* Header */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {dict.contributors.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dict.contributors.description}
            </p>
          </div>
        </BlurFade>
      </section>

      {/* Contributors Grid - Masonry Layout */}
      <section className="columns-1 gap-6 space-y-6 md:columns-2">
        {contributors.map((contributor, index) => (
          <BlurFade key={contributor.name} delay={BLUR_FADE_DELAY * 2 + index * 0.05}>
            <Card className="break-inside-avoid mb-6">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 shrink-0">
                    <AvatarImage
                      src={contributor.avatar}
                      alt={contributor.name}
                    />
                    <AvatarFallback>
                      {contributor.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <CardTitle className="text-2xl">{contributor.name}</CardTitle>
                    {contributor.subtitle && (
                      <div className="text-base text-muted-foreground space-y-0.5">
                        {Array.isArray(contributor.subtitle) ? (
                          contributor.subtitle.map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))
                        ) : (
                          <p>{contributor.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Links - Right Side */}
                  {contributor.links && contributor.links.length > 0 && (
                    <div className="flex gap-1 shrink-0">
                      {contributor.links.map((contact: { icon: string; text?: string; url: string }) => {
                        const IconComponent = Icons[contact.icon as keyof typeof Icons];
                        return (
                        <Button
                          key={contact.icon}
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Link
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={contact.text ?? contact.icon}
                          >
                            {IconComponent ? (
                              <IconComponent className="h-4 w-4" />
                            ) : (
                              <Icons.externalLink className="h-4 w-4" />
                            )}
                          </Link>
                        </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardHeader>
              {contributor.profile && (
                <>
                  <Separator />
                  <CardContent className="pt-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                      {contributor.profile}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </BlurFade>
        ))}
      </section>
    </main>
  );
}
