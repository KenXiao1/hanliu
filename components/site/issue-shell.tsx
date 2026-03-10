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
  alternateModePath: string;
  currentRouteKind: "article" | "layout" | "toc" | "issue";
  children: ReactNode;
};

export function IssueShell({
  issue,
  preferences,
  issueHomePath,
  tocPath,
  discussionPath,
  alternateModePath,
  currentRouteKind,
  children
}: IssueShellProps) {
  return (
    <div className="issue-shell">
      <header className="site-header">
        <Link href={issueHomePath} className="site-mark">
          <span className="site-mark-kicker">Celestial Reserve</span>
          <strong>{issue.title}</strong>
          <span>{issue.subtitle}</span>
        </Link>
        <p className="site-mark-copy">
          以刊物质感保留原版排印，以网页阅读重释长文。主题、简繁、目录与评论同域协作。
        </p>
      </header>

      <ReaderToolbar
        issueHomePath={issueHomePath}
        tocPath={tocPath}
        discussionPath={discussionPath}
        alternateModePath={alternateModePath}
        preferences={preferences}
        currentRouteKind={currentRouteKind}
      />

      <main className="issue-content">{children}</main>
    </div>
  );
}
