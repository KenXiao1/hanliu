import Image from "next/image";
import Link from "next/link";

import type { IssueManifest, LocaleCode, PageData } from "@/lib/content/types";
import { getIssueCoverImageProps } from "@/lib/reader-images";
import { withSearchParams } from "@/lib/url";

export function IssueHome({
  issue,
  coverPage,
  script,
  issueHomePath,
  discussionPath
}: {
  issue: IssueManifest;
  coverPage: PageData;
  script: LocaleCode;
  issueHomePath: string;
  discussionPath: string;
}) {
  const coverImage = getIssueCoverImageProps({ viewport: coverPage.viewport });

  return (
    <div className="issue-home">
      <section className="issue-hero">
        <div className="issue-hero-media">
          <Image
            src={coverPage.renderedPageAsset}
            alt={`${issue.title} 封面`}
            className="cover-image"
            {...coverImage}
          />
        </div>
        <div className="issue-hero-copy">
          <p className="eyebrow">第一集在线阅读</p>
          <h1>{issue.title}</h1>
          <p className="issue-subtitle">{issue.subtitle}</p>
          <p>翻阅原版排印，或以文章形式细读。</p>
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
    </div>
  );
}
