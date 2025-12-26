"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

export function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const isEnglish = currentLocale === "en";

  const handleLanguageToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    
    if (isEnglish) {
      // Switch to Chinese (remove lang param)
      params.delete("lang");
    } else {
      // Switch to English
      params.set("lang", "en");
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
      onClick={handleLanguageToggle}
      aria-label="Toggle language"
    >
      <span className="text-sm font-medium">{isEnglish ? "EN" : "中"}</span>
    </Button>
  );
}
