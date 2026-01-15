import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function formatDate(date: string, locale: Locale = "zh") {
  const dict = await getDictionary(locale);
  const currentDate = new Date().getTime();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date).getTime();
  const timeDifference = Math.abs(currentDate - targetDate);
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const fullDate = new Date(date).toLocaleString(locale === "zh" ? "zh-CN" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (daysAgo < 1) {
    return dict.common.time.today;
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}${dict.common.time.daysAgo})`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}${dict.common.time.weeksAgo})`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}${dict.common.time.monthsAgo})`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo}${dict.common.time.yearsAgo})`;
  }
}

export function jsonldScript(jsonLd: string) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
