import { cookies, headers } from "next/headers";

import type { Locale } from "./config";
import { i18n } from "./config";

/**
 * Server-only locale resolver using cookies() and headers()
 */
export const resolveLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const hdrs = await headers();
  const acceptLanguage = hdrs.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]?.split("-")[0];
    if (preferred && i18n.locales.includes(preferred as Locale)) {
      return preferred as Locale;
    }
  }

  return i18n.defaultLocale;
};
