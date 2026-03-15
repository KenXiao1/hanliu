export type LocaleCode = "zh-Hans" | "zh-Hant";

export type OutlineEntry = {
  level: number;
  page: number;
  titleHans: string;
  titleHant: string;
};

export type ArticleSection = {
  level: number;
  page: number;
  titleHans: string;
  titleHant: string;
};

export type ArticleManifest = {
  articleId: string;
  slug: string;
  titleHans: string;
  titleHant: string;
  startPage: number;
  endPage: number;
  commentThreadId: string;
  sections: ArticleSection[];
};

export type TocEntry = {
  level: number;
  page: number;
  titleHans: string;
  titleHant: string;
};

export type IssueManifest = {
  issueId: string;
  title: string;
  subtitle: string;
  cover: string;
  defaultLocale: LocaleCode;
  pageCount: number;
  articles: ArticleManifest[];
  toc: TocEntry[];
};

export type TextBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

export type PageImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
};

export type PageData = {
  pageId: string;
  locale: LocaleCode;
  pageNumber: number;
  pageLabel: string;
  renderedPageAsset: string;
  viewport: {
    width: number;
    height: number;
  };
  textBlocks: TextBlock[];
  images: PageImage[];
};
