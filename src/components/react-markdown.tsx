"use client";

import "katex/dist/katex.min.css";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
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

// Generate stable heading IDs (matches doc-toc logic)
function generateHeadingId(text: string): string {
  let id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!id) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash = hash & hash;
    }
    id = `heading-${Math.abs(hash).toString(36)}`;
  }

  return id;
}

// Image: use native img for shields.io, otherwise Next/Image
function CustomImage({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;

  if (typeof src === "string" && src.includes("img.shields.io")) {
    return (
      <img src={src} alt={alt || ""} className="object-contain" {...props} />
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

// GitHub text processing: compare links, PR links, mentions
function processText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const compareRegex =
    /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^/\s]+)\.\.\.([^/\s]+)/g;
  const prRegex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/g;
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;

  const patterns = [
    { regex: compareRegex, type: "compare" },
    { regex: prRegex, type: "pr" },
    { regex: mentionRegex, type: "mention" },
  ];

  const matches: Array<{
    index: number;
    length: number;
    match: RegExpExecArray;
    type: string;
  }> = [];

  patterns.forEach(({ regex, type }) => {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        match,
        type,
      });
    }
  });

  matches.sort((a, b) => a.index - b.index);

  matches.forEach((item) => {
    if (item.index > lastIndex) {
      parts.push(text.slice(lastIndex, item.index));
    }

    if (item.type === "compare") {
      const [, , , from, to] = item.match;
      parts.push(
        <Link
          key={`link-${key++}`}
          href={item.match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium transition-colors hover:underline"
        >
          {from}...{to}
        </Link>,
      );
    } else if (item.type === "pr") {
      const [, , , prNumber] = item.match;
      parts.push(
        <Link
          key={`link-${key++}`}
          href={item.match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium transition-colors hover:underline"
        >
          PR#{prNumber}
        </Link>,
      );
    } else if (item.type === "mention") {
      const [, username] = item.match;
      parts.push(
        <Link
          key={`link-${key++}`}
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium transition-colors hover:underline"
        >
          @{username}
        </Link>,
      );
    }

    lastIndex = item.index + item.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// Headings
const headingFactory = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") =>
  function Heading({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    const id = useMemo(() => generateHeadingId(String(children)), [children]);
    return (
      <Tag
        id={id}
        className="text-foreground scroll-mt-24 font-semibold"
        {...props}
      >
        {children}
      </Tag>
    );
  };

const CustomH1 = headingFactory("h1");
const CustomH2 = headingFactory("h2");
const CustomH3 = headingFactory("h3");
const CustomH4 = headingFactory("h4");
const CustomH5 = headingFactory("h5");
const CustomH6 = headingFactory("h6");

// Paragraph
function CustomParagraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  // Check if children contains block-level elements (like code blocks)
  const hasBlockElements = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const type = child.type as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props = child.props as any;
      // Check if it's a code block (non-inline code)
      if (type?.name === "CustomCode" || props?.className?.includes("language-")) {
        return !props?.inline;
      }
    }
    return false;
  });

  const processedChildren = React.Children.map(children, (child) => {
    if (typeof child === "string") return <>{processText(child)}</>;
    return child;
  });

  // Use div if contains block elements to avoid hydration error
  if (hasBlockElements) {
    return (
      <div className="text-foreground my-4 leading-7" {...props}>
        {processedChildren}
      </div>
    );
  }

  return (
    <p className="text-foreground my-4 leading-7" {...props}>
      {processedChildren}
    </p>
  );
}

// Code
function CustomCode({
  inline,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "plaintext";
  const codeString = String(children).replace(/\n$/, "");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (inline) {
    return (
      <code
        className="bg-muted/50 rounded px-1.5 py-0.5 font-mono text-sm not-italic"
        style={{ quotes: 'none' }}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border">
      <div className="bg-muted flex items-center justify-between border-b border-border px-4 py-2 text-xs">
        <span className="text-muted-foreground font-mono tracking-wider uppercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-muted hover:text-foreground h-7 px-2 transition-colors"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={oneDark as any}
        language={language}
        PreTag="div"
        showLineNumbers
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.75rem",
          padding: "1rem",
          border: "none",
          boxShadow: "none",
          background: "#282c34",
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}

// Blockquote with GitHub-style alerts support
function CustomBlockquote({
  children,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  // Check if this is a GitHub-style alert
  let alertType: string | null = null;
  let alertContent: React.ReactNode = children;

  // Try to find [!NOTE] pattern in the blockquote content
  const childrenArray = React.Children.toArray(children);
  
  // Find the first non-whitespace React element
  const firstElementIndex = childrenArray.findIndex(
    child => React.isValidElement(child)
  );
  
  if (firstElementIndex !== -1) {
    const firstChild = childrenArray[firstElementIndex];
    
    if (React.isValidElement(firstChild)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childProps = firstChild.props as any;
      
      if (childProps?.children) {
        const childContent = React.Children.toArray(childProps.children);
        const firstText = childContent[0];
        
        // Check if first text contains the alert marker
        if (typeof firstText === "string") {
          const match = firstText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
          
          if (match) {
            alertType = match[1];
            
            // Remove the alert marker from the first text
            const newFirstText = firstText.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, "").trim();
            
            // Reconstruct the content without the marker
            const newChildContent = newFirstText 
              ? [newFirstText, ...childContent.slice(1)]
              : childContent.slice(1);
            
            // Create new first child with updated content
            const newFirstChild = newChildContent.length > 0
              ? React.cloneElement(firstChild, {
                  ...childProps,
                  children: newChildContent,
                })
              : null;
            
            // Reconstruct all children, keeping whitespace structure
            const newChildren = [...childrenArray];
            if (newFirstChild) {
              newChildren[firstElementIndex] = newFirstChild;
            } else {
              // Remove empty first child
              newChildren.splice(firstElementIndex, 1);
            }
            
            alertContent = newChildren;
          }
        }
      }
    }
  }

  const alertStyles = {
    NOTE: {
      border: "border-l-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      icon: "ℹ️",
      title: "Note",
    },
    TIP: {
      border: "border-l-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
      icon: "💡",
      title: "Tip",
    },
    IMPORTANT: {
      border: "border-l-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      icon: "❗",
      title: "Important",
    },
    WARNING: {
      border: "border-l-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      icon: "⚠️",
      title: "Warning",
    },
    CAUTION: {
      border: "border-l-red-500",
      bg: "bg-red-50 dark:bg-red-950/30",
      icon: "🚨",
      title: "Caution",
    },
  };

  if (alertType && alertStyles[alertType as keyof typeof alertStyles]) {
    const style = alertStyles[alertType as keyof typeof alertStyles];
    return (
      <blockquote
        className={`my-6 rounded-lg border border-l-4 p-5 ${style.border} ${style.bg} not-italic`}
        style={{ quotes: 'none' }}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl">{style.icon}</span>
          <div className="flex-1">
            <div className="font-semibold mb-1">{style.title}</div>
            <div className="text-foreground leading-relaxed">
              {alertContent}
            </div>
          </div>
        </div>
      </blockquote>
    );
  }

  return (
    <blockquote
      className="border-l-blue-600 bg-card my-6 rounded-lg border border-l-4 p-5 shadow-sm not-italic"
      style={{ quotes: 'none' }}
      {...props}
    >
      <div className="text-muted-foreground leading-relaxed">
        {children}
      </div>
    </blockquote>
  );
}

// Link
function CustomLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith("http");
  return (
    <Link
      href={href || "#"}
      className="text-primary font-medium transition-colors hover:underline"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}

// Lists
function CustomUl({
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className="marker:text-primary/70 my-4 ml-6 list-disc space-y-2"
      {...props}
    >
      {children}
    </ul>
  );
}

function CustomOl({
  children,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className="marker:text-primary/70 my-4 ml-6 list-decimal space-y-2 marker:font-semibold"
      {...props}
    >
      {children}
    </ol>
  );
}

function CustomLi({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className="text-foreground leading-7" {...props}>
      {children}
    </li>
  );
}

// Tables
function CustomTable({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="bg-card px-5 overflow-hidden rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <table className="divide-border min-w-full divide-y" {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

function CustomThead({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className="bg-muted/60" {...props}>
      {children}
    </thead>
  );
}

function CustomTbody({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className="divide-border bg-card divide-y" {...props}>
      {children}
    </tbody>
  );
}

function CustomTr({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="hover:bg-muted/40 transition-colors duration-150" {...props}>
      {children}
    </tr>
  );
}

function CustomTh({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="text-foreground px-8 py-2 text-left text-sm font-semibold"
      {...props}
    >
      {children}
    </th>
  );
}

function CustomTd({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="text-foreground px-8 py-2 text-sm" {...props}>
      {children}
    </td>
  );
}

// Horizontal rule
function CustomHr(props: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className="border-border my-8 border-t-2" {...props} />;
}

// Pre: Just pass through children to avoid prose styles
function CustomPre({
  children,
}: React.HTMLAttributes<HTMLPreElement>) {
  return <>{children}</>;
}

const components: Components = {
  img: CustomImage,
  code: CustomCode as Components["code"],
  pre: CustomPre as Components["pre"],
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
