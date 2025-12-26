"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { Locale } from "./config";
import { i18n } from "./config";

/**
 * Get current locale from URL search params (Client Component hook)
 * @returns Locale
 * 
 * @example
 * "use client";
 * function MyComponent() {
 *   const locale = useLocale();
 *   // Use locale...
 * }
 */
export function useLocale(): Locale {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");

  if (lang && i18n.locales.includes(lang as Locale)) {
    return lang as Locale;
  }

  return i18n.defaultLocale;
}

type Dictionary = {
  blog: {
    by: string;
    readMore: string;
    title: string;
    noPosts: string;
    visitBlogHome: string;
    toc: {
      title: string;
      toggle: string;
      close: string;
      noContent: string;
    };
  };
  anime: {
    progress: string;
  };
  footer: Record<string, unknown>;
  nav: Record<string, unknown>;
  page: Record<string, unknown>;
  home: Record<string, unknown>;
};

/**
 * Get dictionary for current locale (Client Component hook)
 * @returns Dictionary object
 * 
 * @example
 * "use client";
 * function MyComponent() {
 *   const dict = useDictionary();
 *   // Use dict...
 * }
 */
export function useDictionary(): Dictionary | null {
  const locale = useLocale();
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await import(`./locales/${locale}.json`);
      setDict(dictionary.default);
    };
    loadDictionary();
  }, [locale]);

  return dict;
}
