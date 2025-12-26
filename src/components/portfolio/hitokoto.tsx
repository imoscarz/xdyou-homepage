"use client";

import { useEffect, useState } from "react";

import { BlurFade } from "@/components/ui/blur-fade";

interface HitokotoData {
  id: number;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
  creator: string;
  creator_uid: number;
  reviewer: number;
  uuid: string;
  commit_from: string;
  created_at: string;
  length: number;
}

interface HitokotoProps {
  delay?: number;
}

export default function Hitokoto({ delay = 0 }: HitokotoProps) {
  const [hitokoto, setHitokoto] = useState<HitokotoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHitokoto = async () => {
      try {
        const response = await fetch("https://v1.hitokoto.cn");
        const data = await response.json();
        setHitokoto(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hitokoto:", error);
        setLoading(false);
      }
    };

    fetchHitokoto();
  }, []);

  if (loading) {
    return (
      <BlurFade delay={delay}>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
        </div>
      </BlurFade>
    );
  }

  if (!hitokoto) {
    return null;
  }

  return (
    <BlurFade delay={delay}>
      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="space-y-4">
          <blockquote className="border-l-4 border-primary pl-4 italic">
            <p className="text-lg font-medium leading-relaxed">
              {hitokoto.hitokoto}
            </p>
          </blockquote>
          <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-muted-foreground">
            {hitokoto.from && (
              <span>
                —— {hitokoto.from}
                {hitokoto.from_who && ` · ${hitokoto.from_who}`}
              </span>
            )}
          </div>
          <a
            href={`https://hitokoto.cn?uuid=${hitokoto.uuid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <span>一言</span>
            <svg
              className="h-3 w-3"
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
        </div>
      </div>
    </BlurFade>
  );
}
