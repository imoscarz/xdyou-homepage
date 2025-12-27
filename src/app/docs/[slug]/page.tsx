import { Metadata } from "next";
import { notFound } from "next/navigation";

import DocContent from "@/components/project/doc-content";
import { BlurFade } from "@/components/ui/blur-fade";
import { BLUR_FADE_DELAY } from "@/data";
import { getAllDocSlugs, getDocBySlug } from "@/lib/docs";
import { getDictionary } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: "Document Not Found",
    };
  }

  return {
    title: doc.metadata.title,
    description: doc.metadata.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  // Force documentation content pages to use Chinese locale
  const dict = await getDictionary("zh");
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {doc.metadata.title}
          </h1>
          {doc.metadata.description && (
            <p className="text-lg text-muted-foreground">
              {doc.metadata.description}
            </p>
          )}
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <DocContent
          content={doc.content}
          dict={{
            toc: dict.releases.toc,
          }}
        />
      </BlurFade>
    </main>
  );
}
