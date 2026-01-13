"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageToggle } from "@/components/blocks/navbar/language-toggle";
import { ModeToggle } from "@/components/blocks/navbar/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data";
import { useDictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
      <Dock
        disableMagnification
        className="bg-background/80 dark:bg-background/60 pointer-events-auto relative z-50 mx-auto flex h-full min-h-full items-center gap-3 px-2 md:mt-1 md:gap-4 md:px-4 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]"
      >
        {DATA.navbar.map((item) => {
          const href = buildHref(item.href);
          const isActive = isActivePath(item.href);
          const translatedLabel = getNavLabel(item.label);

          return (
            <DockIcon key={item.href} fluid={isDesktop}>
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
                        ? "h-11 min-w-[120px] justify-start gap-2 px-4"
                        : "size-12",
                      isActive &&
                        "bg-accent text-accent-foreground shadow-inner hover:bg-accent/90",
                    )}
                    aria-label={translatedLabel}
                    aria-pressed={isActive}
                    {...(item.href.endsWith(".pdf") ? { prefetch: false } : {})}
                  >
                    <item.icon className="size-4" />
                    {isDesktop && (
                      <span className="text-sm font-medium">{translatedLabel}</span>
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
            </DockIcon>
          );
        })}
        <Separator orientation="vertical" className="h-full" />
        {/* {Object.entries(DATA.contact.social)
          .filter(([, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12",
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        <Separator orientation="vertical" className="h-full py-2" /> */}
        <DockIcon
          fluid
          className="hover:bg-transparent transition-none md:hover:bg-muted-foreground md:transition-colors"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent side={isDesktop ? "bottom" : "top"} sideOffset={8}>
              <p>{dict?.nav?.theme ?? "Theme"}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        <DockIcon
          fluid
          className="hover:bg-transparent transition-none md:hover:bg-muted-foreground md:transition-colors"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <LanguageToggle />
            </TooltipTrigger>
            <TooltipContent side={isDesktop ? "bottom" : "top"} sideOffset={8}>
              <p>{dict?.nav?.language ?? "Language"}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}
