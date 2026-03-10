import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueHome } from "@/components/site/issue-home";
import { IssueShell } from "@/components/site/issue-shell";
import { SeriesHome } from "@/components/site/series-home";
import { getAllIssues, getIssueManifest, getIssuePages } from "@/lib/content/repository";
import { getHostSiteContext } from "@/lib/issue-routing";
import { parsePreferences } from "@/lib/preferences";

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const preferences = parsePreferences(resolvedSearchParams);
  const siteContext = await getHostSiteContext("/");

  if (siteContext.siteKind === "issue" && siteContext.issueId) {
    const [issue, pages] = await Promise.all([
      getIssueManifest(siteContext.issueId),
      getIssuePages(siteContext.issueId, preferences.script)
    ]);

    return (
      <>
        <PreferenceSync preferences={preferences} />
        <IssueShell
          issue={issue}
          preferences={preferences}
          issueHomePath="/"
          tocPath="/toc"
          discussionPath="/discussion"
          alternateModePath={issue.articles[0] ? `/article/${issue.articles[0].slug}` : "/toc"}
          currentRouteKind="issue"
        >
          <IssueHome issue={issue} coverPage={pages[0]} script={preferences.script} issueHomePath="" tocPath="/toc" discussionPath="/discussion" />
        </IssueShell>
      </>
    );
  }

  const issues = await getAllIssues();

  return (
    <>
      <PreferenceSync preferences={preferences} />
      <SeriesHome issues={issues} />
    </>
  );
}
