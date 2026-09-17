"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageToggle } from "@/components/blocks/navbar/language-toggle";
import { ModeToggle } from "@/components/blocks/navbar/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data";
import { useDictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navbarSocialEntries = Object.entries(DATA.contact.social).filter(
  ([, social]) => social.navbar,
);

export default function Navbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const dict = useDictionary();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Get translated label for navbar item
  const getNavLabel = (key: string): string => {
    if (!dict) return key;
    const labelKey = key.toLowerCase() as keyof typeof dict.nav;
    return dict.nav[labelKey] ?? key;
  };

  // Preserve language parameter when navigating
  const buildHref = (path: string) => {
    const langParam = searchParams.get("lang");
    if (langParam) {
      return `${path}?lang=${langParam}`;
    }
    return path;
  };

  const isActivePath = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto mb-9 flex h-full max-h-16 origin-bottom md:top-0 md:mb-0",
      )}
    >
      <div
        className={cn(
          "bg-background/60 dark:bg-background/40 fixed inset-x-0 bottom-0 h-16 w-full to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_top,black,transparent)] md:top-0 md:[-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]",
        )}
      ></div>
      <nav
        aria-label={dict?.nav.label}
        className="bg-background/90 border-border pointer-events-auto relative z-50 mx-auto flex h-[60px] items-center gap-1 rounded-[20px] border p-[7px] shadow-sm backdrop-blur-md md:mt-2"
      >
        {DATA.navbar.map((item) => {
          const href = buildHref(item.href);
          const isActive = isActivePath(item.href);
          const translatedLabel = getNavLabel(item.label);

          return (
            <div key={item.href} className="flex shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: isDesktop ? "lg" : "icon",
                      }),
                      isDesktop
                        ? "h-11 min-w-[104px] justify-start gap-2 rounded-xl px-4 shadow-none"
                        : "size-11 rounded-xl shadow-none",
                      isActive &&
                        "bg-accent text-accent-foreground hover:bg-accent/90",
                    )}
                    aria-label={translatedLabel}
                    aria-current={isActive ? "page" : undefined}
                    {...(item.href.endsWith(".pdf") ? { prefetch: false } : {})}
                  >
                    <item.icon className="size-4" />
                    {isDesktop && (
                      <span className="text-sm font-medium">
                        {translatedLabel}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side={isDesktop ? "bottom" : "top"}
                  sideOffset={8}
                >
                  <p>{translatedLabel}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
        {navbarSocialEntries.length > 0 && (
          <>
            <Separator orientation="vertical" className="h-full" />
            {navbarSocialEntries.map(([name, social]) => (
              <div key={name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-11 rounded-xl shadow-none",
                      )}
                    >
                      <social.icon className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side={isDesktop ? "bottom" : "top"}
                    sideOffset={8}
                  >
                    <p>{name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </>
        )}
        <Separator orientation="vertical" className="mx-1 !h-6" />
        <div className="flex shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent side={isDesktop ? "bottom" : "top"} sideOffset={8}>
              <p>{dict?.nav?.theme ?? "Theme"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <LanguageToggle />
            </TooltipTrigger>
            <TooltipContent side={isDesktop ? "bottom" : "top"} sideOffset={8}>
              <p>{dict?.nav?.language ?? "Language"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </div>
  );
}
