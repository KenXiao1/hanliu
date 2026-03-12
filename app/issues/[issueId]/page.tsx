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
  const [issue, pagesHans, pagesHant] = await Promise.all([
    getIssueManifest(issueId).catch(() => null),
    getIssuePages(issueId, "zh-Hans").catch(() => null),
    getIssuePages(issueId, "zh-Hant").catch(() => null)
  ]);

  if (!issue || !pagesHans || !pagesHant) {
    notFound();
  }

  const issueRoot = `/issues/${issueId}`;

  return (
    <PreferenceSync preferences={preferences}>
      <IssueShell
        issue={issue}
        preferences={preferences}
        issueHomePath={issueRoot}
        tocPath={`${issueRoot}/toc`}
        discussionPath={`${issueRoot}/discussion`}
        currentRouteKind="issue"
      >
        <IssueHome
          issue={issue}
          coverPages={{
            "zh-Hans": pagesHans[0],
            "zh-Hant": pagesHant[0]
          }}
          issueHomePath={issueRoot}
          discussionPath={`${issueRoot}/discussion`}
        />
      </IssueShell>
    </PreferenceSync>
  );
}
