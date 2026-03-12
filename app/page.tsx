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
    const [issue, pagesHans, pagesHant] = await Promise.all([
      getIssueManifest(siteContext.issueId),
      getIssuePages(siteContext.issueId, "zh-Hans"),
      getIssuePages(siteContext.issueId, "zh-Hant")
    ]);

    return (
      <PreferenceSync preferences={preferences}>
        <IssueShell
          issue={issue}
          preferences={preferences}
          issueHomePath="/"
          tocPath="/toc"
          discussionPath="/discussion"
          currentRouteKind="issue"
        >
          <IssueHome
            issue={issue}
            coverPages={{
              "zh-Hans": pagesHans[0],
              "zh-Hant": pagesHant[0]
            }}
            issueHomePath=""
            discussionPath="/discussion"
          />
        </IssueShell>
      </PreferenceSync>
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
