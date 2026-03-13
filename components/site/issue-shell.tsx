import Link from "next/link";
import type { ReactNode } from "react";

import { ReaderToolbar } from "@/components/site/reader-toolbar";
import type { IssueManifest } from "@/lib/content/types";
import type { ReaderPreferences } from "@/lib/preferences";

type IssueShellProps = {
  issue: IssueManifest;
  preferences: ReaderPreferences;
  issueHomePath: string;
  tocPath: string;
  discussionPath: string;
  currentRouteKind: "article" | "toc" | "issue" | "discussion" | "pdf";
  children: ReactNode;
};

export function IssueShell({
  issue,
  preferences,
  issueHomePath,
  tocPath,
  discussionPath,
  currentRouteKind,
  children
}: IssueShellProps) {
  return (
    <div className="issue-shell">
      <header className="site-header">
        <Link href="/" className="site-mark">
          <span className="site-mark-kicker">Celestial Reserve</span>
          <strong>{issue.title}</strong>
          <span>{issue.subtitle}</span>
        </Link>
        <p className="site-mark-copy">
          PDF 原文与长文整理，在此并读。
        </p>
      </header>

      <ReaderToolbar
        issueHomePath={issueHomePath}
        tocPath={tocPath}
        discussionPath={discussionPath}
        preferences={preferences}
        currentRouteKind={currentRouteKind}
      />

      <main className="issue-content">{children}</main>
    </div>
  );
}
