import { BlogCard } from "@/components/blog/blog-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { BLUR_FADE_DELAY, DATA } from "@/data";
import { env } from "@/lib/env";
import { getDictionary, getLocaleFromSearchParams } from "@/lib/i18n";
import { getBlogPosts, stripHtml } from "@/lib/rss";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const locale = await getLocaleFromSearchParams(searchParams);
  const dict = await getDictionary(locale);
  
  // Check if RSS feed is configured
  const posts = env.rssFeedUrl ? await getBlogPosts() : [];

  // Select blog description based on locale
  const blogDescription = locale === "en" ? DATA.blogDescription : DATA.chinese.blogDescription;

  return (
    <section className="pt-16 pb-12 sm:pt-24 sm:pb-14 md:pt-32 md:pb-16 lg:pt-36 xl:pt-40">
      <div className="mx-auto w-full max-w-3xl px-6 sm:px-8 md:px-10">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="mb-4 text-3xl font-semibold tracking-tighter md:text-4xl">
            {dict.blog.title}
          </h1>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm md:text-base">
            {blogDescription}
          </p>
          {env.blogHomeUrl && (
            <a
              href={env.blogHomeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1 mb-8"
            >
              {dict.blog.visitBlogHome}
              <svg
                className="size-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </BlurFade>
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 sm:px-8 md:px-10">
        {posts.length === 0 ? (
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {dict.blog.noPosts}
              </p>
            </div>
          </BlurFade>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-5">
            {posts.map((post, id) => (
              <BlurFade delay={BLUR_FADE_DELAY * (2 + id)} key={post.guid || post.link}>
                <BlogCard
                  link={post.link}
                  title={post.title}
                  date={post.pubDate}
                  summary={post.description ? stripHtml(post.description) : undefined}
                  author={post.author}
                  categories={post.categories}
                  image={post.image}
                  locale={locale}
                  dict={dict}
                />
              </BlurFade>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
