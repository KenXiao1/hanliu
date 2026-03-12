import { notFound } from "next/navigation";

import { PageView } from "@/components/site/page-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { getIssueManifest, getPageView } from "@/lib/content/repository";
import { resolveImplicitIssueId } from "@/lib/issue-routing";
import { parsePreferences } from "@/lib/preferences";

type PageReaderProps = {
  params: Promise<{ page: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PageReader({ params, searchParams }: PageReaderProps) {
  const [{ page }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber)) {
    notFound();
  }

  const preferences = parsePreferences(resolvedSearchParams);
  const issueId = await resolveImplicitIssueId(`/read/page/${page}`);
  const [issue, view] = await Promise.all([getIssueManifest(issueId), getPageView(issueId, pageNumber)]);

  return (
    <PreferenceSync preferences={preferences}>
      <IssueShell
        issue={issue}
        preferences={preferences}
        issueHomePath="/"
        tocPath="/toc"
        discussionPath="/discussion"
        currentRouteKind="layout"
      >
        <PageView pageView={view} issueRoot="" preferences={preferences} />
      </IssueShell>
    </PreferenceSync>
  );
}
