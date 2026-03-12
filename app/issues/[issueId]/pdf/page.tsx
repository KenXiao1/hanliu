import { notFound } from "next/navigation";

import { PdfView } from "@/components/site/pdf-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { getIssueManifest } from "@/lib/content/repository";
import { parsePreferences } from "@/lib/preferences";

type IssuePdfPageProps = {
  params: Promise<{ issueId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IssuePdfPage({ params, searchParams }: IssuePdfPageProps) {
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
        currentRouteKind="pdf"
      >
        <PdfView issueId={issueId} issueTitle={issue.title} />
      </IssueShell>
    </PreferenceSync>
  );
}
