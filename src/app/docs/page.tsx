import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BLUR_FADE_DELAY } from "@/data";
import { getDocsByCategory } from "@/lib/docs";
import {
  generateSimpleMetadata,
  getPageI18n,
  PAGE_CONTAINER_CLASSES,
  type PageProps,
} from "@/lib/page-helpers";

export async function generateMetadata({ searchParams }: PageProps) {
  return generateSimpleMetadata(
    searchParams,
    "docs.title",
    "docs.description",
  );
}

export default async function DocsPage({ searchParams }: PageProps) {
  const { locale, dict } = await getPageI18n(searchParams);

  // 从文件系统读取文档
  const docsByCategory = getDocsByCategory();

  return (
    <main className={PAGE_CONTAINER_CLASSES.standard}>
      <PageHeader
        title={dict.docs.title}
        description={dict.docs.description}
      />

      {/* Chinese Only Notice for English users */}
      {locale === "en" && dict.docs.chineseOnlyNotice && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ℹ️ {dict.docs.chineseOnlyNotice}
          </p>
        </div>
      )}

      {/* Docs Grid */}
      <section className="space-y-12">
        {Object.entries(docsByCategory).length > 0 ? (
          Object.entries(docsByCategory).map(([category, docs], catIdx) => (
            <div key={category} className="space-y-4">
              <BlurFade delay={BLUR_FADE_DELAY * 2 + catIdx * 0.1}>
                <h2 className="text-2xl font-bold">{category}</h2>
              </BlurFade>
              <div className="grid gap-6 sm:grid-cols-2">
                {docs.map((doc, idx) => (
                  <BlurFade
                    key={doc.slug}
                    delay={BLUR_FADE_DELAY * 2 + catIdx * 0.1 + idx * 0.05}
                  >
                    <Link href={`/docs/${doc.slug}?lang=zh`}>
                      <Card className="h-full transition-shadow hover:shadow-lg">
                        <CardHeader>
                          <CardTitle>{doc.metadata.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{doc.metadata.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </BlurFade>
                ))}
              </div>
            </div>
          ))
        ) : (
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <Card className="bg-muted/50">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {dict.docs.comingSoon}
                </p>
              </CardContent>
            </Card>
          </BlurFade>
        )}
      </section>
    </main>
  );
}
