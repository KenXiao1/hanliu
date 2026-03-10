import type { ArticleManifest, ArticleSection, OutlineEntry } from "@/lib/content/types";

const CORRUPTED_SUFFIX_PATTERN = /(?:\d+[A-F]){2,}$/i;

export function cleanOutlineTitle(value: string): string {
  return value.replace(CORRUPTED_SUFFIX_PATTERN, "").trim();
}

export function slugifyArticleTitle(_: string, pageNumber: number): string {
  return `page-${String(pageNumber).padStart(3, "0")}`;
}

export function buildArticleManifests(
  outline: OutlineEntry[],
  totalPages: number,
  issueId = "issue-01"
): ArticleManifest[] {
  const topLevelEntries = outline.filter((entry) => entry.level === 1);

  return topLevelEntries.map((entry, index) => {
    const nextEntry = topLevelEntries[index + 1];
    const sections = collectSections(outline, entry.page, nextEntry?.page);
    const slug = slugifyArticleTitle(entry.titleHans, entry.page);

    return {
      articleId: `${issueId}-a${String(index + 1).padStart(3, "0")}`,
      slug,
      titleHans: cleanOutlineTitle(entry.titleHans),
      titleHant: cleanOutlineTitle(entry.titleHant),
      startPage: entry.page,
      endPage: (nextEntry?.page ?? totalPages + 1) - 1,
      commentThreadId: `${issueId}:${slug}`,
      sections
    };
  });
}

function collectSections(
  outline: OutlineEntry[],
  startPage: number,
  endPageExclusive?: number
): ArticleSection[] {
  return outline
    .filter((entry) => entry.level >= 2)
    .filter((entry) => entry.page >= startPage)
    .filter((entry) => (endPageExclusive ? entry.page < endPageExclusive : true))
    .map((entry) => ({
      level: entry.level,
      page: entry.page,
      titleHans: cleanOutlineTitle(entry.titleHans),
      titleHant: cleanOutlineTitle(entry.titleHant)
    }));
}
