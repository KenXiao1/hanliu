import { describe, expect, it } from "vitest";

import { buildArticleView, getPageSpread } from "@/lib/content/queries";
import type { ArticleManifest, PageData } from "@/lib/content/types";

const article: ArticleManifest = {
  articleId: "issue-01-a001",
  slug: "page-003",
  titleHans: "从山海出发，向星海征伐",
  titleHant: "從山海出發，向星海征伐",
  startPage: 3,
  endPage: 4,
  commentThreadId: "issue-01:page-003",
  sections: [
    { level: 2, page: 3, titleHans: "我们是谁？", titleHant: "我們是誰？" }
  ]
};

const hansPages: PageData[] = [
  {
    pageId: "issue-01-p003",
    locale: "zh-Hans",
    pageNumber: 3,
    pageLabel: "3",
    renderedPageAsset: "/generated/issue-01/pages/page-003.jpg",
    textBlocks: [{ x: 0, y: 0, width: 100, height: 20, text: "我们是谁？" }],
    images: []
  },
  {
    pageId: "issue-01-p004",
    locale: "zh-Hans",
    pageNumber: 4,
    pageLabel: "4",
    renderedPageAsset: "/generated/issue-01/pages/page-004.jpg",
    textBlocks: [{ x: 0, y: 0, width: 100, height: 20, text: "再造钢铁熔铸的新我。" }],
    images: []
  }
];

const hantPages: PageData[] = [
  {
    pageId: "issue-01-p003",
    locale: "zh-Hant",
    pageNumber: 3,
    pageLabel: "3",
    renderedPageAsset: "/generated/issue-01/pages/page-003.jpg",
    textBlocks: [{ x: 0, y: 0, width: 100, height: 20, text: "我們是誰？" }],
    images: []
  },
  {
    pageId: "issue-01-p004",
    locale: "zh-Hant",
    pageNumber: 4,
    pageLabel: "4",
    renderedPageAsset: "/generated/issue-01/pages/page-004.jpg",
    textBlocks: [{ x: 0, y: 0, width: 100, height: 20, text: "再造鋼鐵熔鑄的新我。" }],
    images: []
  }
];

describe("buildArticleView", () => {
  it("builds an article view from the requested locale pages", () => {
    const view = buildArticleView(article, {
      "zh-Hans": hansPages,
      "zh-Hant": hantPages
    });

    expect(view.pageRange).toBe("3-4");
    expect(view.locales["zh-Hans"].pages).toHaveLength(2);
    expect(view.locales["zh-Hant"].pages[0].textBlocks[0].text).toBe("我們是誰？");
    expect(view.toc[0]).toEqual({
      id: "page-003-s1",
      page: 3,
      titleHans: "我们是谁？",
      titleHant: "我們是誰？"
    });
  });
});

describe("getPageSpread", () => {
  it("returns the current, previous and next page ids around a page", () => {
    expect(getPageSpread(hansPages, 4)).toEqual({
      current: hansPages[1],
      previous: hansPages[0],
      next: null
    });
  });
});
