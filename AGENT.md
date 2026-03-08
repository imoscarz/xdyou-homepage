# XDYou Homepage — Agent Instructions

## Quick Start

- **Package manager**: `pnpm` (do NOT use npm/yarn)
- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Node**: `>=18.18.0 <=22`

Run `pnpm lint` and `pnpm build` before every commit to verify correctness.

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript 5.9 + Tailwind CSS 4.1
- shadcn/ui (Radix UI) component library
- next-themes for light/dark/system theming

## Project Structure

```
src/
  app/              # Next.js routes (pages, API routes)
  components/
    ui/             # shadcn/ui primitives
    project/        # business-level components
    blocks/         # navbar, footer, layout blocks
    layout/         # PageHeader, page-level wrappers
  config/           # site.ts, project.ts, navbar.ts, footer.ts, contact.ts
  lib/
    i18n/           # locales/zh.json, locales/en.json, client.tsx, server.ts
    markdown-server.ts
    github.ts, docs.ts, news.ts, contributors.ts
    page-helpers.ts, api-helpers.ts, utils.tsx, env.ts
contents/
  docs/             # Markdown docs (slug = filename)
  news/             # Markdown news (slug = filename, date prefix required)
```

## Key Conventions

### Page Template

```tsx
import { PageHeader } from "@/components/layout/page-header";
import {
  generateSimpleMetadata,
  getPageI18n,
  PAGE_CONTAINER_CLASSES,
  type PageProps,
} from "@/lib/page-helpers";

export async function generateMetadata({ searchParams }: PageProps) {
  return generateSimpleMetadata(searchParams, "section.title", "section.description");
}

export default async function MyPage({ searchParams }: PageProps) {
  const { locale, dict } = await getPageI18n(searchParams);
  return (
    <main className={PAGE_CONTAINER_CLASSES.standard}>
      <PageHeader title={dict.section.title} description={dict.section.description} />
    </main>
  );
}
```

### PAGE_CONTAINER_CLASSES variants

| Key        | Use case                        |
| ---------- | ------------------------------- |
| `standard` | General pages (max-w-7xl)       |
| `article`  | Reading layout (max-w-4xl)      |
| `home`     | Homepage (larger spacing)       |
| `docs`     | Docs pages (no right margin for TOC) |

### Components

- **Server Components** by default (no `"use client"`)
- **Client Components**: add `"use client"` at top + use `-client.tsx` filename suffix
- Use `cn()` from `@/lib/utils.tsx` for class merging
- Reuse shadcn/ui components; avoid re-implementing primitives

### i18n

- **No hardcoded user-visible text** — all strings must come from i18n dictionaries
- Server: `getPageI18n(searchParams)` or `getDictionary(locale)`
- Client: `useDictionary()` and `useLocale()` hooks
- Localized text: `selectLocalizedText(locale, { en: "...", zh: "..." })`
- When adding new strings, update **both** `locales/en.json` and `locales/zh.json`
- If used client-side, also update the `Dictionary` type in `src/lib/i18n/client.tsx`

### Asset Patterns

Configure platform asset matching in `src/config/project.ts` → `assetPatterns`:

```typescript
assetPatterns: {
  android: [{ pattern: /app-arm64-v8a-release\.apk$/i, displayName: "ARM64" }],
}
```

### Markdown Content

**Docs** (`contents/docs/*.md`):
```md
---
title: "Title"
description: "Short description"
order: 10
category: "Category"
---
```

**News** (`contents/news/YYYY-MM-DD-slug-zh.md`):
```md
---
title: "Title"
date: "2026-01-01"
author: "Author"
tags: ["release", "news"]
lang: "zh"
---
```

## Images

- Use `next/image` for local and remote images (already configured)
- Use plain `<img>` only for external badge URLs (e.g., shields.io)
- Prefer WebP format

## Reports & Temp Files

Store all generated reports under `temp/reports/{type}/{date}/` (already gitignored).

## Pre-commit Checklist

1. `pnpm lint` — zero errors
2. `pnpm build` — successful build, all static pages generated
3. i18n: both `en.json` and `zh.json` updated for any new text
4. No hardcoded strings, no unused imports
