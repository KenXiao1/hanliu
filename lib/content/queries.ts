import type { ArticleManifest, LocaleCode, PageData } from "@/lib/content/types";

type LocalePages = Record<LocaleCode, PageData[]>;

export type ArticleView = {
  article: ArticleManifest;
  pageRange: string;
  toc: Array<{
    id: string;
    page: number;
    titleHans: string;
    titleHant: string;
  }>;
  locales: Record<
    LocaleCode,
    {
      pages: PageData[];
    }
  >;
};

export function buildArticleView(article: ArticleManifest, localePages: LocalePages): ArticleView {
  return {
    article,
    pageRange: `${article.startPage}-${article.endPage}`,
    toc: article.sections.map((section, index) => ({
      id: `${article.slug}-s${index + 1}`,
      page: section.page,
      titleHans: section.titleHans,
      titleHant: section.titleHant
    })),
    locales: {
      "zh-Hans": {
        pages: selectArticlePages(localePages["zh-Hans"], article)
      },
      "zh-Hant": {
        pages: selectArticlePages(localePages["zh-Hant"], article)
      }
    }
  };
}

function selectArticlePages(pages: PageData[], article: ArticleManifest) {
  return pages.filter((page) => page.pageNumber >= article.startPage && page.pageNumber <= article.endPage);
}
