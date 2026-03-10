import { notFound } from "next/navigation";

import { PageView } from "@/components/site/page-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { getIssueManifest, getPageView } from "@/lib/content/repository";
import { parsePreferences } from "@/lib/preferences";

type IssuePageFallbackReaderProps = {
  params: Promise<{ issueId: string; page: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IssuePageFallbackReader({
  params,
  searchParams
}: IssuePageFallbackReaderProps) {
  const [{ issueId, page }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber)) {
    notFound();
  }

  const preferences = parsePreferences(resolvedSearchParams);
  const [issue, view] = await Promise.all([getIssueManifest(issueId).catch(() => null), getPageView(issueId, pageNumber)]);

  if (!issue) {
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
        alternateModePath={view.article ? `${issueRoot}/article/${view.article.slug}` : `${issueRoot}/toc`}
        currentRouteKind="layout"
      >
        <PageView pageView={view} issueRoot={issueRoot} preferences={preferences} />
      </IssueShell>
    </>
  );
}
