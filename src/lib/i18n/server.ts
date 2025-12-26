import type { Locale } from "./config";
import { i18n } from "./config";

/**
 * Get locale from searchParams (use in Server Components)
 * @param searchParams - Promise<{ lang?: string }> from page props
 * @returns Promise<Locale>
 * 
 * @example
 * export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
 *   const locale = await getLocaleFromSearchParams(searchParams);
 *   const dict = await getDictionary(locale);
 * }
 */
export async function getLocaleFromSearchParams(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<Locale> {
  const params = await searchParams;
  const lang = params.lang;
  
  if (typeof lang === "string" && i18n.locales.includes(lang as Locale)) {
    return lang as Locale;
  }

  return i18n.defaultLocale;
}

