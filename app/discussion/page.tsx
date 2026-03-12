import { notFound } from "next/navigation";

import { DiscussionView } from "@/components/site/discussion-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { getIssueManifest } from "@/lib/content/repository";
import { resolveImplicitIssueId } from "@/lib/issue-routing";
import { parsePreferences } from "@/lib/preferences";

type DiscussionPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DiscussionPage({ searchParams }: DiscussionPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const preferences = parsePreferences(resolvedSearchParams);
  const issueId = await resolveImplicitIssueId("/discussion");
  const issue = await getIssueManifest(issueId).catch(() => null);

  if (!issue) {
    notFound();
  }

  return (
    <PreferenceSync preferences={preferences}>
      <IssueShell
        issue={issue}
        preferences={preferences}
        issueHomePath="/"
        tocPath="/toc"
        discussionPath="/discussion"
        currentRouteKind="discussion"
      >
        <DiscussionView threadId={issue.issueId} />
      </IssueShell>
    </PreferenceSync>
  );
}
