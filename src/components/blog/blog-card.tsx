import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

interface BlogCardProps {
  // For internal blog posts
  slug?: string;
  // For external blog posts (RSS)
  link?: string;
  title: string;
  date: string;
  summary?: string;
  author?: string;
  categories?: string[];
  image?: string;
  locale?: Locale;
  dict?: Awaited<ReturnType<typeof getDictionary>>;
}

export function BlogCard({
  slug,
  link,
  title,
  date,
  summary,
  author,
  categories,
  image,
  locale = "en",
  dict,
}: BlogCardProps) {
  // Determine if this is an external link (RSS) or internal link
  const isExternal = !!link;
  const internalPath = `/blog/${slug}`;
  const href = isExternal
    ? link
    : locale === "en"
      ? `${internalPath}?lang=en`
      : internalPath;

  return (
    <Link
      href={href}
      {...(isExternal && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      className="group border-border bg-card focus-visible:ring-ring block h-full overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="flex h-full flex-col">
        {image && (
          <div className="bg-muted relative aspect-[2/1] w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 flex-1 text-base font-medium tracking-tight md:text-lg">
              {title}
            </h2>
            <div className="flex shrink-0 items-center gap-2">
              <span className="bg-secondary text-secondary-foreground group-hover:border-secondary/50 rounded-full border border-transparent px-2.5 py-1 text-[10px] font-medium transition-colors">
                {new Date(date).toLocaleDateString(
                  locale === "zh" ? "zh-CN" : "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  },
                )}
              </span>
              {isExternal && (
                <Icons.externalLink className="text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 transition-colors" />
              )}
            </div>
          </div>

          {author && (
            <div className="text-muted-foreground mb-2 text-xs">
              {dict?.blog.by || (locale === "zh" ? "作者：" : "By ")}
              {author}
            </div>
          )}

          {summary && (
            <p className="text-muted-foreground mb-3 line-clamp-3 text-sm md:mb-4">
              {summary}
            </p>
          )}

          {categories && categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          <div className="text-muted-foreground mt-auto flex items-center justify-between pt-2 text-xs">
            <span className="group-hover:text-foreground inline-flex items-center gap-1 transition-colors">
              {dict?.blog.readMore || (locale === "zh" ? "阅读更多" : "Read more")}
              <Icons.chevronright className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
