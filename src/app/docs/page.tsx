import { Metadata } from "next";
import Link from "next/link";

import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BLUR_FADE_DELAY } from "@/data";
import { getDocsByCategory } from "@/lib/docs";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  return {
    title: dict.docs.title,
    description: dict.docs.description,
  };
}

export default async function DocsPage({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);

  // 从文件系统读取文档
  const docsByCategory = getDocsByCategory();

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      {/* Header */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {dict.docs.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {dict.docs.description}
            </p>
          </div>
        </BlurFade>
      </section>

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
                  {locale === "en"
                    ? "Documentation is coming soon. Please visit our GitHub repository for detailed information."
                    : "文档即将推出。请访问我们的GitHub仓库获取详细信息。"}
                </p>
              </CardContent>
            </Card>
          </BlurFade>
        )}
      </section>
    </main>
  );
}
