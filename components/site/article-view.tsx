"use client";

import Image from "next/image";

import { LazyGiscusComments } from "@/components/site/lazy-giscus";
import { useReaderPreferences } from "@/components/site/preference-sync";
import { buildArticlePageLayout } from "@/lib/content/article-layout";
import type { ArticleView as ArticleViewModel } from "@/lib/content/queries";
import type { ReaderPreferences } from "@/lib/preferences";

export function ArticleView({
  view,
  preferences
}: {
  view: ArticleViewModel;
  preferences: ReaderPreferences;
}) {
  const { preferences: activePreferences } = useReaderPreferences(preferences);
  const localePages = view.locales[activePreferences.script].pages;
  const title = activePreferences.script === "zh-Hant" ? view.article.titleHant : view.article.titleHans;
  const pageSections = mergeCrossPageBodyContinuations(
    localePages.map((page) => {
      const sectionLinks = view.toc.filter((entry) => entry.page === page.pageNumber);

      return {
        page,
        sectionLinks,
        pageLayout: buildArticlePageLayout(page, {
          isArticleStartPage: page.pageNumber === view.article.startPage,
          hiddenTitles: [
            ...(page.pageNumber === view.article.startPage ? [title] : []),
            ...sectionLinks.map((entry) => (activePreferences.script === "zh-Hant" ? entry.titleHant : entry.titleHans))
          ]
        })
      };
    })
  );

  return (
    <div className="article-layout">
      <article className="article-sheet" style={{ ["--article-font-scale" as string]: String(activePreferences.fontScale) }}>
        <header className="page-banner article-banner">
          <p className="eyebrow">文章模式</p>
          <h1>{title}</h1>
          <p>连续展开全文，保留章节定位。</p>
        </header>

        <div className="article-columns">
          <aside className="article-toc">
            <h2>本文目录</h2>
            <ol>
              {view.toc.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{activePreferences.script === "zh-Hant" ? entry.titleHant : entry.titleHans}</a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="article-pages">
            {pageSections.map(({ page, sectionLinks, pageLayout }) => {
              return (
                <section key={page.pageId} className="article-page-section">
                  {sectionLinks.map((entry) => (
                    <div key={entry.id} id={entry.id} className="section-anchor">
                      {activePreferences.script === "zh-Hant" ? entry.titleHant : entry.titleHans}
                    </div>
                  ))}

                  {pageLayout.pageNote ? (
                    <div className="article-page-note">
                      <span>{pageLayout.pageNote.text}</span>
                      {pageLayout.pageNote.marker ? <sup>{pageLayout.pageNote.marker}</sup> : null}
                    </div>
                  ) : null}

                  <div className="article-blocks">
                    {pageLayout.bodyBlocks.map((block, index) => (
                      <p key={`${page.pageId}-${index}`}>{renderBodyBlock(block.text, block.trailingMarker, pageLayout.footnotes.map((footnote) => footnote.marker).filter((marker): marker is string => Boolean(marker)))}</p>
                    ))}
                  </div>

                  {pageLayout.footnotes.length > 0 ? (
                    <ol className="article-footnotes">
                      {pageLayout.footnotes.map((footnote, index) => (
                        <li key={`${page.pageId}-footnote-${index}`}>
                          {footnote.marker ? <span className="article-footnote-marker">{footnote.marker}</span> : null}
                          <span>{footnote.text}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}

                  {page.images.length > 0 ? (
                    <div className="article-gallery">
                      {page.images.map((image) => (
                        <figure key={image.src}>
                          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 1024px) 100vw, 700px" />
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </div>
      </article>

      <section className="discussion-section">
        <div className="page-banner">
          <p className="eyebrow">文章讨论</p>
          <h2>围绕本篇的讨论</h2>
        </div>
        <LazyGiscusComments threadId={view.article.commentThreadId} />
      </section>
    </div>
  );
}

function renderBodyBlock(text: string, trailingMarker: string | undefined, footnoteMarkers: string[]) {
  const content = renderInlineFootnoteMarkers(text, footnoteMarkers);

  if (!trailingMarker) {
    return content;
  }

  return (
    <>
      {content}
      <sup>{trailingMarker}</sup>
    </>
  );
}

function renderInlineFootnoteMarkers(text: string, footnoteMarkers: string[]) {
  if (footnoteMarkers.length === 0) {
    return text;
  }

  const markerPattern = footnoteMarkers
    .toSorted((left, right) => right.length - left.length)
    .map(escapeForRegex)
    .join("|");

  if (!markerPattern) {
    return text;
  }

  const markerPatternRegex = new RegExp(`(^|[。；，、：「」『』》）])(${markerPattern})(?=[\\u3400-\\u9FFF「『（《〈【])`, "gu");
  const nodes: Array<string | JSX.Element> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(markerPatternRegex)) {
    const index = match.index ?? 0;
    const prefix = match[1] ?? "";
    const marker = match[2] ?? "";

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (prefix) {
      nodes.push(prefix);
    }

    nodes.push(
      <sup key={`inline-footnote-${index}-${marker}`}>
        {marker}
      </sup>
    );

    lastIndex = index + match[0].length;
  }

  if (nodes.length === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mergeCrossPageBodyContinuations(
  pageSections: Array<{
    page: ArticleViewModel["locales"][keyof ArticleViewModel["locales"]]["pages"][number];
    sectionLinks: ArticleViewModel["toc"];
    pageLayout: ReturnType<typeof buildArticlePageLayout>;
  }>
) {
  const mergedSections = pageSections.map((section) => ({
    ...section,
    pageLayout: {
      ...section.pageLayout,
      bodyBlocks: section.pageLayout.bodyBlocks.map((block) => ({ ...block })),
      footnotes: section.pageLayout.footnotes.map((footnote) => ({ ...footnote }))
    }
  }));

  for (let index = 1; index < mergedSections.length; index += 1) {
    const previousSection = mergedSections[index - 1];
    const currentSection = mergedSections[index];
    const previousLastBlock = previousSection.pageLayout.bodyBlocks.at(-1);
    const currentFirstBlock = currentSection.pageLayout.bodyBlocks[0];

    if (!previousLastBlock || !currentFirstBlock) {
      continue;
    }

    if (currentSection.sectionLinks.length > 0 || previousLastBlock.trailingMarker || /[。！？；:：]$/.test(previousLastBlock.text)) {
      continue;
    }

    previousLastBlock.text = mergeContinuedText(previousLastBlock.text, currentFirstBlock.text);
    previousLastBlock.trailingMarker = currentFirstBlock.trailingMarker ?? previousLastBlock.trailingMarker;
    currentSection.pageLayout.bodyBlocks = currentSection.pageLayout.bodyBlocks.slice(1);
  }

  return mergedSections;
}

function mergeContinuedText(left: string, right: string) {
  if (/[A-Za-z0-9]$/.test(left) && /^[A-Za-z0-9]/.test(right)) {
    return `${left} ${right}`;
  }

  return `${left}${right}`;
}
