import type { NextRequest } from "next/server";

import type { Locale } from "./config";
import { i18n } from "./config";

const dictionaries = {
  zh: () => import("./locales/zh.json").then((module) => module.default),
  en: () => import("./locales/en.json").then((module) => module.default),
};

/**
 * Get dictionary based on locale string
 */
export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    return dictionaries["zh"](); // fallback to default
  }
  return dictionaries[locale]();
};

/**
 * Get locale from request query parameters or headers
 * Priority: query param `lang` > Accept-Language header > default locale
 */
export const getLocaleFromRequest = (request: NextRequest): Locale => {
  // 1. Check query parameter
  const langParam = request.nextUrl.searchParams.get("lang");
  if (langParam && i18n.locales.includes(langParam as Locale)) {
    return langParam as Locale;
  }

  // 2. Check Accept-Language header (optional)
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(",")[0]?.split("-")[0];
    if (preferredLang && i18n.locales.includes(preferredLang as Locale)) {
      return preferredLang as Locale;
    }
  }

  // 3. Return default locale
  return i18n.defaultLocale;
};
