import { describe, expect, it } from "vitest";

import { buildArticlePageLayout } from "@/lib/content/article-layout";
import type { PageData } from "@/lib/content/types";
import issueManifest from "@/data/issues/issue-01/manifest.json";
import pagesHans from "@/data/issues/issue-01/pages.zh-Hans.json";

const page029Hans: PageData = {
  pageId: "issue-01-p029",
  locale: "zh-Hans",
  pageNumber: 29,
  pageLabel: "29",
  renderedPageAsset: "/generated/issue-01/zh-Hans/pages/page-029.jpg",
  viewport: {
    width: 419.58,
    height: 595.32
  },
  textBlocks: [
    {
      x: 54,
      y: 81.05,
      width: 230.09,
      height: 32.5,
      text: "皇汉是如何出现的1"
    },
    {
      x: 328.74,
      y: 142.3,
      width: 39.1,
      height: 13.41,
      text: "李循义2"
    },
    {
      x: 54,
      y: 176.02,
      width: 310.02,
      height: 10.17,
      text: "皇汉和汉民族主义者，是因为内部或外部的原因，从汉族民众庞大"
    },
    {
      x: 54,
      y: 192.34,
      width: 132.29,
      height: 13.41,
      text: "的基数中被激活的部分人士。"
    },
    {
      x: 54,
      y: 226,
      width: 310.02,
      height: 10.17,
      text: "第一部分，也是绝大部分。其大多是原本朴素的民族主义者，在原"
    },
    {
      x: 54,
      y: 243.99,
      width: 310.02,
      height: 10.17,
      text: "本内部精神有一定的汉民族认同的情况下，被现实中的外部事件刺激，"
    },
    {
      x: 54,
      y: 260.32,
      width: 92.26,
      height: 13.41,
      text: "因为不满而出现的。"
    },
    {
      x: 53.98,
      y: 429.01,
      width: 311.55,
      height: 94.54,
      text: "1 2025 年10 月28 日，笔者提出「皇汉和汉民族主义者是如何出现的？他们大概分为哪些派系？有什么样的诉求？」为笔者所组织的「星汉思学社」第一期的议题。截至11 月2 日，收到了群友与B 站站友的9 篇投稿，加上笔者自己的，一共10 篇，综合统整为本文。2 穿汉服十余年，蓄发六七年，本是一个快要淡出汉服运动的人了。可偏偏在2025年的4 月和7 月，连续刷到有人故意以满清的服饰标着汉服的名字，还以《汉服之美在中国》这种标题特意推流，激起了怒火，决心成立组织，招募同志，共同发力发声。"
    },
    {
      x: 204.72,
      y: 545.68,
      width: 12.4,
      height: 13.41,
      text: "28"
    }
  ],
  images: []
};

describe("buildArticlePageLayout", () => {
  it("removes a first-page title block even when it carries a trailing footnote marker", () => {
    const layout = buildArticlePageLayout(page029Hans, {
      isArticleStartPage: true,
      hiddenTitles: ["皇汉是如何出现的"]
    });

    expect(layout.pageNote).toEqual({
      text: "李循义",
      marker: "2"
    });
    expect(layout.bodyBlocks.some((block) => block.text.includes("皇汉是如何出现的"))).toBe(false);
  });

  it("merges wrapped body lines into paragraphs and splits combined footnotes", () => {
    const layout = buildArticlePageLayout(page029Hans, {
      isArticleStartPage: true,
      hiddenTitles: ["皇汉是如何出现的"]
    });

    expect(layout.bodyBlocks).toEqual([
      {
        text: "皇汉和汉民族主义者，是因为内部或外部的原因，从汉族民众庞大的基数中被激活的部分人士。"
      },
      {
        text: "第一部分，也是绝大部分。其大多是原本朴素的民族主义者，在原本内部精神有一定的汉民族认同的情况下，被现实中的外部事件刺激，因为不满而出现的。"
      }
    ]);

    expect(layout.footnotes).toEqual([
      {
        marker: "1",
        text: "2025 年10 月28 日，笔者提出「皇汉和汉民族主义者是如何出现的？他们大概分为哪些派系？有什么样的诉求？」为笔者所组织的「星汉思学社」第一期的议题。截至11 月2 日，收到了群友与B 站站友的9 篇投稿，加上笔者自己的，一共10 篇，综合统整为本文。"
      },
      {
        marker: "2",
        text: "穿汉服十余年，蓄发六七年，本是一个快要淡出汉服运动的人了。可偏偏在2025年的4 月和7 月，连续刷到有人故意以满清的服饰标着汉服的名字，还以《汉服之美在中国》这种标题特意推流，激起了怒火，决心成立组织，招募同志，共同发力发声。"
      }
    ]);
  });

  it("attaches a standalone byline marker to the extracted page note", () => {
    const page133Hans = getIssuePage(133);

    const layout = buildArticlePageLayout(page133Hans, {
      isArticleStartPage: true,
      hiddenTitles: [issueManifest.articles.find((article) => article.slug === "page-133")?.titleHans ?? ""]
    });

    expect(layout.pageNote).toEqual({
      text: "种树未着花",
      marker: "1"
    });
    expect(layout.bodyBlocks.some((block) => block.text === "1")).toBe(false);
    expect(layout.bodyBlocks.some((block) => block.text === "132")).toBe(false);
  });

  it("extracts lowered right-aligned bylines on article opening pages across the issue", () => {
    const samples = [
      { pageNumber: 230, expected: { text: "卯金刀" } },
      { pageNumber: 237, expected: { text: "胡又天", marker: "2" } },
      { pageNumber: 277, expected: { text: "胡又天" } }
    ];

    for (const sample of samples) {
      const article = issueManifest.articles.find((entry) => entry.startPage === sample.pageNumber);
      const page = getIssuePage(sample.pageNumber);
      const layout = buildArticlePageLayout(page, {
        isArticleStartPage: true,
        hiddenTitles: article ? [article.titleHans] : []
      });

      expect(layout.pageNote).toEqual(sample.expected);
      expect(layout.bodyBlocks.some((block) => block.text.includes(sample.expected.text))).toBe(false);
    }
  });

  it("removes split opening title blocks across issue articles", () => {
    for (const pageNumber of [230, 277]) {
      const article = issueManifest.articles.find((entry) => entry.startPage === pageNumber);
      const page = getIssuePage(pageNumber);
      const layout = buildArticlePageLayout(page, {
        isArticleStartPage: true,
        hiddenTitles: article ? [article.titleHans] : []
      });

      expect(article).toBeTruthy();
      expect(layout.bodyBlocks.some((block) => block.text.includes(article?.titleHans ?? ""))).toBe(false);
      expect(layout.bodyBlocks.some((block) => article?.titleHans.includes(block.text))).toBe(false);
    }
  });
});

function getIssuePage(pageNumber: number): PageData {
  const page = pagesHans.find((entry) => entry.pageNumber === pageNumber);

  if (!page) {
    throw new Error(`Missing issue-01 page ${pageNumber}`);
  }

  return page;
}
