import type { Locale } from "./config";
import { resolveLocaleFromRequest } from "./resolve";

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
export const getLocaleFromRequest = resolveLocaleFromRequest;
