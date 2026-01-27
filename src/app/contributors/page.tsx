import Link from "next/link";

import { Icons } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { CustomReactMarkdown } from "@/components/react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { contributors } from "@/config/contributors";
import { BLUR_FADE_DELAY } from "@/data";
import {
  generateSimpleMetadata,
  getPageI18n,
  PAGE_CONTAINER_CLASSES,
  type PageProps,
} from "@/lib/page-helpers";

export async function generateMetadata({ searchParams }: PageProps) {
  return generateSimpleMetadata(
    searchParams,
    "contributors.title",
    "contributors.description",
  );
}

export default async function ContributorsPage({ searchParams }: PageProps) {
  const { dict } = await getPageI18n(searchParams);

  return (
    <main className={PAGE_CONTAINER_CLASSES.standard}>
      <PageHeader
        title={dict.contributors.title}
        description={dict.contributors.description}
      />

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
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <CustomReactMarkdown>
                        {contributor.profile}
                      </CustomReactMarkdown>
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
