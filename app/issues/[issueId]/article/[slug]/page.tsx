import { notFound } from "next/navigation";

import { ArticleView } from "@/components/site/article-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { getArticleView, getIssueManifest } from "@/lib/content/repository";
import { parsePreferences } from "@/lib/preferences";

type IssueArticleFallbackPageProps = {
  params: Promise<{ issueId: string; slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IssueArticleFallbackPage({
  params,
  searchParams
}: IssueArticleFallbackPageProps) {
  const [{ issueId, slug }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const preferences = parsePreferences(resolvedSearchParams);
  const [issue, view] = await Promise.all([getIssueManifest(issueId).catch(() => null), getArticleView(issueId, slug)]);

  if (!issue || !view) {
    notFound();
  }

  const issueRoot = `/issues/${issueId}`;

  return (
    <>
      <PreferenceSync preferences={preferences} />
      <IssueShell
        issue={issue}
        preferences={preferences}
        issueHomePath={issueRoot}
        tocPath={`${issueRoot}/toc`}
        discussionPath={`${issueRoot}/discussion`}
        alternateModePath={`${issueRoot}/read/page/${view.article.startPage}`}
        currentRouteKind="article"
      >
        <ArticleView view={view} issueRoot={issueRoot} preferences={preferences} />
      </IssueShell>
    </>
  );
}
