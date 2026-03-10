import Image from "next/image";
import Link from "next/link";

import type { IssueManifest, LocaleCode, PageData } from "@/lib/content/types";
import { withSearchParams } from "@/lib/url";

export function IssueHome({
  issue,
  coverPage,
  script,
  issueHomePath,
  tocPath,
  discussionPath
}: {
  issue: IssueManifest;
  coverPage: PageData;
  script: LocaleCode;
  issueHomePath: string;
  tocPath: string;
  discussionPath: string;
}) {
  return (
    <div className="issue-home">
      <section className="issue-hero">
        <div className="issue-hero-media">
          <Image
            src={coverPage.renderedPageAsset}
            alt={`${issue.title} 封面`}
            className="cover-image"
            width={Math.round(coverPage.viewport.width * 2)}
            height={Math.round(coverPage.viewport.height * 2)}
            priority
          />
        </div>
        <div className="issue-hero-copy">
          <p className="eyebrow">第一集在线阅读</p>
          <h1>{issue.title}</h1>
          <p className="issue-subtitle">{issue.subtitle}</p>
          <p>
            采用双阅读模式。`版式模式`保留原刊图文气息，`文章模式`提供长文重排、字号调节与移动端舒适阅读。
          </p>
          <div className="series-actions">
            <Link
              href={withSearchParams(`${issueHomePath.replace(/\/$/, "")}/read/page/1`, {
                script,
                mode: "layout"
              })}
              className="hero-link"
            >
              从封面开始
            </Link>
            <Link
              href={withSearchParams(`${issueHomePath.replace(/\/$/, "")}/toc`, {
                script,
                mode: "article"
              })}
              className="hero-link hero-link-alt"
            >
              打开目录
            </Link>
          </div>
          <dl className="issue-stats">
            <div>
              <dt>页数</dt>
              <dd>{issue.pageCount}</dd>
            </div>
            <div>
              <dt>文章</dt>
              <dd>{issue.articles.length}</dd>
            </div>
            <div>
              <dt>讨论</dt>
              <dd>
                <Link href={discussionPath}>整集评论区</Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="article-ribbon">
        {issue.articles.map((article, index) => (
          <article key={article.articleId} className="article-ribbon-card">
            <p>{String(index + 1).padStart(2, "0")}</p>
            <h2>{script === "zh-Hant" ? article.titleHant : article.titleHans}</h2>
            <span>
              {article.startPage}-{article.endPage}
            </span>
            <Link href={withSearchParams(`${issueHomePath.replace(/\/$/, "")}/article/${article.slug}`, { script, mode: "article" })}>
              进入文章
            </Link>
          </article>
        ))}
      </section>

      <section className="issue-panels">
        <div className="issue-panel">
          <h3>目录与结构</h3>
          <p>沿用 PDF 书签层级，整集目录和文章内目录分开呈现，后续各集可复用同一结构。</p>
          <Link href={tocPath}>查看全集目录</Link>
        </div>
        <div className="issue-panel">
          <h3>简繁切换</h3>
          <p>简繁内容并行抽取，自同一路由切换，保持当前文章或当前页不丢失。</p>
        </div>
        <div className="issue-panel">
          <h3>评论区</h3>
          <p>整集与单篇文章各自持有 `giscus` 讨论串，简繁页面共用线程。</p>
          <Link href={discussionPath}>进入整集讨论</Link>
        </div>
      </section>
    </div>
  );
}
