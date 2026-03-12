# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hanliu Online Reader — a Next.js-based web reader for the Chinese periodical "涵流" (Celestial Reserve). It converts source PDFs into a navigable web experience with dual reading modes, Simplified/Traditional Chinese switching, light/dark theme, and Giscus-powered comments.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests (vitest)
npm run test:watch   # Watch mode tests
npx vitest run tests/site-context.test.ts  # Run a single test file

# Content pipeline (requires Python 3 + pymupdf + pypdf + opencc)
npm run extract:issue01
```

## Architecture

### Content Pipeline (Offline)

`scripts/pdf-extract/extract_issue.py` reads Simplified + Traditional PDF source files and generates:
- `data/issues/<issueId>/manifest.json` — issue metadata, article list, TOC
- `data/issues/<issueId>/pages.zh-Hans.json` / `pages.zh-Hant.json` — per-page text blocks and image refs
- `public/generated/<issueId>/` — rendered page JPGs and extracted images

### Data Layer (`lib/content/`)

- `types.ts` — core types: `IssueManifest`, `PageData`, `ArticleManifest`, `TextBlock`, `LocaleCode`
- `repository.ts` — reads pre-built JSON from disk, wrapped in `React.cache()` for request dedup
- `queries.ts` — derived queries (find article by slug, get pages for article range, etc.)
- `manifest.ts` — manifest validation and helpers

### Dual Routing (`lib/site-context.ts`, `lib/issue-routing.ts`)

Two parallel route trees serve the same content:
- **Subdomain-based**: `issue-01.example.com/article/slug` — routes in `app/`
- **Path-based**: `example.com/issues/issue-01/article/slug` — routes in `app/issues/[issueId]/`

`resolveSiteContext()` inspects the `Host` header to determine which mode is active. The `app/issues/` routes mirror `app/` routes for path-based access.

### Preferences (`lib/preferences.ts`, `lib/reader-state.ts`, `lib/url.ts`)

All reader settings (theme, script, mode, fontScale, pageZoom) live in **URL search params**, not cookies or client state. `PreferenceSync` (client component) applies them to the DOM and persists to `localStorage`. `ReaderToolbar` uses `router.replace()` to update params.

### Components (`components/site/`)

Server Components by default. Only three client components:
- `reader-toolbar.tsx` — settings panel (theme/script/zoom/font controls)
- `preference-sync.tsx` — syncs URL params → DOM attributes + localStorage
- `giscus-comments.tsx` — GitHub Discussions comment embed

### Styling

Single global CSS file (`app/globals.css`) with CSS custom properties. Light/dark theming via `[data-theme]` attribute. No Tailwind or CSS Modules. Responsive breakpoints at 1024px and 768px.

### Fonts

Two Google Fonts loaded via `next/font`: LXGW WenKai TC (body) and Noto Serif TC (display/headings).

## Key Conventions

- TypeScript strict mode, `@/*` path alias from project root
- No `allowJs` — all source is TypeScript
- Route pages: `PascalCase` default exports. Components: named `PascalCase` exports. Lib: `camelCase` functions
- Images are served unoptimized (`next.config.ts`: `images.unoptimized: true`)
- Environment variables for Giscus are in `.env.local` (NEXT_PUBLIC_GISCUS_*)
- Tests live in `tests/` directory, using vitest + jsdom
