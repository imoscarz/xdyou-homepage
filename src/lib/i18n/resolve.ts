import type { NextRequest } from "next/server";

import type { Locale } from "./config";
import { i18n } from "./config";

/**
 * Resolve locale from NextRequest
 * Priority: query param `lang` > cookie `NEXT_LOCALE` > Accept-Language > default
 */
export const resolveLocaleFromRequest = (request: NextRequest): Locale => {
  const langParam = request.nextUrl.searchParams.get("lang");
  if (langParam && i18n.locales.includes(langParam as Locale)) {
    return langParam as Locale;
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]?.split("-")[0];
    if (preferred && i18n.locales.includes(preferred as Locale)) {
      return preferred as Locale;
    }
  }

  return i18n.defaultLocale;
};

/**
 * Resolve locale from searchParams in Server Components
 */
export const resolveLocaleFromSearchParams = async (
  searchParams:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>,
): Promise<Locale> => {
  const params = await searchParams;
  const lang = params.lang;

  if (typeof lang === "string" && i18n.locales.includes(lang as Locale)) {
    return lang as Locale;
  }

  return i18n.defaultLocale;
};

/**
 * Resolve locale on the server using cookies() and headers()
 */
// Server-only headers/cookies resolver moved to server-headers.ts
