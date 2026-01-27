import type { Locale } from "./config";
import { resolveLocaleFromSearchParams } from "./resolve";

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
  searchParams:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>,
): Promise<Locale> {
  return resolveLocaleFromSearchParams(searchParams);
}
