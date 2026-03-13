"use client";

import Image from "next/image";

import { LazyGiscusComments } from "@/components/site/lazy-giscus";
import { useReaderPreferences } from "@/components/site/preference-sync";
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
            {localePages.map((page) => {
              const sectionLinks = view.toc.filter((entry) => entry.page === page.pageNumber);

              return (
                <section key={page.pageId} className="article-page-section">
                  {sectionLinks.map((entry) => (
                    <div key={entry.id} id={entry.id} className="section-anchor">
                      {activePreferences.script === "zh-Hant" ? entry.titleHant : entry.titleHans}
                    </div>
                  ))}

                  <div className="article-blocks">
                    {page.textBlocks.map((block, index) => (
                      <p key={`${page.pageId}-${index}`}>{block.text}</p>
                    ))}
                  </div>

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
