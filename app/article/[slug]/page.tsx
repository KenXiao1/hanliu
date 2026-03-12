import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/site/article-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { IssueShell } from "@/components/site/issue-shell";
import { getArticleView, getIssueArticle, getIssueManifest } from "@/lib/content/repository";
import { resolveImplicitIssueId } from "@/lib/issue-routing";
import { parsePreferences } from "@/lib/preferences";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const issueId = await resolveImplicitIssueId(`/article/${slug}`);
  const [issue, article] = await Promise.all([getIssueManifest(issueId), getIssueArticle(issueId, slug)]);

  if (!article) {
    return {};
  }

  const title = `${article.titleHans} — ${issue.title}`;
  const description = `《${issue.title}》第 ${article.startPage}-${article.endPage} 页`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article"
    }
  };
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const preferences = parsePreferences(resolvedSearchParams);
  const issueId = await resolveImplicitIssueId(`/article/${slug}`);
  const [issue, view] = await Promise.all([getIssueManifest(issueId), getArticleView(issueId, slug)]);

  if (!view) {
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
        alternateModePath={`/read/page/${view.article.startPage}`}
        currentRouteKind="article"
      >
        <ArticleView view={view} issueRoot="" preferences={preferences} />
      </IssueShell>
    </>
  );
}
