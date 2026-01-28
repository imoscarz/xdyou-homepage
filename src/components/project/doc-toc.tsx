"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    // Extract headings from rendered HTML content
    const extracted: Heading[] = [];
    
    // Wait a tick to ensure DOM has updated
    setTimeout(() => {
      const container = document.querySelector('.prose');
      if (!container) return;
      
      const headingElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headingElements.forEach((element) => {
        const id = element.id;
        const text = element.textContent || '';
        const level = parseInt(element.tagName.substring(1), 10);
        
        if (id && text) {
          extracted.push({ id, text, level });
        }
      });
      
      setHeadings(extracted);
    }, 0);
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
      },
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
      <div className="sticky top-24">
        <Card className="flex flex-col">
          <CardHeader className="flex-none pb-3">
            <CardTitle className="text-base">{dict.toc}</CardTitle>
          </CardHeader>
          <CardContent
            className="scrollbar-thin flex-1 space-y-1 overflow-y-auto"
            style={{ maxHeight: "60vh" }}
          >
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`hover:text-foreground block w-full text-left text-sm transition-colors ${
                  activeId === heading.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
                style={{
                  paddingLeft: `${(heading.level - 1) * 0.75}rem`,
                }}
              >
                {heading.text}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
