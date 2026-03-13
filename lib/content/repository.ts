import path from "node:path";
import { promises as fs } from "node:fs";

import { cache } from "react";

import { buildArticleView } from "@/lib/content/queries";
import type { ArticleManifest, IssueManifest, LocaleCode, PageData } from "@/lib/content/types";

const dataRoot = path.join(process.cwd(), "data", "issues");

export const getIssueManifest = cache(async (issueId: string): Promise<IssueManifest> => {
  return readJson<IssueManifest>(path.join(dataRoot, issueId, "manifest.json"));
});

export const getIssuePages = cache(async (issueId: string, locale: LocaleCode): Promise<PageData[]> => {
  return readJson<PageData[]>(path.join(dataRoot, issueId, `pages.${locale}.json`));
});

export async function getAllIssues(): Promise<IssueManifest[]> {
  const entries = await fs.readdir(dataRoot, { withFileTypes: true });
  const issueIds = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

  return Promise.all(issueIds.map((issueId) => getIssueManifest(issueId)));
}

export async function getIssueArticle(issueId: string, slug: string): Promise<ArticleManifest | null> {
  const manifest = await getIssueManifest(issueId);
  return manifest.articles.find((article) => article.slug === slug) ?? null;
}

export async function getArticleView(issueId: string, slug: string) {
  const article = await getIssueArticle(issueId, slug);
  if (!article) {
    return null;
  }

  const [pagesHans, pagesHant] = await Promise.all([
    getIssuePages(issueId, "zh-Hans"),
    getIssuePages(issueId, "zh-Hant")
  ]);

  return buildArticleView(article, {
    "zh-Hans": pagesHans,
    "zh-Hant": pagesHant
  });
}

export async function getPageNumbers(issueId: string) {
  const manifest = await getIssueManifest(issueId);
  return Array.from({ length: manifest.pageCount }, (_, index) => index + 1);
}

async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}
