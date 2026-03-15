import { describe, expect, it } from "vitest";

import { buildArticlePageLayout } from "@/lib/content/article-layout";
import type { PageData } from "@/lib/content/types";
import issueManifest from "@/data/issues/issue-01/manifest.json";
import pagesHans from "@/data/issues/issue-01/pages.zh-Hans.json";
import pagesHant from "@/data/issues/issue-01/pages.zh-Hant.json";

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

  it("merges same-line OCR splits when the second block starts with an inline footnote marker", () => {
    const article = issueManifest.articles.find((entry) => entry.slug === "page-008");
    const layout = buildArticlePageLayout(getIssuePage(9), {
      hiddenTitles: article?.sections.filter((section) => section.page === 9).map((section) => section.titleHans) ?? []
    });

    expect(layout.bodyBlocks.some((block) => block.text === "的《五经》，")).toBe(false);
    expect(layout.bodyBlocks.some((block) => block.text.startsWith("3竟然延续到往后的郡县制的中国"))).toBe(false);
    expect(layout.bodyBlocks.some((block) => block.text.includes("的《五经》，3竟然延续到往后的郡县制的中国"))).toBe(true);
  });

  it("merges first-line-indented wrapped paragraphs on page 133", () => {
    const article = issueManifest.articles.find((entry) => entry.slug === "page-133");
    const layout = buildArticlePageLayout(getIssuePage(133), {
      isArticleStartPage: true,
      hiddenTitles: article ? [article.titleHans] : []
    });

    expect(layout.bodyBlocks.some((block) => block.text === "我是一个零零后女生，自认为初二时产生「汉民族意识」雏形，后")).toBe(false);
    expect(layout.bodyBlocks.some((block) => block.text === "渴望学晚宋史不成，本科与文史毫不相干，两次考研失败，无从得到专业训练，现又失业在家。")).toBe(false);
    expect(layout.bodyBlocks.some((block) => block.text === "回看这十一年，我从「好奇」「为什么」出发追问「历史的真相」，")).toBe(false);
    expect(layout.bodyBlocks.some((block) => block.text === "我是一个零零后女生，自认为初二时产生「汉民族意识」雏形，后渴望学晚宋史不成，本科与文史毫不相干，两次考研失败，无从得到专业训练，现又失业在家。")).toBe(true);
    expect(
      layout.bodyBlocks.some(
        (block) => block.text === "回看这十一年，我从「好奇」「为什么」出发追问「历史的真相」，因信任破灭而产生一种巨大的「被欺骗」的愤怒，又因努力不够、能力欠缺与脾性执拗，落到如今这番田地。可我想将我经历的、看到的、思考的事情，分享出来。"
      )
    ).toBe(true);
  });

  it("does not leave footnote-marker-only body blocks anywhere in issue-01 articles", () => {
    for (const [script, pages] of Object.entries({
      "zh-Hans": pagesHans,
      "zh-Hant": pagesHant
    }) as Array<["zh-Hans" | "zh-Hant", PageData[]]>) {
      for (const article of issueManifest.articles) {
        for (const page of pages.filter((entry) => entry.pageNumber >= article.startPage && entry.pageNumber <= article.endPage)) {
          const layout = buildArticlePageLayout(page, {
            isArticleStartPage: page.pageNumber === article.startPage,
            hiddenTitles: [
              page.pageNumber === article.startPage ? (script === "zh-Hans" ? article.titleHans : article.titleHant) : "",
              ...article.sections
                .filter((section) => section.page === page.pageNumber)
                .map((section) => (script === "zh-Hans" ? section.titleHans : section.titleHant))
            ].filter(Boolean)
          });
          const footnoteMarkers = new Set(layout.footnotes.map((footnote) => footnote.marker).filter((marker): marker is string => Boolean(marker)));

          expect(
            layout.bodyBlocks.filter((block) => footnoteMarkers.has(block.text.trim())).map((block) => block.text),
            `${script} page ${page.pageNumber}`
          ).toEqual([]);
        }
      }
    }
  });

  it("does not leave same-line inline footnote splits as separate body blocks anywhere in issue-01 articles", () => {
    for (const [script, pages] of Object.entries({
      "zh-Hans": pagesHans,
      "zh-Hant": pagesHant
    }) as Array<["zh-Hans" | "zh-Hant", PageData[]]>) {
      for (const article of issueManifest.articles) {
        for (const page of pages.filter((entry) => entry.pageNumber >= article.startPage && entry.pageNumber <= article.endPage)) {
          const layout = buildArticlePageLayout(page, {
            isArticleStartPage: page.pageNumber === article.startPage,
            hiddenTitles: [
              page.pageNumber === article.startPage ? (script === "zh-Hans" ? article.titleHans : article.titleHant) : "",
              ...article.sections
                .filter((section) => section.page === page.pageNumber)
                .map((section) => (script === "zh-Hans" ? section.titleHans : section.titleHant))
            ].filter(Boolean)
          });
          const footnoteMarkers = new Set(layout.footnotes.map((footnote) => footnote.marker).filter((marker): marker is string => Boolean(marker)));
          const sortedBlocks = [...page.textBlocks].sort((left, right) => (left.y === right.y ? left.x - right.x : left.y - right.y));
          const inlineSplitBlocks = sortedBlocks
            .slice(1)
            .filter((block, index) => {
              const previousBlock = sortedBlocks[index];
              const text = block.text.trim();
              const bottom = block.y + block.height;
              const sameLine = Math.abs(previousBlock.y - block.y) <= Math.max(previousBlock.height, block.height) * 0.8;
              const markerMatch = text.match(/^(\d+)[\u3400-\u9FFF「『（《〈【]/u);

              if (!sameLine || !markerMatch || bottom >= page.viewport.height * 0.76) {
                return false;
              }

              return footnoteMarkers.has(markerMatch[1]);
            })
            .map((block) => block.text.trim());

          expect(
            layout.bodyBlocks.filter((block) => inlineSplitBlocks.includes(block.text.trim())).map((block) => block.text),
            `${script} page ${page.pageNumber}`
          ).toEqual([]);
        }
      }
    }
  });

  it("does not leave first-line-indented wrapped lines as separate body blocks anywhere in issue-01 articles", () => {
    for (const [script, pages] of Object.entries({
      "zh-Hans": pagesHans,
      "zh-Hant": pagesHant
    }) as Array<["zh-Hans" | "zh-Hant", PageData[]]>) {
      for (const article of issueManifest.articles) {
        for (const page of pages.filter((entry) => entry.pageNumber >= article.startPage && entry.pageNumber <= article.endPage)) {
          const hiddenTitles = [
            page.pageNumber === article.startPage ? (script === "zh-Hans" ? article.titleHans : article.titleHant) : "",
            ...article.sections
              .filter((section) => section.page === page.pageNumber)
              .map((section) => (script === "zh-Hans" ? section.titleHans : section.titleHant))
          ].filter(Boolean);
          const layout = buildArticlePageLayout(page, {
            isArticleStartPage: page.pageNumber === article.startPage,
            hiddenTitles
          });
          const candidates = collectIndentedWrapCandidates(page, hiddenTitles);

          for (const candidate of candidates) {
            const expectedMergedText = mergeCandidateText(candidate.previousText, candidate.currentText);

            expect(
              layout.bodyBlocks.some((block) => block.text.includes(expectedMergedText)),
              `${script} page ${page.pageNumber}: ${candidate.previousText} + ${candidate.currentText}`
            ).toBe(true);
            expect(
              layout.bodyBlocks.some((block) => block.text === candidate.previousText),
              `${script} page ${page.pageNumber}: previous block remained separate`
            ).toBe(false);
            expect(
              layout.bodyBlocks.some((block) => block.text === candidate.currentText),
              `${script} page ${page.pageNumber}: current block remained separate`
            ).toBe(false);
          }
        }
      }
    }
  });

  it("keeps narrow stacked colophon lines separate on the closing page", () => {
    const layout = buildArticlePageLayout(getIssuePage(321));

    expect(layout.bodyBlocks.slice(0, 3)).toEqual([
      {
        text: "漢留 第一集 复汉．兴华．拯天下"
      },
      {
        text: "Celestial Reserve vol.1"
      },
      {
        text: "Reviving China"
      }
    ]);
  });
});

function getIssuePage(pageNumber: number): PageData {
  const page = pagesHans.find((entry) => entry.pageNumber === pageNumber);

  if (!page) {
    throw new Error(`Missing issue-01 page ${pageNumber}`);
  }

  return page;
}

function collectIndentedWrapCandidates(page: PageData, hiddenTitles: string[]) {
  const hiddenTitleSet = new Set(hiddenTitles.map((title) => normalizeComparableText(title)));
  const sortedBlocks = [...page.textBlocks]
    .sort((left, right) => (left.y === right.y ? left.x - right.x : left.y - right.y))
    .filter((block) => {
      const text = block.text.trim();

      if (!text || isPdfPageNumber(block, page) || isFootnoteBlock(block, page)) {
        return false;
      }

      return !(hiddenTitleSet.has(normalizeComparableText(text)) && isHeadingBlock(block, page));
    });
  const candidates: Array<{ previousText: string; currentText: string }> = [];

  for (let index = 1; index < sortedBlocks.length; index += 1) {
    const previousBlock = sortedBlocks[index - 1];
    const currentBlock = sortedBlocks[index];
    const verticalGap = currentBlock.y - previousBlock.y;
    const maxLineHeight = Math.max(previousBlock.height, currentBlock.height);
    const indentOffset = previousBlock.x - currentBlock.x;
    const previousLineRightEdge = previousBlock.x + previousBlock.width;
    const hasTrailingBlockOnPreviousLine = sortedBlocks.some((candidate) => {
      if (candidate === previousBlock || candidate === currentBlock) {
        return false;
      }

      const sameLineAsPrevious = Math.abs(candidate.y - previousBlock.y) <= Math.max(candidate.height, previousBlock.height) * 0.8;

      return sameLineAsPrevious && candidate.x > previousLineRightEdge - 2;
    });

    if (verticalGap <= 0 || verticalGap > maxLineHeight * 1.8) {
      continue;
    }

    if (indentOffset < maxLineHeight * 0.6 || indentOffset > maxLineHeight * 2.2) {
      continue;
    }

    if (/[。！？；:：”」』）》】]$/.test(previousBlock.text.trim())) {
      continue;
    }

    if (!isProseBlock(previousBlock.text) || !isProseBlock(currentBlock.text)) {
      continue;
    }

    if (previousLineRightEdge < page.viewport.width * 0.72) {
      continue;
    }

    if (hasTrailingBlockOnPreviousLine) {
      continue;
    }

    candidates.push({
      previousText: previousBlock.text.trim(),
      currentText: currentBlock.text.trim()
    });
  }

  return candidates;
}

function isPdfPageNumber(block: PageData["textBlocks"][number], page: PageData) {
  const text = block.text.trim();

  return /^\d+$/.test(text) && block.y >= page.viewport.height * 0.88 && block.x >= page.viewport.width * 0.35 && block.x <= page.viewport.width * 0.65;
}

function isFootnoteBlock(block: PageData["textBlocks"][number], page: PageData) {
  const text = block.text.trim();
  const bottom = block.y + block.height;

  return /^\d+\s/.test(text) && block.y >= page.viewport.height * 0.6 && bottom >= page.viewport.height * 0.76;
}

function isHeadingBlock(block: PageData["textBlocks"][number], page: PageData) {
  return block.height >= page.viewport.height * 0.028 && block.x <= page.viewport.width * 0.22;
}

function normalizeComparableText(text: string) {
  return text.trim().replace(/\d+$/, "").trim();
}

function isProseBlock(text: string) {
  const trimmed = text.trim();

  return /[\u3400-\u9FFF]/u.test(trimmed) && !/^https?:\/\//.test(trimmed) && !/^[•·]/.test(trimmed) && !/^[-—]/.test(trimmed);
}

function mergeCandidateText(left: string, right: string) {
  if (/[A-Za-z0-9]$/.test(left) && /^[A-Za-z0-9]/.test(right)) {
    return `${left} ${right}`;
  }

  return `${left}${right}`;
}
