import { Metadata } from "next";
import { notFound } from "next/navigation";

import DocContent from "@/components/project/doc-content";
import DocLastEdit from "@/components/project/doc-last-edit";
import { BlurFade } from "@/components/ui/blur-fade";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { getAllDocSlugs, getDocBySlugWithCommit } from "@/lib/docs";
import { getDictionary } from "@/lib/i18n";
import { PAGE_CONTAINER_CLASSES } from "@/lib/page-helpers";

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
  const doc = await getDocBySlugWithCommit(
    slug,
    projectConfig.docsRepo.owner,
    projectConfig.docsRepo.name,
    projectConfig.docsRepo.branch,
  );

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
  const doc = await getDocBySlugWithCommit(
    slug,
    projectConfig.docsRepo.owner,
    projectConfig.docsRepo.name,
    projectConfig.docsRepo.branch,
  );

  if (!doc) {
    notFound();
  }

  return (
    <main className={PAGE_CONTAINER_CLASSES.docs}>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {doc.metadata.title}
            </h1>
            {doc.metadata.description && (
              <p className="text-muted-foreground text-lg">
                {doc.metadata.description}
              </p>
            )}
          </div>
          
          {doc.lastCommit && (
            <DocLastEdit
              lastCommit={doc.lastCommit}
              slug={slug}
              docsRepo={projectConfig.docsRepo}
            />
          )}
        </div>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <DocContent
          content={doc.html || ""}
          dict={{
            toc: dict.releases.toc,
          }}
        />
      </BlurFade>
    </main>
  );
}
