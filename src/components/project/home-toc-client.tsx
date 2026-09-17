"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function HomeToc({
  items,
  label,
}: {
  items: { id: string; label: string }[];
  label: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigating = useRef(false);
  const visible = active !== "hero";
  // Labels can change without restarting scroll restoration on language changes.
  const sectionIds = items.map((item) => item.id).join(",");
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    root.classList.add("home-paging");
    const sections = sectionIds
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => !!element);
    const update = () => {
      const line = window.innerHeight * 0.3;
      const current =
        sections
          .filter((section) => section.getBoundingClientRect().top <= line)
          .at(-1) || sections[0];
      if (current) setActive(current.id);
    };
    let scrollFrame = 0;
    const scheduleUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        update();
      });
    };
    // IO catches layout/visibility changes; scroll sampling also catches markers
    // that pass the activation line between two observer deliveries.
    const observer = new IntersectionObserver(scheduleUpdate, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    sections.forEach((section) => observer.observe(section));
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    const main = document.querySelector(".home-pages");
    if (main) resizeObserver.observe(main);
    let restoreFrame = 0;
    let restorationCancelled = false;
    const initialId = location.hash.slice(1).split("#")[0];
    const restoreAnchor = () => {
      cancelAnimationFrame(restoreFrame);
      // Native history restoration can run after React hydration. Wait for its
      // layout pass before restoring a deep link, without overriding user input.
      restoreFrame = requestAnimationFrame(() => {
        restoreFrame = requestAnimationFrame(() => {
          if (restorationCancelled) return;
          const target = document.getElementById(initialId);
          if (target && location.hash.slice(1).split("#")[0] === initialId) {
            if (location.hash !== `#${initialId}`) {
              const url = new URL(location.href);
              url.hash = initialId;
              history.replaceState(history.state, "", url);
            }
            target.scrollIntoView({ behavior: "instant", block: "start" });
          }
          update();
        });
      });
    };
    const cancelRestoration = () => {
      restorationCancelled = true;
      cancelAnimationFrame(restoreFrame);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) restoreAnchor();
    };
    restoreAnchor();
    window.addEventListener("load", restoreAnchor, { once: true });
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pointerdown", cancelRestoration, { once: true });
    window.addEventListener("wheel", cancelRestoration, {
      passive: true,
      once: true,
    });
    window.addEventListener("keydown", cancelRestoration, { once: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("popstate", scheduleUpdate);
    return () => {
      cancelAnimationFrame(restoreFrame);
      window.removeEventListener("load", restoreAnchor);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pointerdown", cancelRestoration);
      window.removeEventListener("wheel", cancelRestoration);
      window.removeEventListener("keydown", cancelRestoration);
      cancelAnimationFrame(scrollFrame);
      observer.disconnect();
      resizeObserver.disconnect();
      root.classList.remove("home-paging");
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      window.removeEventListener("popstate", scheduleUpdate);
    };
  }, [sectionIds]);

  const links = (compact = false) => (
    <nav aria-label={label}>
      <ol className={cn("border-border border-l", compact && "my-1")}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "text-muted-foreground hover:text-foreground -ml-px block border-l-2 border-transparent px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                active === item.id &&
                  "border-foreground text-foreground font-medium",
              )}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                const target = document.getElementById(item.id);
                if (!target) return;
                const url = new URL(location.href);
                url.hash = item.id;
                if (location.hash !== url.hash)
                  history.pushState(history.state, "", url);
                navigating.current = true;
                setOpen(false);
                const section =
                  document.getElementById(`${item.id}-title`) ||
                  document.getElementById(item.id);
                if (section) {
                  section.tabIndex = -1;
                  section.focus({ preventScroll: true });
                }
                target.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                  block: "start",
                });
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
  return (
    <>
      <aside className="hidden min-w-0 xl:block">
        <div
          inert={!visible}
          aria-hidden={!visible}
          className={cn(
            "sticky top-[max(6rem,calc(50dvh-10rem))] py-4 transition-opacity duration-300",
            !visible && "pointer-events-none opacity-0",
          )}
        >
          <p className="text-muted-foreground mb-4 pl-4 text-xs">{label}</p>
          {links()}
        </div>
      </aside>
      {mounted &&
        visible &&
        createPortal(
          <div className="fixed top-4 right-4 z-40 md:top-20 xl:hidden">
            <Popover
              open={open}
              onOpenChange={(value) => {
                navigating.current = false;
                setOpen(value);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/95 rounded-full px-4 shadow-sm"
                >
                  {label}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-52 rounded-xl data-[state=closed]:!animate-none data-[state=open]:!animate-none"
                onCloseAutoFocus={(event) => {
                  if (navigating.current) event.preventDefault();
                }}
              >
                {links(true)}
              </PopoverContent>
            </Popover>
          </div>,
          document.body,
        )}
    </>
  );
}
