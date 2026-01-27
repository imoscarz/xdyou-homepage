import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/server-headers";

// locale 解析已统一到 i18n/resolve

export default async function NotFound() {
  const locale = await resolveLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-foreground mb-4 text-6xl font-bold">404</h1>
        <h2 className="text-foreground mb-4 text-2xl font-semibold">
          {dict.notFound.title}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          {dict.notFound.description}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/">{dict.notFound.goHome}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/news">{dict.notFound.viewNews}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
