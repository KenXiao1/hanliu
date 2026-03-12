import { notFound } from "next/navigation";

import { PdfView } from "@/components/site/pdf-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { getIssueManifest } from "@/lib/content/repository";
import { resolveImplicitIssueId } from "@/lib/issue-routing";
import { parsePreferences } from "@/lib/preferences";

type PdfPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PdfPage({ searchParams }: PdfPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const preferences = parsePreferences(resolvedSearchParams);
  const issueId = await resolveImplicitIssueId("/pdf");
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
        currentRouteKind="pdf"
      >
        <PdfView issueId={issueId} issueTitle={issue.title} />
      </IssueShell>
    </PreferenceSync>
  );
}
