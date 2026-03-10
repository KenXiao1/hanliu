import { notFound } from "next/navigation";

import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { TocView } from "@/components/site/toc-view";
import { getIssueManifest } from "@/lib/content/repository";
import { resolveImplicitIssueId } from "@/lib/issue-routing";
import { parsePreferences } from "@/lib/preferences";

type TocPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TocPage({ searchParams }: TocPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const preferences = parsePreferences(resolvedSearchParams);
  const issueId = await resolveImplicitIssueId("/toc");
  const issue = await getIssueManifest(issueId).catch(() => null);

  if (!issue) {
    notFound();
  }

  return (
    <>
      <PreferenceSync preferences={preferences} />
      <IssueShell
        issue={issue}
        preferences={preferences}
        issueHomePath="/"
        tocPath="/toc"
        discussionPath="/discussion"
        alternateModePath={issue.articles[0] ? `/article/${issue.articles[0].slug}` : "/"}
        currentRouteKind="toc"
      >
        <TocView issue={issue} issueRoot="" script={preferences.script} />
      </IssueShell>
    </>
  );
}
