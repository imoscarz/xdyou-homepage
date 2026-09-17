import Link from "next/link";

import { Icons } from "@/components/icons";
import SectionHeading from "@/components/project/section-heading";
import { Button } from "@/components/ui/button";
import { projectConfig } from "@/config/project";
import type { Locale } from "@/lib/i18n/config";

type JoinCopy = typeof import("@/lib/i18n/locales/zh.json").home.pages.join;

export default function JoinSection({
  copy,
  locale,
}: {
  copy: JoinCopy;
  locale: Locale;
}) {
  const guide = `/docs/dev?lang=${locale}`;
  const destinations = [
    projectConfig.repo.url,
    guide,
    `${projectConfig.repo.url}/issues`,
  ];
  return (
    <section id="join" className="home-join" aria-labelledby="join-title">
      <div
        data-home-reveal
        className="grid w-full items-center gap-10 md:grid-cols-2 lg:gap-14"
      >
        <div className="space-y-6">
          <SectionHeading
            id="join-title"
            label={copy.label}
            title={copy.title}
            description={copy.description}
          />
          <p className="text-muted-foreground text-sm leading-7 sm:text-base">
            {copy.invitation}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={guide}>{copy.guide}</Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={projectConfig.repo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.github}
                <Icons.externalLink className="size-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="surface-card p-6 sm:p-8">
          <h3 className="mb-3 text-base font-medium">{copy.panelTitle}</h3>
          <ol className="divide-border divide-y">
            {copy.ways.map((way, index) => (
              <li key={way.title}>
                <Link
                  href={destinations[index]}
                  target={index === 1 ? undefined : "_blank"}
                  rel={index === 1 ? undefined : "noopener noreferrer"}
                  className="group hover:bg-muted/60 -mx-2 flex items-start gap-3 rounded-lg px-2 py-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground pt-1 text-xs tabular-nums"
                  >
                    0{index + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium">{way.title}</p>
                    <p className="text-muted-foreground text-sm leading-6">
                      {way.description}
                    </p>
                  </div>
                  <Icons.chevronright className="text-muted-foreground mt-1 size-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
