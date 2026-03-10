import Link from "next/link";

import type { IssueManifest } from "@/lib/content/types";

export function SeriesHome({ issues }: { issues: IssueManifest[] }) {
  return (
    <div className="series-home">
      <section className="series-hero">
        <div className="series-copy">
          <p className="eyebrow">Celestial Reserve · 漢留</p>
          <h1>以星汉为经，以刊物为纬。</h1>
          <p>
            这个站点按“系列主站 + 分集子域”设计。当前实现第一集的在线阅读、简繁切换、light/dark
            mode、目录导航与讨论区，并为后续各集保留统一的内容模型。
          </p>
          <div className="series-actions">
            <Link href="/issues" className="hero-link">
              浏览全集入口
            </Link>
            <Link href="/issues/issue-01" className="hero-link hero-link-alt">
              进入第一集
            </Link>
          </div>
        </div>
        <div className="series-orbit">
          <div className="orbit-disc" />
          <div className="orbit-callout">
            <span>子域设计</span>
            <strong>issue-01.&lt;root-domain&gt;</strong>
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
