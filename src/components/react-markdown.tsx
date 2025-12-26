"use client";

import "katex/dist/katex.min.css";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { Button } from "@/components/ui/button";

interface CustomReactMarkdownProps {
  children: string;
  className?: string;
}

// Custom Image component that uses Next.js Image or native img for shields.io
function CustomImage({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;

  // Use native img tag for shields.io URLs
  if (typeof src === 'string' && src.includes('img.shields.io')) {
    return (
      <img
        src={src as string}
        alt={alt || ""}
        className="object-contain"
      />
    );
  }

  return (
    <Image
      src={src as string}
      alt={alt || ""}
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, 768px"
      className="object-contain"
    />
  );
}

// Custom Code component with syntax highlighting
function CustomCode({
  inline,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  inline?: boolean;
}) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && language) {
    return (
      <div className="my-6 overflow-hidden rounded-lg shadow-sm bg-card border">
        {/* Language label and copy button */}
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 text-xs border-b">
          <span className="font-mono text-muted-foreground uppercase">{language}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
        </div>
        {/* Code block */}
        <SyntaxHighlighter
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={oneDark as any}
          language={language}
          PreTag="div"
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: "0.75rem",
            paddingTop: "0.75rem",
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono" {...props}>
      {children}
    </code>
  );
}

// Helper function to generate heading ID
// Note: This should match the logic in doc-toc.tsx
function generateHeadingId(text: string): string {
  let id = String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  
  // If ID is empty, use a hash of the original text
  if (!id) {
    // Simple hash function for fallback
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    id = `heading-${Math.abs(hash).toString(36)}`;
  }
  
  return id;
}

// Custom Heading components with auto-generated IDs
function CustomH1({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = generateHeadingId(String(children));
  return <h1 id={id} className="scroll-mt-24" {...props}>{children}</h1>;
}

function CustomH2({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = generateHeadingId(String(children));
  return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>;
}

function CustomH3({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = generateHeadingId(String(children));
  return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>;
}

function CustomH4({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = generateHeadingId(String(children));
  return <h4 id={id} className="scroll-mt-24" {...props}>{children}</h4>;
}

function CustomH5({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = generateHeadingId(String(children));
  return <h5 id={id} className="scroll-mt-24" {...props}>{children}</h5>;
}

function CustomH6({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const id = generateHeadingId(String(children));
  return <h6 id={id} className="scroll-mt-24" {...props}>{children}</h6>;
}

// Custom text processing for GitHub links and @mentions
function processText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Pattern for GitHub compare URLs
  const compareRegex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^/\s]+)\.\.\.([^/\s]+)/g;
  // Pattern for GitHub PR URLs  
  const prRegex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/g;
  // Pattern for @mentions
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;

  const patterns = [
    { regex: compareRegex, type: 'compare' },
    { regex: prRegex, type: 'pr' },
    { regex: mentionRegex, type: 'mention' }
  ];

  const matches: Array<{ index: number; length: number; match: RegExpExecArray; type: string }> = [];

  // Collect all matches
  patterns.forEach(({ regex, type }) => {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        match,
        type
      });
    }
  });

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Process matches
  matches.forEach((item) => {
    // Add text before match
    if (item.index > lastIndex) {
      parts.push(text.slice(lastIndex, item.index));
    }

    // Add matched link
    if (item.type === 'compare') {
      const [, , , from, to] = item.match;
      parts.push(
        <Link
          key={`link-${key++}`}
          href={item.match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {from}...{to}
        </Link>
      );
    } else if (item.type === 'pr') {
      const [, , , prNumber] = item.match;
      parts.push(
        <Link
          key={`link-${key++}`}
          href={item.match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          PR#{prNumber}
        </Link>
      );
    } else if (item.type === 'mention') {
      const [, username] = item.match;
      parts.push(
        <Link
          key={`link-${key++}`}
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          @{username}
        </Link>
      );
    }

    lastIndex = item.index + item.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// Custom paragraph component
function CustomParagraph({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="my-4 leading-7" {...props}>
      {React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <>{processText(child)}</>;
        }
        return child;
      })}
    </p>
  );
}

// Custom blockquote component
function CustomBlockquote({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote className="my-6 rounded-lg border bg-card p-4 shadow-sm border-l-4 border-l-primary" {...props}>
      <div className="italic text-muted-foreground">
        {children}
      </div>
    </blockquote>
  );
}

// Custom link component
function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http');
  return (
    <Link
      href={href || '#'}
      className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}

// Custom list components
function CustomUl({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="my-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  );
}

function CustomOl({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol className="my-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  );
}

function CustomLi({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className="leading-7" {...props}>
      {children}
    </li>
  );
}

// Custom table components
function CustomTable({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border shadow-sm bg-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border" {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

function CustomThead({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className="bg-muted/50" {...props}>
      {children}
    </thead>
  );
}

function CustomTbody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className="divide-y divide-border bg-card" {...props}>
      {children}
    </tbody>
  );
}

function CustomTr({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="hover:bg-muted/30 transition-colors" {...props}>
      {children}
    </tr>
  );
}

function CustomTh({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="px-6 py-3 text-left text-sm font-semibold" {...props}>
      {children}
    </th>
  );
}

function CustomTd({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="px-6 py-3 text-sm" {...props}>
      {children}
    </td>
  );
}

// Custom horizontal rule
function CustomHr(props: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className="my-8 border-t border-gray-300 dark:border-gray-700" {...props} />
  );
}

// Custom components for react-markdown
const components: Components = {
  img: CustomImage,
  code: CustomCode as Components["code"],
  h1: CustomH1 as Components["h1"],
  h2: CustomH2 as Components["h2"],
  h3: CustomH3 as Components["h3"],
  h4: CustomH4 as Components["h4"],
  h5: CustomH5 as Components["h5"],
  h6: CustomH6 as Components["h6"],
  p: CustomParagraph as Components["p"],
  blockquote: CustomBlockquote as Components["blockquote"],
  a: CustomLink as Components["a"],
  ul: CustomUl as Components["ul"],
  ol: CustomOl as Components["ol"],
  li: CustomLi as Components["li"],
  table: CustomTable as Components["table"],
  thead: CustomThead as Components["thead"],
  tbody: CustomTbody as Components["tbody"],
  tr: CustomTr as Components["tr"],
  th: CustomTh as Components["th"],
  td: CustomTd as Components["td"],
  hr: CustomHr as Components["hr"],
};

export function CustomReactMarkdown({
  children,
  className,
}: CustomReactMarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown 
        components={components} 
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
