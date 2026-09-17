"use client";

import { useEffect } from "react";

import { useLocale } from "@/lib/i18n/client";

export default function DocumentLanguage() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
