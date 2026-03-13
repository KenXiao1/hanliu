"use client";

import Link from "next/link";

import { useReaderPreferences } from "@/components/site/preference-sync";
import { buildIssuePdfPagePath } from "@/lib/content/pdf";
import type { IssueManifest, LocaleCode } from "@/lib/content/types";
import { withSearchParams } from "@/lib/url";

export function TocView({
  issue,
  issueRoot,
  script
}: {
  issue: IssueManifest;
  issueRoot: string;
  script: LocaleCode;
}) {
  const { preferences } = useReaderPreferences({
    theme: "light",
    script,
    fontScale: 1
  });
  const articleByPage = new Map(issue.articles.map((article) => [article.startPage, article]));

  return (
    <div className="toc-view">
      <header className="page-banner">
        <p className="eyebrow">目录</p>
        <h1>第一集结构总览</h1>
      </header>

      <ol className="toc-list">
        {issue.toc.map((entry, index) => {
          const article = articleByPage.get(entry.page);
          const href = article
            ? withSearchParams(`${issueRoot}/article/${article.slug}`, preferences)
            : buildIssuePdfPagePath(issueRoot, preferences.script, preferences.theme);

          return (
            <li key={`${entry.page}-${index}`} className={`toc-item level-${entry.level}`}>
              <Link href={href}>
                <span>{preferences.script === "zh-Hant" ? entry.titleHant : entry.titleHans}</span>
                <span>{entry.page}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
