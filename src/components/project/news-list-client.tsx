"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsPost } from "@/lib/news";

type NewsListClientProps = {
  posts: NewsPost[];
  dict: {
    search: string;
    readMore: string;
    noNews: string;
    by: string;
    publishedOn: string;
  };
  delay?: number;
};

export default function NewsListClient({
  posts,
  dict,
  delay = 0,
}: NewsListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((post) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <BlurFade delay={delay}>
        <div className="relative">
          <input
            type="text"
            placeholder={dict.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </BlurFade>

      {/* News Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, idx) => (
            <BlurFade key={post.slug} delay={delay + 0.1 + idx * 0.05}>
              <Link href={`/news/${post.slug}`}>
                <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {dict.by} {post.author} • {dict.publishedOn} {post.date}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </BlurFade>
          ))}
        </div>
      ) : (
        <BlurFade delay={delay + 0.1}>
          <Card>
            <CardContent className="flex min-h-[200px] items-center justify-center p-8">
              <p className="text-muted-foreground">{dict.noNews}</p>
            </CardContent>
          </Card>
        </BlurFade>
      )}
    </div>
  );
}
