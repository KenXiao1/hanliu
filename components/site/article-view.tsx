import Image from "next/image";
import Link from "next/link";

import { GiscusComments } from "@/components/site/giscus-comments";
import type { ArticleView as ArticleViewModel } from "@/lib/content/queries";
import type { ReaderPreferences } from "@/lib/preferences";
import { withSearchParams } from "@/lib/url";

export function ArticleView({
  view,
  issueRoot,
  preferences
}: {
  view: ArticleViewModel;
  issueRoot: string;
  preferences: ReaderPreferences;
}) {
  const localePages = view.locales[preferences.script].pages;
  const title = preferences.script === "zh-Hant" ? view.article.titleHant : view.article.titleHans;

  return (
    <div className="article-layout">
      <article className="article-sheet" style={{ ["--article-font-scale" as string]: String(preferences.fontScale) }}>
        <header className="page-banner article-banner">
          <p className="eyebrow">文章模式</p>
          <h1>{title}</h1>
          <p>页 {view.pageRange}</p>
        </header>

        <div className="article-columns">
          <aside className="article-toc">
            <h2>本文目录</h2>
            <ol>
              {view.toc.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{preferences.script === "zh-Hant" ? entry.titleHant : entry.titleHans}</a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="article-pages">
            {localePages.map((page) => {
              const sectionLinks = view.toc.filter((entry) => entry.page === page.pageNumber);

              return (
                <section key={page.pageId} className="article-page-section">
                  <div className="article-page-meta">
                    <span>第 {page.pageNumber} 页</span>
                    <Link
                      href={withSearchParams(`${issueRoot}/read/page/${page.pageNumber}`, {
                        script: preferences.script,
                        theme: preferences.theme,
                        mode: "layout",
                        pageZoom: preferences.pageZoom
                      })}
                    >
                      查看原版式
                    </Link>
                  </div>

                  {sectionLinks.map((entry) => (
                    <div key={entry.id} id={entry.id} className="section-anchor">
                      {preferences.script === "zh-Hant" ? entry.titleHant : entry.titleHans}
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
                          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} />
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
        <GiscusComments threadId={view.article.commentThreadId} />
      </section>
    </div>
  );
}
