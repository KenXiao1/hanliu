import Link from "next/link";
import { Github } from "lucide-react";

import { buildIssuePdfPagePath } from "@/lib/content/pdf";
import type { IssueManifest } from "@/lib/content/types";

export function SeriesHome({ issues }: { issues: IssueManifest[] }) {
  const featuredIssue = issues[0] ?? null;
  const hasSingleIssue = issues.length === 1 && featuredIssue;

  return (
    <div className="series-home">
      <section className="series-hero">
        <div className="series-copy">
          <p className="eyebrow">Celestial Reserve · 漢留</p>
          <h1>以星汉为经，以刊物为纬。</h1>
          <p>{hasSingleIssue ? "先从这一集开始，剩下的交给阅读本身。" : "每一集，一段新的旅程。"}</p>
          <div className="series-actions">
            {hasSingleIssue ? (
              <>
                <Link
                  href={buildIssuePdfPagePath(`/issues/${featuredIssue.issueId}`, featuredIssue.defaultLocale)}
                  className="hero-link"
                >
                  阅读 PDF
                </Link>
                <Link href={`/issues/${featuredIssue.issueId}`} className="hero-link hero-link-alt">
                  进入这一集
                </Link>
              </>
            ) : (
              <>
                <Link href="/issues" className="hero-link">
                  浏览全部期刊
                </Link>
                {featuredIssue ? (
                  <Link href={`/issues/${featuredIssue.issueId}`} className="hero-link hero-link-alt">
                    进入最新一集
                  </Link>
                ) : null}
              </>
            )}
          </div>
          <div className="series-social" aria-label="站外链接">
            <Link href="https://github.com/KenXiao1/hanliu" className="series-social-link" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={18} />
            </Link>
            <Link
              href="https://www.zhihu.com/column/c_1943336370526454758"
              className="series-social-link"
              target="_blank"
              rel="noreferrer"
              aria-label="知乎"
            >
              <ZhihuIcon />
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
              打开本集
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}

function ZhihuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="3" y="4" width="18" height="16" rx="4" fill="currentColor" opacity="0.14" />
      <path
        d="M8 8.25h6.9v1.6H8zm0 2.95h8v1.6H8zm0 2.95h6.25v1.6H8zm8.55-4.95H19v6.55h-2.45m0-6.55v6.55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
