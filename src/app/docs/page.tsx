import { Metadata } from "next";
import Link from "next/link";

import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BLUR_FADE_DELAY } from "@/data";
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

  // 示例文档列表
  const docs = [
    {
      title: locale === "en" ? "Getting Started" : "快速开始",
      href: "/docs/getting-started",
      description:
        locale === "en"
          ? "Learn how to install and use XDYou"
          : "了解如何安装和使用XDYou",
    },
    {
      title: locale === "en" ? "FAQ" : "常见问题",
      href: "/docs/faq",
      description:
        locale === "en"
          ? "Frequently asked questions and troubleshooting"
          : "常见问题解答和故障排除",
    },
  ];

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
      <section>
        <div className="grid gap-6 sm:grid-cols-2">
          {docs.map((doc, idx) => (
            <BlurFade key={doc.href} delay={BLUR_FADE_DELAY * 2 + idx * 0.05}>
              <Link href={doc.href}>
                <Card className="h-full transition-colors hover:bg-accent">
                  <CardHeader>
                    <CardTitle>{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {doc.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Coming Soon Notice */}
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <Card className="bg-muted/50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {locale === "en"
                ? "More documentation is coming soon. For now, please visit our GitHub repository for detailed information."
                : "更多文档即将推出。目前，请访问我们的GitHub仓库获取详细信息。"}
            </p>
          </CardContent>
        </Card>
      </BlurFade>
    </main>
  );
}
