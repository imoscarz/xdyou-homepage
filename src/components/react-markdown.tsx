import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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

  if (!inline && language) {
    return (
      <SyntaxHighlighter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={oneDark as any}
        language={language}
        PreTag="div"
        showLineNumbers={true}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

// Custom Heading components with auto-generated IDs
function CustomH1({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return <h1 id={id} className="scroll-mt-24" {...props}>{children}</h1>;
}

function CustomH2({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>;
}

function CustomH3({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>;
}

function CustomH4({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return <h4 id={id} className="scroll-mt-24" {...props}>{children}</h4>;
}

function CustomH5({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return <h5 id={id} className="scroll-mt-24" {...props}>{children}</h5>;
}

function CustomH6({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = String(children);
  const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
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
    <p {...props}>
      {React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <>{processText(child)}</>;
        }
        return child;
      })}
    </p>
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
};

export function CustomReactMarkdown({
  children,
  className,
}: CustomReactMarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
