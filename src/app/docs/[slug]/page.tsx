import { Metadata } from "next";
import { notFound } from "next/navigation";

import DocLastEdit from "@/components/project/doc-last-edit";
import { BlurFade } from "@/components/ui/blur-fade";
import { projectConfig } from "@/config/project";
import { BLUR_FADE_DELAY } from "@/data";
import { getAllDocSlugs, getDocBySlugWithCommit } from "@/lib/docs";
import { getDictionary } from "@/lib/i18n";
import { extractHeadings, renderMarkdownToHTML } from "@/lib/markdown-server";

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

  // 服务端渲染 Markdown - 无需客户端 JS
  const htmlContent = await renderMarkdownToHTML(doc.content);
  const headings = extractHeadings(doc.content);

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:px-16 md:px-20 md:py-16 lg:px-24 lg:py-20">
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

      {/* 网格布局：内容 + 目录侧边栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 mt-8">
        {/* 主要内容：服务端渲染的 HTML */}
        <article
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
        {/* 目录侧边栏（仅在大屏显示） */}
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-4">
              <h3 className="text-sm font-semibold mb-3">{dict.releases.toc}</h3>
              <ul className="space-y-1 text-sm">
                {headings.map((heading) => (
                  <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 12}px` }}>
                    <a
                      href={`#${heading.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>
    </main>
  );
}
