"use client";

import { Fragment, startTransition } from "react";

import Link from "next/link";
import { Languages, MoonStar, SunMedium, Type } from "lucide-react";

import { useReaderPreferences } from "@/components/site/preference-sync";
import type { StandaloneStory } from "@/lib/content/stories";
import { clampFontScale } from "@/lib/reader-state";
import type { ReaderPreferences } from "@/lib/preferences";
import { withSearchParams } from "@/lib/url";

type StoryBlock =
  | { type: "heading"; level: number; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "rule" };

export function StandaloneStoryView({
  story,
  preferences
}: {
  story: StandaloneStory;
  preferences: ReaderPreferences;
}) {
  const { preferences: activePreferences, updatePreferences } = useReaderPreferences(preferences);
  const locale = story.locales[activePreferences.script];
  const blocks = parseMarkdown(locale.markdown);
  const title = activePreferences.script === "zh-Hant" ? story.titleHant : story.titleHans;
  const summary = activePreferences.script === "zh-Hant" ? story.summaryHant : story.summaryHans;

  const replaceCurrent = (patch: Partial<ReaderPreferences>) => {
    startTransition(() => {
      updatePreferences(patch);
    });
  };

  return (
    <div className="series-home standalone-story-shell">
      <header className="page-banner">
        <p className="eyebrow">站内文章</p>
        <h1>{title}</h1>
        <p>{summary}</p>
        <div className="series-actions">
          <Link href={withSearchParams("/", activePreferences)} className="hero-link hero-link-alt">
            返回主页
          </Link>
          {locale.sourceUrl ? (
            <a href={locale.sourceUrl} className="hero-link" target="_blank" rel="noreferrer">
              查看知乎原文
            </a>
          ) : null}
        </div>
      </header>

      <div className="reader-toolbar">
        <div className="toolbar-group toolbar-nav">
          <span className="toolbar-link is-current">{locale.title}</span>
        </div>

        <div className="toolbar-group toolbar-actions">
          <button
            type="button"
            className="toolbar-link toolbar-theme-toggle"
            onClick={() => replaceCurrent({ theme: activePreferences.theme === "light" ? "dark" : "light" })}
            aria-label={activePreferences.theme === "light" ? "切换到夜读" : "切换到日读"}
          >
            {activePreferences.theme === "light" ? <MoonStar size={16} /> : <SunMedium size={16} />}
          </button>

          <div className="toolbar-control-group" aria-label="文字切换" role="group">
            <button
              type="button"
              className={activePreferences.script === "zh-Hans" ? "toolbar-chip is-active" : "toolbar-chip"}
              onClick={() => replaceCurrent({ script: "zh-Hans" })}
            >
              <Languages size={15} />
              简
            </button>
            <button
              type="button"
              className={activePreferences.script === "zh-Hant" ? "toolbar-chip is-active" : "toolbar-chip"}
              onClick={() => replaceCurrent({ script: "zh-Hant" })}
            >
              繁
            </button>
          </div>

          <div className="toolbar-control-group" aria-label="字号调节" role="group">
            <button
              type="button"
              className="toolbar-chip"
              onClick={() => replaceCurrent({ fontScale: clampFontScale(activePreferences.fontScale - 0.1) })}
            >
              <Type size={15} />
              小
            </button>
            <button type="button" className="toolbar-chip is-active">
              {Math.round(clampFontScale(activePreferences.fontScale) * 100)}%
            </button>
            <button
              type="button"
              className="toolbar-chip"
              onClick={() => replaceCurrent({ fontScale: clampFontScale(activePreferences.fontScale + 0.1) })}
            >
              大
            </button>
          </div>
        </div>
      </div>

      <article
        className="article-sheet standalone-story-sheet"
        style={{ ["--article-font-scale" as string]: String(activePreferences.fontScale) }}
      >
        <div className="standalone-story-meta">
          <span>{locale.sourcePath}</span>
        </div>

        <div className="standalone-story-content">
          {blocks.map((block, index) => {
            if (block.type === "rule") {
              return <hr key={`block-${index}`} className="story-rule" />;
            }

            if (block.type === "heading") {
              const Tag = block.level >= 3 ? "h3" : "h2";

              return (
                <Tag key={`block-${index}`} className="standalone-story-heading">
                  {renderInline(block.content)}
                </Tag>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={`block-${index}`} className="standalone-story-list">
                  {block.items.map((item, itemIndex) => (
                    <li key={`item-${itemIndex}`}>{renderInline(item)}</li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={`block-${index}`} className="standalone-story-paragraph">
                {renderInline(block.content)}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}

function parseMarkdown(markdown: string): StoryBlock[] {
  const blocks: StoryBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    blocks.push({
      type: "paragraph",
      content: paragraph.join(" ")
    });
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) {
      return;
    }

    blocks.push({
      type: "list",
      items: list
    });
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^(\*\s*){3,}$/.test(trimmed) || /^-{3,}$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "rule" });
      continue;
    }

    const headingMatch = trimmed.match(/^(#{2,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        content: headingMatch[2]
      });
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      list.push(listMatch[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function renderInline(content: string) {
  const normalized = content.replace(/\\_/g, "_");
  const nodes: Array<{ type: "text" | "link" | "strong" | "em"; value: string; href?: string }> = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

  let lastIndex = 0;
  for (const match of normalized.matchAll(pattern)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push({
        type: "text",
        value: normalized.slice(lastIndex, index)
      });
    }

    if (match[1] && match[2]) {
      nodes.push({
        type: "link",
        value: match[1],
        href: match[2]
      });
    } else if (match[3]) {
      nodes.push({
        type: "strong",
        value: match[3]
      });
    } else if (match[4]) {
      nodes.push({
        type: "em",
        value: match[4]
      });
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    nodes.push({
      type: "text",
      value: normalized.slice(lastIndex)
    });
  }

  return nodes.map((node, index) => {
    if (node.type === "link" && node.href) {
      const isExternal = /^https?:\/\//.test(node.href);

      return (
        <a
          key={`inline-${index}`}
          href={node.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="story-inline-link"
        >
          {node.value}
        </a>
      );
    }

    if (node.type === "strong") {
      return <strong key={`inline-${index}`}>{node.value}</strong>;
    }

    if (node.type === "em") {
      return <em key={`inline-${index}`}>{node.value}</em>;
    }

    return <Fragment key={`inline-${index}`}>{node.value}</Fragment>;
  });
}
