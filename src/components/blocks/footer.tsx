"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { DATA } from "@/data";
import { useLocale } from "@/lib/i18n";

type Dictionary = {
  nav: {
    about: string;
    projects: string;
    education: string;
    skills: string;
  };
  footer: {
    sections: {
      quickNavigation: string;
      connect: string;
      resources: string;
      discover: string;
    };
    resources: {
      blog: string;
    };
    legal: {
      allRightsReserved: string;
      privacyPolicy: string;
      termsDisclaimer: string;
    };
    bottom: {
      lastUpdated: string;
      madeWith: string;
      buildWith: string;
    };
  };
};

export default function Footer() {
  const currentLocale = useLocale();
  const currentYear = new Date().getFullYear();
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const module = await import(`@/lib/i18n/locales/${currentLocale}.json`);
      setDict(module.default);
    };
    loadDictionary();
  }, [currentLocale]);

  if (!dict) {
    return null; // or a loading skeleton
  }

  const t = dict;

  // Create navigation sections with translations
  const translatedNavigationSections = [
    { name: t.nav.about, href: "#about" },
    { name: t.nav.projects, href: "#projects" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.education, href: "#education" },
  ];

  return (
    <footer className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-12 pb-20 sm:px-16 md:px-20 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.footer.sections.quickNavigation}
            </h3>
            <nav className="space-y-2">
              {translatedNavigationSections.map((section) => (
                <Link
                  key={section.name}
                  href={section.href}
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {section.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.footer.sections.connect}
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.values(DATA.contact.social)
                .filter((social) => social.footer)
                .map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
            </div>
          </div>

          {/* Blog */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.footer.sections.resources}
            </h3>
            <nav className="space-y-2">
              {DATA.footerResources.map((resource) => (
                <Link
                  key={resource.name}
                  href={resource.href}
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {t.footer.resources[resource.name as keyof typeof t.footer.resources]}
                </Link>
              ))}
            </nav>
          </div>

          {/* Discover */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider">
              {t.footer.sections.discover}
            </h3>
            <nav className="space-y-2">
              {DATA.discover.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* Copyright and Legal Links - Desktop: same line, Mobile: separate lines */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>
                © {currentYear} {currentLocale === "en" ? DATA.name : DATA.chinese.name}
              </span>
              <span>•</span>
              <span>{t.footer.legal.allRightsReserved}</span>
            </div>
          </div>

          {/* Last Updated and Made with - Desktop: same line, Mobile: separate lines */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground text-sm">
              {t.footer.bottom.lastUpdated}: {DATA.lastUpdated}
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>{t.footer.bottom.madeWith}</span>
              <Icons.heartbeat className="h-4 w-4 fill-red-500 text-red-500" />
              <span>•</span>
              <span>{t.footer.bottom.buildWith}</span>
              <Link
                href="https://github.com/imoscarz/home-next"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                <Icons.github className="h-4 w-4" />
                <span>imoscarz/home-next</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
