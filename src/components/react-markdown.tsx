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
			hash = ((hash << 5) - hash) + text.charCodeAt(i);
			hash = hash & hash;
		}
		id = `heading-${Math.abs(hash).toString(36)}`;
	}

	return id;
}

// Image: use native img for shields.io, otherwise Next/Image
function CustomImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
	if (!src) return null;

	if (typeof src === "string" && src.includes("img.shields.io")) {
		return <img src={src} alt={alt || ""} className="object-contain" {...props} />;
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

	const compareRegex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^/\s]+)\.\.\.([^/\s]+)/g;
	const prRegex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/g;
	const mentionRegex = /@([a-zA-Z0-9_-]+)/g;

	const patterns = [
		{ regex: compareRegex, type: "compare" },
		{ regex: prRegex, type: "pr" },
		{ regex: mentionRegex, type: "mention" },
	];

	const matches: Array<{ index: number; length: number; match: RegExpExecArray; type: string }> = [];

	patterns.forEach(({ regex, type }) => {
		regex.lastIndex = 0;
		let match;
		while ((match = regex.exec(text)) !== null) {
			matches.push({ index: match.index, length: match[0].length, match, type });
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
					className="text-primary hover:underline font-medium transition-colors"
				>
					{from}...{to}
				</Link>
			);
		} else if (item.type === "pr") {
			const [, , , prNumber] = item.match;
			parts.push(
				<Link
					key={`link-${key++}`}
					href={item.match[0]}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary hover:underline font-medium transition-colors"
				>
					PR#{prNumber}
				</Link>
			);
		} else if (item.type === "mention") {
			const [, username] = item.match;
			parts.push(
				<Link
					key={`link-${key++}`}
					href={`https://github.com/${username}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary hover:underline font-medium transition-colors"
				>
					@{username}
				</Link>
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
	function Heading({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
		const id = useMemo(() => generateHeadingId(String(children)), [children]);
		return (
			<Tag id={id} className="scroll-mt-24 font-semibold text-foreground" {...props}>
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
function CustomParagraph({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p className="my-4 leading-7 text-foreground" {...props}>
			{React.Children.map(children, (child) => {
				if (typeof child === "string") return <>{processText(child)}</>;
				return child;
			})}
		</p>
	);
}

// Code
function CustomCode({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
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
			<code className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>
				{children}
			</code>
		);
	}

	return (
		<div className="my-6 overflow-hidden rounded-lg border bg-card shadow-sm">
			<div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2 text-xs">
				<span className="font-mono uppercase tracking-wider text-muted-foreground">{language}</span>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					onClick={copyToClipboard}
				>
					{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
				</Button>
			</div>
			<SyntaxHighlighter
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				style={oneDark as any}
				language={language}
				PreTag="div"
				showLineNumbers
				customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.75rem", padding: "1rem" }}
				{...props}
			>
				{codeString}
			</SyntaxHighlighter>
		</div>
	);
}

// Blockquote
function CustomBlockquote({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
	return (
		<blockquote className="my-6 rounded-lg border border-l-4 border-l-primary/80 bg-card p-5 shadow-sm" {...props}>
			<div className="italic leading-relaxed text-muted-foreground">{children}</div>
		</blockquote>
	);
}

// Link
function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const isExternal = href?.startsWith("http");
	return (
		<Link
			href={href || "#"}
			className="font-medium text-primary transition-colors hover:underline"
			target={isExternal ? "_blank" : undefined}
			rel={isExternal ? "noopener noreferrer" : undefined}
			{...props}
		>
			{children}
		</Link>
	);
}

// Lists
function CustomUl({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) {
	return (
		<ul className="my-4 ml-6 list-disc space-y-2 marker:text-primary/70" {...props}>
			{children}
		</ul>
	);
}

function CustomOl({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) {
	return (
		<ol className="my-4 ml-6 list-decimal space-y-2 marker:text-primary/70 marker:font-semibold" {...props}>
			{children}
		</ol>
	);
}

function CustomLi({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) {
	return (
		<li className="leading-7 text-foreground" {...props}>
			{children}
		</li>
	);
}

// Tables
function CustomTable({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
	return (
		<div className="my-6 overflow-hidden rounded-lg border bg-card shadow-sm">
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
		<thead className="bg-muted/60" {...props}>
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
		<tr className="transition-colors duration-150 hover:bg-muted/40" {...props}>
			{children}
		</tr>
	);
}

function CustomTh({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
	return (
		<th className="px-6 py-3.5 text-left text-sm font-semibold text-foreground" {...props}>
			{children}
		</th>
	);
}

function CustomTd({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
	return (
		<td className="px-6 py-3.5 text-sm text-foreground" {...props}>
			{children}
		</td>
	);
}

// Horizontal rule
function CustomHr(props: React.HTMLAttributes<HTMLHRElement>) {
	return <hr className="my-8 border-t-2 border-border" {...props} />;
}

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

export function CustomReactMarkdown({ children, className }: CustomReactMarkdownProps) {
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

