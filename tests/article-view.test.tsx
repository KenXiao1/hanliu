import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArticleView } from "@/components/site/article-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import type { ArticleView as ArticleViewModel } from "@/lib/content/queries";
import type { ReaderPreferences } from "@/lib/preferences";

globalThis.React = React;

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt={alt} {...props} />
}));

vi.mock("@/components/site/lazy-giscus", () => ({
  LazyGiscusComments: () => <div>评论区加载中…</div>
}));

const preferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  fontScale: 1
};

const view: ArticleViewModel = {
  article: {
    articleId: "issue-01-a003",
    slug: "han-movement",
    titleHans: "皇汉是如何出现的",
    titleHant: "皇漢是如何出現的",
    startPage: 28,
    endPage: 31,
    commentThreadId: "issue-01:han-movement",
    sections: [
      {
        level: 1,
        page: 30,
        titleHans: "通过内生产生的皇汉",
        titleHant: "通過內生產生的皇漢"
      }
    ]
  },
  pageRange: "28-31",
  toc: [
    {
      id: "han-movement-s1",
      page: 30,
      titleHans: "通过内生产生的皇汉",
      titleHant: "通過內生產生的皇漢"
    }
  ],
  locales: {
    "zh-Hans": {
      pages: [
        {
          pageId: "issue-01-p029",
          locale: "zh-Hans",
          pageNumber: 29,
          pageLabel: "29",
          renderedPageAsset: "/page-029.jpg",
          viewport: { width: 420, height: 595 },
          textBlocks: [
            {
              x: 0,
              y: 0,
              width: 100,
              height: 10,
              text: "截至11月2日，收到了群友与B站站友的9篇投稿。"
            }
          ],
          images: []
        },
        {
          pageId: "issue-01-p030",
          locale: "zh-Hans",
          pageNumber: 30,
          pageLabel: "30",
          renderedPageAsset: "/page-030.jpg",
          viewport: { width: 420, height: 595 },
          textBlocks: [
            {
              x: 0,
              y: 0,
              width: 100,
              height: 10,
              text: "第一部分的人的不满主要有两个方面。"
            },
            {
              x: 0,
              y: 12,
              width: 100,
              height: 10,
              text: "第二是对政治权利的不公平带来的不满。"
            }
          ],
          images: []
        }
      ]
    },
    "zh-Hant": {
      pages: [
        {
          pageId: "issue-01-p029-hant",
          locale: "zh-Hant",
          pageNumber: 29,
          pageLabel: "29",
          renderedPageAsset: "/page-029.jpg",
          viewport: { width: 420, height: 595 },
          textBlocks: [
            {
              x: 0,
              y: 0,
              width: 100,
              height: 10,
              text: "截至11月2日，收到了群友與B站站友的9篇投稿。"
            }
          ],
          images: []
        },
        {
          pageId: "issue-01-p030-hant",
          locale: "zh-Hant",
          pageNumber: 30,
          pageLabel: "30",
          renderedPageAsset: "/page-030.jpg",
          viewport: { width: 420, height: 595 },
          textBlocks: [
            {
              x: 0,
              y: 0,
              width: 100,
              height: 10,
              text: "第一部分的人的不滿主要有兩個方面。"
            }
          ],
          images: []
        }
      ]
    }
  }
};

describe("ArticleView", () => {
  it("renders article mode as continuous reading without per-page chrome", () => {
    render(
      <PreferenceSync preferences={preferences}>
        <ArticleView view={view} preferences={preferences} />
      </PreferenceSync>
    );

    expect(screen.getByRole("heading", { name: "皇汉是如何出现的" })).toBeTruthy();
    expect(screen.getByText("截至11月2日，收到了群友与B站站友的9篇投稿。")).toBeTruthy();
    expect(screen.getByText("第一部分的人的不满主要有两个方面。")).toBeTruthy();
    expect(screen.getByText("第二是对政治权利的不公平带来的不满。")).toBeTruthy();
    expect(screen.getAllByText("通过内生产生的皇汉").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("查看原版式")).toHaveLength(0);
    expect(screen.queryAllByText("第 30 页")).toHaveLength(0);
    expect(screen.queryAllByText("页 28-31")).toHaveLength(0);
  });

  it("merges paragraph continuations across page boundaries", () => {
    const continuedView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        startPage: 30,
        endPage: 31,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p030-cont",
              locale: "zh-Hans",
              pageNumber: 30,
              pageLabel: "30",
              renderedPageAsset: "/page-030.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 494,
                  width: 310,
                  height: 10,
                  text: "但如果继续无视汉民族的民族感情，继续放任某些群体刻意伤害汉"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p031-cont",
              locale: "zh-Hans",
              pageNumber: 31,
              pageLabel: "31",
              renderedPageAsset: "/page-031.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 74,
                  width: 232,
                  height: 13,
                  text: "民族的民族感情，那皇汉这一群体势必会更加壮大。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p030-cont-hant",
              locale: "zh-Hant",
              pageNumber: 30,
              pageLabel: "30",
              renderedPageAsset: "/page-030.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 494,
                  width: 310,
                  height: 10,
                  text: "但如果繼續無視漢民族的民族感情，繼續放任某些群體刻意傷害漢"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p031-cont-hant",
              locale: "zh-Hant",
              pageNumber: 31,
              pageLabel: "31",
              renderedPageAsset: "/page-031.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 74,
                  width: 232,
                  height: 13,
                  text: "民族的民族感情，那皇漢這一群體勢必會更加壯大。"
                }
              ],
              images: []
            }
          ]
        }
      }
    };

    const { container } = render(
      <PreferenceSync preferences={preferences}>
        <ArticleView view={continuedView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p"));

    expect(bodyParagraphs).toHaveLength(1);
    expect(bodyParagraphs[0]?.textContent).toBe("但如果继续无视汉民族的民族感情，继续放任某些群体刻意伤害汉民族的民族感情，那皇汉这一群体势必会更加壮大。");
  });

  it("separates page notes and footnotes from body content", () => {
    const annotatedView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-003",
        titleHans: "从山海出发，向星海征伐",
        titleHant: "從山海出發，向星海征伐",
        startPage: 3,
        endPage: 7
      },
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p003",
              locale: "zh-Hans",
              pageNumber: 3,
              pageLabel: "3",
              renderedPageAsset: "/page-003.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 81,
                  width: 292,
                  height: 33,
                  text: "从山海出发，向星海征伐"
                },
                {
                  x: 339,
                  y: 142,
                  width: 29,
                  height: 13,
                  text: "连山1"
                },
                {
                  x: 75,
                  y: 174,
                  width: 52,
                  height: 13,
                  text: "我们是谁？"
                },
                {
                  x: 75,
                  y: 192,
                  width: 132,
                  height: 13,
                  text: "曾经，这不能成为一个问题。"
                },
                {
                  x: 54,
                  y: 488,
                  width: 309,
                  height: 35,
                  text: "1 本世纪初出生在苏南，父母为编制人员。"
                },
                {
                  x: 207,
                  y: 546,
                  width: 7,
                  height: 13,
                  text: "2"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p003-hant",
              locale: "zh-Hant",
              pageNumber: 3,
              pageLabel: "3",
              renderedPageAsset: "/page-003.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 86,
                  width: 292,
                  height: 27,
                  text: "從山海出發，向星海征伐"
                },
                {
                  x: 342,
                  y: 144,
                  width: 26,
                  height: 11,
                  text: "連山1"
                },
                {
                  x: 75,
                  y: 176,
                  width: 52,
                  height: 10,
                  text: "我們是誰？"
                },
                {
                  x: 75,
                  y: 194,
                  width: 132,
                  height: 10,
                  text: "曾經，這不能成為一個問題。"
                },
                {
                  x: 54,
                  y: 490,
                  width: 309,
                  height: 33,
                  text: "1 本世紀初出生在蘇南，父母為編制人員。"
                },
                {
                  x: 207,
                  y: 548,
                  width: 7,
                  height: 10,
                  text: "2"
                }
              ],
              images: []
            }
          ]
        }
      }
    };

    const { container } = render(
      <PreferenceSync preferences={preferences}>
        <ArticleView view={annotatedView} preferences={preferences} />
      </PreferenceSync>
    );

    const pageNote = container.querySelector(".article-page-note");
    const footnotes = container.querySelector(".article-footnotes");
    const body = container.querySelector(".article-blocks");

    expect(pageNote).not.toBeNull();
    expect(footnotes).not.toBeNull();
    expect(body).not.toBeNull();
    expect(pageNote?.textContent ?? "").toContain("连山");
    expect(footnotes?.textContent ?? "").toContain("本世纪初出生在苏南");
    expect(body?.textContent ?? "").toContain("我们是谁？");
    expect(body?.textContent ?? "").not.toContain("从山海出发，向星海征伐");
    expect(body?.textContent ?? "").not.toContain("本世纪初出生在苏南");
    expect(screen.queryByText(/^2$/)).toBeNull();
  });

  it("does not repeat section headings that are already rendered as anchors", () => {
    const sectionedView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-008",
        titleHans: "复周：一个未完成的大计划",
        titleHant: "復周：一個未完成的大計劃",
        startPage: 8,
        endPage: 28,
        sections: [
          {
            level: 2,
            page: 8,
            titleHans: "前言",
            titleHant: "前言"
          }
        ]
      },
      toc: [
        {
          id: "page-008-s1",
          page: 8,
          titleHans: "前言",
          titleHant: "前言"
        }
      ],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p008",
              locale: "zh-Hans",
              pageNumber: 8,
              pageLabel: "8",
              renderedPageAsset: "/page-008.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 82,
                  width: 293,
                  height: 30,
                  text: "复周：一个未完成的大计划"
                },
                {
                  x: 175,
                  y: 142,
                  width: 193,
                  height: 14,
                  text: "──从王朝中国的五个令人震惊的事实说起"
                },
                {
                  x: 339,
                  y: 174,
                  width: 29,
                  height: 13,
                  text: "陈云1"
                },
                {
                  x: 54,
                  y: 214,
                  width: 53,
                  height: 30,
                  text: "前言"
                },
                {
                  x: 54,
                  y: 274,
                  width: 310,
                  height: 12,
                  text: "诸位现在听的，是一位六十几岁的香港学者。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p008-hant",
              locale: "zh-Hant",
              pageNumber: 8,
              pageLabel: "8",
              renderedPageAsset: "/page-008.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 87,
                  width: 294,
                  height: 25,
                  text: "復周：一個未完成的大計劃"
                },
                {
                  x: 175,
                  y: 144,
                  width: 193,
                  height: 10,
                  text: "──從王朝中國的五個令人震驚的事實說起"
                },
                {
                  x: 342,
                  y: 176,
                  width: 26,
                  height: 11,
                  text: "陳雲1"
                },
                {
                  x: 54,
                  y: 219,
                  width: 53,
                  height: 25,
                  text: "前言"
                },
                {
                  x: 54,
                  y: 276,
                  width: 310,
                  height: 10,
                  text: "諸位現在聽的，是一位六十幾歲的香港學者。"
                }
              ],
              images: []
            }
          ]
        }
      }
    };

    const { container } = render(
      <PreferenceSync preferences={preferences}>
        <ArticleView view={sectionedView} preferences={preferences} />
      </PreferenceSync>
    );

    const body = container.querySelector(".article-blocks");
    const anchorLabels = Array.from(container.querySelectorAll(".section-anchor")).map((node) => node.textContent?.trim());

    expect(anchorLabels).toContain("前言");
    expect(body?.textContent ?? "").toContain("诸位现在听的，是一位六十几岁的香港学者。");
    expect(body?.textContent ?? "").not.toContain("前言");
  });

  it("renders OCR footnote markers as inline superscripts instead of body text", () => {
    const inlineMarkerView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-008",
        titleHans: "复周：一个未完成的大计划",
        titleHant: "復周：一個未完成的大計劃",
        startPage: 8,
        endPage: 8,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p008-inline",
              locale: "zh-Hans",
              pageNumber: 8,
              pageLabel: "8",
              renderedPageAsset: "/page-008.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 82,
                  width: 293,
                  height: 30,
                  text: "复周：一个未完成的大计划"
                },
                {
                  x: 54,
                  y: 274,
                  width: 310,
                  height: 12,
                  text: "诸位现在听的，是一位六十几岁的香港学者，三十几年前在德国哥廷根大学修读德国民俗学和汉学之后讲的中国故事。"
                },
                {
                  x: 54,
                  y: 310,
                  width: 300,
                  height: 12,
                  text: "他主攻的是英国文学；"
                },
                {
                  x: 355,
                  y: 311,
                  width: 3,
                  height: 5,
                  text: "2"
                },
                {
                  x: 54,
                  y: 328,
                  width: 310,
                  height: 12,
                  text: "3竟然延续到往后的郡县制的中国。"
                },
                {
                  x: 54,
                  y: 346,
                  width: 310,
                  height: 12,
                  text: "说要后现代，4德国的哈贝马斯继续讨论这个计划。"
                },
                {
                  x: 54,
                  y: 454,
                  width: 306,
                  height: 36,
                  text: "2 关于作者经历的补充。"
                },
                {
                  x: 54,
                  y: 488,
                  width: 306,
                  height: 36,
                  text: "3 关于制度延续的补充。"
                },
                {
                  x: 54,
                  y: 524,
                  width: 306,
                  height: 36,
                  text: "4 关于现代性讨论的补充。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p008-inline-hant",
              locale: "zh-Hant",
              pageNumber: 8,
              pageLabel: "8",
              renderedPageAsset: "/page-008.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 87,
                  width: 294,
                  height: 25,
                  text: "復周：一個未完成的大計劃"
                },
                {
                  x: 54,
                  y: 276,
                  width: 310,
                  height: 10,
                  text: "諸位現在聽的，是一位六十幾歲的香港學者，三十幾年前在德國哥廷根大學修讀德國民俗學和漢學之後講的中國故事。"
                },
                {
                  x: 54,
                  y: 312,
                  width: 300,
                  height: 10,
                  text: "他主攻的是英國文學；"
                },
                {
                  x: 354,
                  y: 311,
                  width: 3,
                  height: 5,
                  text: "2"
                },
                {
                  x: 54,
                  y: 330,
                  width: 310,
                  height: 10,
                  text: "3竟然延續到往後的郡縣制的中國。"
                },
                {
                  x: 54,
                  y: 348,
                  width: 310,
                  height: 10,
                  text: "說要後現代，4德國的哈貝馬斯繼續討論這個計劃。"
                },
                {
                  x: 54,
                  y: 456,
                  width: 306,
                  height: 33,
                  text: "2 關於作者經歷的補充。"
                },
                {
                  x: 54,
                  y: 490,
                  width: 306,
                  height: 33,
                  text: "3 關於制度延續的補充。"
                },
                {
                  x: 54,
                  y: 526,
                  width: 306,
                  height: 33,
                  text: "4 關於現代性討論的補充。"
                }
              ],
              images: []
            }
          ]
        }
      }
    };

    const { container } = render(
      <PreferenceSync preferences={preferences}>
        <ArticleView view={inlineMarkerView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p"));

    expect(bodyParagraphs).toHaveLength(4);
    expect(bodyParagraphs[1]?.innerHTML ?? "").toBe("他主攻的是英国文学；<sup>2</sup>");
    expect(bodyParagraphs[2]?.innerHTML ?? "").toBe("<sup>3</sup>竟然延续到往后的郡县制的中国。");
    expect(bodyParagraphs[3]?.innerHTML ?? "").toBe("说要后现代，<sup>4</sup>德国的哈贝马斯继续讨论这个计划。");
  });
});
