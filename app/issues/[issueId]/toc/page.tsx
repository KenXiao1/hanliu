import { notFound } from "next/navigation";

import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { TocView } from "@/components/site/toc-view";
import { getIssueManifest } from "@/lib/content/repository";
import { parsePreferences } from "@/lib/preferences";

type IssueTocFallbackPageProps = {
  params: Promise<{ issueId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IssueTocFallbackPage({ params, searchParams }: IssueTocFallbackPageProps) {
  const [{ issueId }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const preferences = parsePreferences(resolvedSearchParams);
  const issue = await getIssueManifest(issueId).catch(() => null);

  if (!issue) {
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
        currentRouteKind="toc"
      >
        <TocView issue={issue} issueRoot={issueRoot} script={preferences.script} />
      </IssueShell>
    </PreferenceSync>
  );
}
