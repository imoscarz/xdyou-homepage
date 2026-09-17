"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n";

export function ModeToggle() {
  const dict = useDictionary();
  const { resolvedTheme, setTheme } = useTheme();
  const toggle = () => {
    const update = () =>
      flushSync(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"));
    if (
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const transition = document.startViewTransition(update);
      void transition.finished.catch(() => {});
    } else update();
  };
  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="relative size-11 rounded-xl p-0 shadow-none"
      onClick={toggle}
      aria-label={dict?.nav.theme}
    >
      <SunIcon className="absolute size-[1.2rem] rotate-0 opacity-100 transition-[opacity,transform] duration-200 dark:rotate-45 dark:opacity-0" />
      <MoonIcon className="absolute size-[1.2rem] -rotate-45 opacity-0 transition-[opacity,transform] duration-200 dark:rotate-0 dark:opacity-100" />
    </Button>
  );
}
