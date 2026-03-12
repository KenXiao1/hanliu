import Link from "next/link";

import type { IssueManifest } from "@/lib/content/types";

export function SeriesHome({ issues }: { issues: IssueManifest[] }) {
  return (
    <div className="series-home">
      <section className="series-hero">
        <div className="series-copy">
          <p className="eyebrow">Celestial Reserve · 漢留</p>
          <h1>以星汉为经，以刊物为纬。</h1>
          <p>每一集，一段新的旅程。</p>
          <div className="series-actions">
            <Link href="/issues" className="hero-link">
              浏览全集入口
            </Link>
            <Link href="/issues/issue-01" className="hero-link hero-link-alt">
              进入第一集
            </Link>
          </div>
        </div>
      </section>

      <section className="issue-grid">
        {issues.map((issue) => (
          <article key={issue.issueId} className="issue-card">
            <p className="issue-card-kicker">{issue.issueId}</p>
            <h2>{issue.title}</h2>
            <p>{issue.subtitle}</p>
            <dl>
              <div>
                <dt>页数</dt>
                <dd>{issue.pageCount}</dd>
              </div>
              <div>
                <dt>文章</dt>
                <dd>{issue.articles.length}</dd>
              </div>
            </dl>
            <Link href={`/issues/${issue.issueId}`} className="hero-link">
              阅读这一集
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
