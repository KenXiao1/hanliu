import { notFound } from "next/navigation";

import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueHome } from "@/components/site/issue-home";
import { IssueShell } from "@/components/site/issue-shell";
import { getIssueManifest, getIssuePages } from "@/lib/content/repository";
import { parsePreferences } from "@/lib/preferences";

type IssueFallbackPageProps = {
  params: Promise<{ issueId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IssueFallbackPage({ params, searchParams }: IssueFallbackPageProps) {
  const [{ issueId }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const preferences = parsePreferences(resolvedSearchParams);
  const [issue, pages] = await Promise.all([
    getIssueManifest(issueId).catch(() => null),
    getIssuePages(issueId, preferences.script).catch(() => null)
  ]);

  if (!issue || !pages) {
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
        alternateModePath={issue.articles[0] ? `${issueRoot}/article/${issue.articles[0].slug}` : `${issueRoot}/toc`}
        currentRouteKind="issue"
      >
        <IssueHome
          issue={issue}
          coverPage={pages[0]}
          script={preferences.script}
          issueHomePath={issueRoot}
          tocPath={`${issueRoot}/toc`}
          discussionPath={`${issueRoot}/discussion`}
        />
      </IssueShell>
    </>
  );
}
