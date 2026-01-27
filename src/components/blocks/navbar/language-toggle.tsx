"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useDictionary, useLocale } from "@/lib/i18n";

export function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const dict = useDictionary();
  const isEnglish = currentLocale === "en";

  // Disable language toggle on news detail pages to avoid 404
  const isNewsDetail = pathname?.startsWith("/news/") && pathname !== "/news";
  // Disable language toggle on docs detail pages to lock content to Chinese
  const isDocsDetail = pathname?.startsWith("/docs/") && pathname !== "/docs";

  const handleLanguageToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());

    if (isEnglish) {
      // Switch to Chinese (remove lang param)
      params.delete("lang");
      // Persist locale in cookie for server-rendered pages (e.g., 404)
      document.cookie = `NEXT_LOCALE=zh; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    } else {
      // Switch to English
      params.set("lang", "en");
      // Persist locale in cookie for server-rendered pages (e.g., 404)
      document.cookie = `NEXT_LOCALE=en; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    }

    // Construct new URL
    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(targetUrl);
  };

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="px-2"
      onClick={isNewsDetail || isDocsDetail ? undefined : handleLanguageToggle}
      aria-label="Toggle language"
      aria-disabled={isNewsDetail || isDocsDetail}
      disabled={isNewsDetail || isDocsDetail}
    >
      <span className="text-sm font-medium">
        {dict?.common.language[currentLocale] || (isEnglish ? "EN" : "中")}
      </span>
    </Button>
  );
}
