"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";

type DocTocProps = {
  content: string;
  dict: {
    toc: string;
  };
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function DocToc({ content, dict }: DocTocProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extracted: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      extracted.push({ id, text, level });
    }

    setHeadings(extracted);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden xl:block xl:w-64">
      <div className="sticky top-24 space-y-4">
        <Card className="p-4">
          <h3 className="mb-4 text-sm font-semibold">{dict.toc}</h3>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left text-sm transition-colors hover:text-foreground ${
                  activeId === heading.id
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
                style={{
                  paddingLeft: `${(heading.level - 1) * 0.75}rem`,
                }}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </Card>
      </div>
    </aside>
  );
}
