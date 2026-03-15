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

    const bodyText = Array.from(container.querySelectorAll(".article-blocks"))
      .map((node) => node.textContent ?? "")
      .join("");
    const anchorLabels = Array.from(container.querySelectorAll(".section-anchor")).map((node) => node.textContent?.trim());

    expect(anchorLabels).toContain("前言");
    expect(bodyText).toContain("诸位现在听的，是一位六十几岁的香港学者。");
    expect(bodyText).not.toContain("前言");
  });

  it("renders carry-over text before later same-page section anchors", () => {
    const continuationView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-133",
        titleHans: "妾身元是分明月",
        titleHant: "妾身元是分明月",
        startPage: 133,
        endPage: 134,
        sections: [
          {
            level: 2,
            page: 133,
            titleHans: "一、前言：一个倒楣蛋的个案",
            titleHant: "一、前言：一個倒楣蛋的個案"
          },
          {
            level: 2,
            page: 134,
            titleHans: "二、一切的开始，因缘际会，恰逢其时",
            titleHant: "二、一切的開始，因緣際會，恰逢其時"
          },
          {
            level: 3,
            page: 134,
            titleHans: "（一）国族意识：中华民族与美利坚民族？",
            titleHant: "（一）國族意識：中華民族與美利堅民族？"
          }
        ]
      },
      toc: [
        {
          id: "page-133-s1",
          page: 133,
          titleHans: "一、前言：一个倒楣蛋的个案",
          titleHant: "一、前言：一個倒楣蛋的個案"
        },
        {
          id: "page-133-s2",
          page: 134,
          titleHans: "二、一切的开始，因缘际会，恰逢其时",
          titleHant: "二、一切的開始，因緣際會，恰逢其時"
        },
        {
          id: "page-133-s2-1",
          page: 134,
          titleHans: "（一）国族意识：中华民族与美利坚民族？",
          titleHant: "（一）國族意識：中華民族與美利堅民族？"
        }
      ],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p133",
              locale: "zh-Hans",
              pageNumber: 133,
              pageLabel: "133",
              renderedPageAsset: "/page-133.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 224,
                  width: 291,
                  height: 28,
                  text: "一、前言：一个倒楣蛋的个案"
                },
                {
                  x: 74,
                  y: 439,
                  width: 280,
                  height: 10,
                  text: "我不知自己是否具有成为「二十一世纪汉人民族意识重新觉醒历"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p134",
              locale: "zh-Hans",
              pageNumber: 134,
              pageLabel: "134",
              renderedPageAsset: "/page-134.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 76,
                  width: 310,
                  height: 10,
                  text: "程」的「个案研究」主体的价值，但作为在这个时代中「真的还活着」"
                },
                {
                  x: 54,
                  y: 94,
                  width: 310,
                  height: 10,
                  text: "的一个人，我的故事若能启发几分读者，便可称有「譬诸山肴野蔌，聊"
                },
                {
                  x: 54,
                  y: 112,
                  width: 245,
                  height: 10,
                  text: "而杂陈，倘俎诸五侯之鲭，当辗然一笑」之幸运了吧。"
                },
                {
                  x: 54,
                  y: 155,
                  width: 310,
                  height: 23,
                  text: "二、一切的开始，因缘际会，恰逢其时"
                },
                {
                  x: 54,
                  y: 224,
                  width: 308,
                  height: 20,
                  text: "（一）国族意识：中华民族与美利坚民族？"
                },
                {
                  x: 74,
                  y: 280,
                  width: 285,
                  height: 10,
                  text: "一般来讲，大陆零零后汉族学生，「国族意识」大概率早于「民族"
                },
                {
                  x: 54,
                  y: 298,
                  width: 63,
                  height: 10,
                  text: "意识」萌发。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p133-hant",
              locale: "zh-Hant",
              pageNumber: 133,
              pageLabel: "133",
              renderedPageAsset: "/page-133.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 229,
                  width: 291,
                  height: 23,
                  text: "一、前言：一個倒楣蛋的個案"
                },
                {
                  x: 74,
                  y: 439,
                  width: 280,
                  height: 10,
                  text: "我不知自己是否具有成為「二十一世紀漢人民族意識重新覺醒歷"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p134-hant",
              locale: "zh-Hant",
              pageNumber: 134,
              pageLabel: "134",
              renderedPageAsset: "/page-134.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 76,
                  width: 310,
                  height: 10,
                  text: "程」的「個案研究」主體的價值，但作為在這個時代中「真的還活著」"
                },
                {
                  x: 54,
                  y: 94,
                  width: 310,
                  height: 10,
                  text: "的一個人，我的故事若能啟發幾分讀者，便可稱有「譬諸山肴野蔌，聊"
                },
                {
                  x: 54,
                  y: 112,
                  width: 245,
                  height: 10,
                  text: "而雜陳，倘俎諸五侯之鯖，當輾然一笑」之幸運了吧。"
                },
                {
                  x: 54,
                  y: 158,
                  width: 311,
                  height: 19,
                  text: "二、一切的開始，因緣際會，恰逢其時"
                },
                {
                  x: 54,
                  y: 227,
                  width: 308,
                  height: 17,
                  text: "（一）國族意識：中華民族與美利堅民族？"
                },
                {
                  x: 74,
                  y: 280,
                  width: 285,
                  height: 10,
                  text: "一般來講，大陸零零後漢族學生，「國族意識」大概率早於「民族"
                },
                {
                  x: 54,
                  y: 298,
                  width: 63,
                  height: 10,
                  text: "意識」萌發。"
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
        <ArticleView view={continuationView} preferences={preferences} />
      </PreferenceSync>
    );

    const articleText = container.querySelector(".article-pages")?.textContent ?? "";

    expect(articleText).toContain("我不知自己是否具有成为「二十一世纪汉人民族意识重新觉醒历程」的「个案研究」主体的价值");
    expect(articleText.indexOf("我不知自己是否具有成为「二十一世纪汉人民族意识重新觉醒历程」的「个案研究」主体的价值")).toBeLessThan(
      articleText.indexOf("二、一切的开始，因缘际会，恰逢其时")
    );
    expect(articleText.indexOf("二、一切的开始，因缘际会，恰逢其时")).toBeLessThan(
      articleText.indexOf("（一）国族意识：中华民族与美利坚民族？")
    );
    expect(articleText.indexOf("（一）国族意识：中华民族与美利坚民族？")).toBeLessThan(
      articleText.indexOf("一般来讲，大陆零零后汉族学生")
    );
  });

  it("keeps cross-page inline footnote markers attached to the correct phrase", () => {
    const footnoteCarryOverView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-133-footnote",
        titleHans: "妾身元是分明月",
        titleHant: "妾身元是分明月",
        startPage: 134,
        endPage: 135,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p134-footnote",
              locale: "zh-Hans",
              pageNumber: 134,
              pageLabel: "134",
              renderedPageAsset: "/page-134.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 74,
                  y: 466,
                  width: 285,
                  height: 10,
                  text: "那些年，小学老师勒令我们熟读《意林》《读者》《知音》《青年文"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p135-footnote",
              locale: "zh-Hans",
              pageNumber: 135,
              pageLabel: "135",
              renderedPageAsset: "/page-135.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 76,
                  width: 60,
                  height: 10,
                  text: "摘》四大名著"
                },
                {
                  x: 117,
                  y: 75,
                  width: 237,
                  height: 11,
                  text: "2，并常常指着书说：「美国人最有创造力、日本人最文"
                },
                {
                  x: 54,
                  y: 94,
                  width: 310,
                  height: 10,
                  text: "明、德国人最严谨。你们得下苦功学好英语，才能走出去和外国人交朋"
                },
                {
                  x: 54,
                  y: 112,
                  width: 68,
                  height: 10,
                  text: "友，长见识。」"
                },
                {
                  x: 54,
                  y: 442,
                  width: 310,
                  height: 82,
                  text: "2 大陆改革开放初期，大量以「虚构的外国真善美、中国假恶丑的故事」为主要内容的杂志创刊。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p134-footnote-hant",
              locale: "zh-Hant",
              pageNumber: 134,
              pageLabel: "134",
              renderedPageAsset: "/page-134.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 74,
                  y: 466,
                  width: 285,
                  height: 10,
                  text: "那些年，小學老師勒令我們熟讀《意林》《讀者》《知音》《青年文"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p135-footnote-hant",
              locale: "zh-Hant",
              pageNumber: 135,
              pageLabel: "135",
              renderedPageAsset: "/page-135.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 76,
                  width: 60,
                  height: 10,
                  text: "摘》四大名著"
                },
                {
                  x: 114,
                  y: 75,
                  width: 237,
                  height: 11,
                  text: "2，並常常指著書說：「美國人最有創造力、日本人最文"
                },
                {
                  x: 54,
                  y: 94,
                  width: 310,
                  height: 10,
                  text: "明、德國人最嚴謹。你們得下苦功學好英語，才能走出去和外國人交朋"
                },
                {
                  x: 54,
                  y: 112,
                  width: 73,
                  height: 10,
                  text: "友，長見識。」"
                },
                {
                  x: 54,
                  y: 443,
                  width: 310,
                  height: 80,
                  text: "2 大陸改革開放初期，大量以「虛構的外國真善美、中國假惡醜的故事」為主要內容的雜誌創刊。"
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
        <ArticleView view={footnoteCarryOverView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p"));
    const combinedHtml = bodyParagraphs.map((node) => node.innerHTML).join("");
    const combinedText = bodyParagraphs.map((node) => node.textContent ?? "").join("");

    expect(combinedHtml).toContain("《青年文摘》四大名著<sup>2</sup>，并常常指着书说");
    expect(combinedText).toContain("日本人最文明、德国人最严谨。你们得下苦功学好英语，才能走出去和外国人交朋友，长见识。");
    expect(combinedText).not.toContain("《青年文2，并");
    expect(combinedText).not.toContain("摘》四大名著明、德国人最严谨");
    expect(bodyParagraphs.some((node) => (node.textContent ?? "").startsWith("明、德国人最严谨"))).toBe(false);
  });

  it("keeps split footnote continuations out of body text and preserves later markers", () => {
    const splitFootnoteView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-136-footnote",
        titleHans: "妾身元是分明月",
        titleHant: "妾身元是分明月",
        startPage: 136,
        endPage: 137,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p136-footnote",
              locale: "zh-Hans",
              pageNumber: 136,
              pageLabel: "136",
              renderedPageAsset: "/page-136.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 74,
                  y: 466,
                  width: 225,
                  height: 10,
                  text: "我仍记得那时我最喜欢《笑傲江"
                },
                {
                  x: 54,
                  y: 500,
                  width: 310,
                  height: 24,
                  text: "5 参见当年明月《明朝那些事儿．第一部．洪武大帝》（杭州：浙江人民出版"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p137-footnote",
              locale: "zh-Hans",
              pageNumber: 137,
              pageLabel: "137",
              renderedPageAsset: "/page-137.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 76,
                  width: 225,
                  height: 10,
                  text: "湖》，我现在拒绝去回想「为什么最喜欢」。"
                },
                {
                  x: 74,
                  y: 130,
                  width: 290,
                  height: 10,
                  text: "需要注意，查大作家分不清「吕将军在守襄阳」6是哪个「吕将军」在守襄阳。"
                },
                {
                  x: 54,
                  y: 486,
                  width: 310,
                  height: 38,
                  text: "社，2012），第84-91页。6 汪元量《醉歌．其一》：吕将军在守襄阳，十载襄阳铁脊梁。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p136-footnote-hant",
              locale: "zh-Hant",
              pageNumber: 136,
              pageLabel: "136",
              renderedPageAsset: "/page-136.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 74,
                  y: 466,
                  width: 225,
                  height: 10,
                  text: "我仍記得那時我最喜歡《笑傲江"
                },
                {
                  x: 54,
                  y: 500,
                  width: 310,
                  height: 24,
                  text: "5 參見當年明月《明朝那些事兒．第一部．洪武大帝》（杭州：浙江人民出版"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p137-footnote-hant",
              locale: "zh-Hant",
              pageNumber: 137,
              pageLabel: "137",
              renderedPageAsset: "/page-137.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 76,
                  width: 225,
                  height: 10,
                  text: "湖》，我現在拒絕去回想「為什麼最喜歡」。"
                },
                {
                  x: 74,
                  y: 130,
                  width: 290,
                  height: 10,
                  text: "需要注意，查大作家分不清「呂將軍在守襄陽」6是哪個「呂將軍」在守襄陽。"
                },
                {
                  x: 54,
                  y: 486,
                  width: 310,
                  height: 38,
                  text: "社，2012），第84-91頁。6 汪元量《醉歌．其一》：呂將軍在守襄陽，十載襄陽鐵脊梁。"
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
        <ArticleView view={splitFootnoteView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p"));
    const combinedHtml = bodyParagraphs.map((node) => node.innerHTML).join("");
    const combinedText = bodyParagraphs.map((node) => node.textContent ?? "").join("");
    const footnoteText = Array.from(container.querySelectorAll(".article-footnotes"))
      .map((node) => node.textContent ?? "")
      .join("");

    expect(combinedText).toContain("我仍记得那时我最喜欢《笑傲江湖》，我现在拒绝去回想「为什么最喜欢」。");
    expect(combinedHtml).toContain("「吕将军在守襄阳」<sup>6</sup>是哪个");
    expect(combinedText).not.toContain("社，2012），第84-91页。6 汪元量");
    expect(footnoteText).toContain("5参见当年明月《明朝那些事儿．第一部．洪武大帝》（杭州：浙江人民出版社，2012），第84-91页。");
    expect(footnoteText).toContain("6汪元量《醉歌．其一》：吕将军在守襄阳，十载襄阳铁脊梁。");
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

  it("attaches standalone OCR footnote-marker blocks to the preceding line across the issue", () => {
    const detachedMarkerView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-009",
        titleHans: "复周：一个未完成的大计划",
        titleHant: "復周：一個未完成的大計劃",
        startPage: 9,
        endPage: 9,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p009-detached",
              locale: "zh-Hans",
              pageNumber: 9,
              pageLabel: "9",
              renderedPageAsset: "/page-009.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 133,
                  width: 314,
                  height: 27,
                  text: "统治中国心灵的唯一的封建朝代"
                },
                {
                  x: 54,
                  y: 386,
                  width: 305,
                  height: 12,
                  text: "讲授的：尧传舜的「允执厥中」，怕大家看不明白，舜传禹的时候，加"
                },
                {
                  x: 355,
                  y: 405,
                  width: 5,
                  height: 11,
                  text: "4"
                },
                {
                  x: 54,
                  y: 404,
                  width: 300,
                  height: 12,
                  text: "以讲解为十六个字：「人心惟危，道心惟微，惟精惟一，允执厥中」。"
                },
                {
                  x: 54,
                  y: 452,
                  width: 310,
                  height: 72,
                  text: "4 朱熹《中庸章句．序》：《中庸》何为而作也？"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p009-detached-hant",
              locale: "zh-Hant",
              pageNumber: 9,
              pageLabel: "9",
              renderedPageAsset: "/page-009.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 134,
                  width: 314,
                  height: 25,
                  text: "統治中國心靈的唯一的封建朝代"
                },
                {
                  x: 54,
                  y: 386,
                  width: 305,
                  height: 10,
                  text: "講授的：堯傳舜的「允執厥中」，怕大家看不明白，舜傳禹的時候，加"
                },
                {
                  x: 355,
                  y: 405,
                  width: 5,
                  height: 11,
                  text: "4"
                },
                {
                  x: 54,
                  y: 404,
                  width: 300,
                  height: 10,
                  text: "以講解爲十六個字：「人心惟危，道心惟微，惟精惟一，允執厥中」。"
                },
                {
                  x: 54,
                  y: 452,
                  width: 310,
                  height: 66,
                  text: "4 朱熹《中庸章句．序》：《中庸》何爲而作也？"
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
        <ArticleView view={detachedMarkerView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p"));

    expect(bodyParagraphs).toHaveLength(2);
    expect(bodyParagraphs[1]?.innerHTML ?? "").toContain("以讲解为十六个字：「人心惟危，道心惟微，惟精惟一，允执厥中」。<sup>4</sup>");
    expect(bodyParagraphs.some((paragraph) => paragraph.textContent?.trim() === "4")).toBe(false);
  });

  it("attaches OCR footnote markers that are sorted before their target line", () => {
    const leadingDetachedMarkerView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-051",
        titleHans: "皇汉的形成与过去十年",
        titleHant: "皇漢的形成與過去十年",
        startPage: 51,
        endPage: 51,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p051-leading-marker",
              locale: "zh-Hans",
              pageNumber: 51,
              pageLabel: "51",
              renderedPageAsset: "/page-051.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 243,
                  width: 312,
                  height: 10,
                  text: "共同的问题高于一切！后来人们心中发生了疑问，于是大家开始分手四"
                },
                {
                  x: 54,
                  y: 259,
                  width: 312,
                  height: 10,
                  text: "散，回到民族的院落里去：让各人只靠自己吧！「民族问题」高于一切！……"
                },
                {
                  x: 275,
                  y: 273,
                  width: 7,
                  height: 13,
                  text: "14"
                },
                {
                  x: 54,
                  y: 274,
                  width: 220,
                  height: 10,
                  text: "解放运动愈趋低落，民族主义的花朵就愈加怒放。"
                },
                {
                  x: 54,
                  y: 442,
                  width: 309,
                  height: 82,
                  text: "14 《斯大林选集（上卷）》〈马克思主义与民族问题〉（北京：人民出版社，1979 年12 月），页59-60。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p051-leading-marker-hant",
              locale: "zh-Hant",
              pageNumber: 51,
              pageLabel: "51",
              renderedPageAsset: "/page-051.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 243,
                  width: 312,
                  height: 10,
                  text: "共同的問題高於一切！後來人們心中發生了疑問，於是大家開始分手四"
                },
                {
                  x: 54,
                  y: 259,
                  width: 312,
                  height: 10,
                  text: "散，回到民族的院落裏去：讓各人只靠自己吧！「民族問題」高於一切！……"
                },
                {
                  x: 314,
                  y: 274,
                  width: 7,
                  height: 12,
                  text: "14"
                },
                {
                  x: 54,
                  y: 275,
                  width: 260,
                  height: 10,
                  text: "解放運動愈趨低落，民族主義的花朵就愈加怒放。"
                },
                {
                  x: 54,
                  y: 501,
                  width: 294,
                  height: 21,
                  text: "14 《斯大林選集（上卷）》〈馬克思主義與民族問題〉（北京：人民出版社，1979 年12 月），頁59-60。"
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
        <ArticleView view={leadingDetachedMarkerView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p"));

    expect(bodyParagraphs).toHaveLength(1);
    expect(bodyParagraphs[0]?.innerHTML ?? "").toContain("解放运动愈趋低落，民族主义的花朵就愈加怒放。<sup>14</sup>");
    expect(bodyParagraphs.some((paragraph) => paragraph.textContent?.trim() === "14")).toBe(false);
  });

  it("hides the table of contents when an article has no sections", () => {
    const { container } = render(
      <PreferenceSync preferences={preferences}>
        <ArticleView
          view={{
            ...view,
            article: {
              ...view.article,
              sections: []
            },
            toc: []
          }}
          preferences={preferences}
        />
      </PreferenceSync>
    );

    expect(screen.queryByRole("heading", { name: "本文目录" })).toBeNull();
    expect(container.querySelector(".article-toc")).toBeNull();
  });

  it("keeps split section headings in document order and removes their source blocks from body text", () => {
    const splitHeadingView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-296",
        titleHans: "总序：《汉留》的守备范围",
        titleHant: "總序：《漢留》的守備範圍",
        startPage: 296,
        endPage: 299,
        sections: [
          {
            level: 2,
            page: 299,
            titleHans: "人口问题",
            titleHant: "人口問題"
          },
          {
            level: 2,
            page: 299,
            titleHans: "民族政策：「以少制汉」？「Ｋ签证」再加一批移民？",
            titleHant: "民族政策：「以少制漢」？「Ｋ簽證」再加一批移民？"
          }
        ]
      },
      toc: [
        {
          id: "page-296-s1",
          page: 299,
          titleHans: "人口问题",
          titleHant: "人口問題"
        },
        {
          id: "page-296-s2",
          page: 299,
          titleHans: "民族政策：「以少制汉」？「Ｋ签证」再加一批移民？",
          titleHant: "民族政策：「以少制漢」？「Ｋ簽證」再加一批移民？"
        }
      ],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p299",
              locale: "zh-Hans",
              pageNumber: 299,
              pageLabel: "299",
              renderedPageAsset: "/page-299.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 40,
                  width: 300,
                  height: 12,
                  text: "我欲如何将它办成一种有机的、灵活的、别出心裁的、介乎主流与非主流之间的「中国研究」平台。"
                },
                {
                  x: 54,
                  y: 120,
                  width: 150,
                  height: 30,
                  text: "人口问题"
                },
                {
                  x: 54,
                  y: 200,
                  width: 270,
                  height: 28,
                  text: "民族政策：「以少制汉」？「Ｋ签证」"
                },
                {
                  x: 54,
                  y: 234,
                  width: 180,
                  height: 28,
                  text: "再加一批移民？"
                },
                {
                  x: 54,
                  y: 300,
                  width: 280,
                  height: 12,
                  text: "中共在民族政策上套用了苏联的失败办法。"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p299-hant",
              locale: "zh-Hant",
              pageNumber: 299,
              pageLabel: "299",
              renderedPageAsset: "/page-299.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 40,
                  width: 300,
                  height: 12,
                  text: "我欲如何將它辦成一種有機的、靈活的、別出心裁的、介乎主流與非主流之間的「中國研究」平台。"
                },
                {
                  x: 54,
                  y: 120,
                  width: 150,
                  height: 25,
                  text: "人口問題"
                },
                {
                  x: 54,
                  y: 200,
                  width: 270,
                  height: 24,
                  text: "民族政策：「以少制漢」？「Ｋ簽證」"
                },
                {
                  x: 54,
                  y: 228,
                  width: 180,
                  height: 24,
                  text: "再加一批移民？"
                },
                {
                  x: 54,
                  y: 300,
                  width: 280,
                  height: 10,
                  text: "中共在民族政策上套用了蘇聯的失敗辦法。"
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
        <ArticleView view={splitHeadingView} preferences={preferences} />
      </PreferenceSync>
    );

    const anchorLabels = Array.from(container.querySelectorAll(".section-anchor")).map((node) => node.textContent?.trim());
    const bodyText = Array.from(container.querySelectorAll(".article-blocks"))
      .map((node) => node.textContent ?? "")
      .join("");

    expect(anchorLabels).toEqual(["人口问题", "民族政策：「以少制汉」？「Ｋ签证」再加一批移民？"]);
    expect(bodyText).toContain("我欲如何将它办成一种有机的、灵活的、别出心裁的、介乎主流与非主流之间的「中国研究」平台。");
    expect(bodyText).toContain("中共在民族政策上套用了苏联的失败办法。");
    expect(bodyText).not.toContain("人口问题");
    expect(bodyText).not.toContain("民族政策：「以少制汉」？「Ｋ签证」");
    expect(bodyText).not.toContain("再加一批移民？");
  });

  it("places positioned images in reading order instead of forcing them to the end of the page", () => {
    const imageFlowView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-318",
        titleHans: "图文测试",
        titleHant: "圖文測試",
        startPage: 318,
        endPage: 318,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p318-flow",
              locale: "zh-Hans",
              pageNumber: 318,
              pageLabel: "318",
              renderedPageAsset: "/page-318.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 360,
                  width: 300,
                  height: 12,
                  text: "从玄学角度对满式服装的一图流揭发批判，出现于2025 年底。"
                },
                {
                  x: 54,
                  y: 400,
                  width: 300,
                  height: 12,
                  text: "按：「厂」为「廠」的简体字。"
                }
              ],
              images: [
                {
                  src: "/page-318-01.png",
                  alt: "《漢留》第 318 页插图 1",
                  width: 320,
                  height: 280,
                  x: 54,
                  y: 60
                } as never
              ]
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p318-flow-hant",
              locale: "zh-Hant",
              pageNumber: 318,
              pageLabel: "318",
              renderedPageAsset: "/page-318.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 360,
                  width: 300,
                  height: 12,
                  text: "從玄學角度對滿式服裝的一圖流揭發批判，出現於2025 年底。"
                }
              ],
              images: [
                {
                  src: "/page-318-01.png",
                  alt: "《漢留》第 318 页插图 1",
                  width: 320,
                  height: 280,
                  x: 54,
                  y: 60
                } as never
              ]
            }
          ]
        }
      }
    };

    const { container } = render(
      <PreferenceSync preferences={preferences}>
        <ArticleView view={imageFlowView} preferences={preferences} />
      </PreferenceSync>
    );

    const pageSection = container.querySelector(".article-page-section");
    const orderedChildren = Array.from(pageSection?.children ?? []).map((node) =>
      node instanceof HTMLElement
        ? node.matches(".article-gallery, .article-blocks")
          ? node.className
          : node.tagName.toLowerCase()
        : ""
    );

    expect(orderedChildren).toEqual(["article-gallery", "article-blocks"]);
  });

  it("does not merge a previous page into a later low-position block on the next page", () => {
    const lateStartView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-320",
        titleHans: "版记测试",
        titleHant: "版記測試",
        startPage: 320,
        endPage: 321,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p320-metadata",
              locale: "zh-Hans",
              pageNumber: 320,
              pageLabel: "320",
              renderedPageAsset: "/page-320.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 381,
                  width: 235,
                  height: 12,
                  text: "人民币赞助（支付宝）：youtien@gmail.com 或扫码右图"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p321-metadata",
              locale: "zh-Hans",
              pageNumber: 321,
              pageLabel: "321",
              renderedPageAsset: "/page-321.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 310,
                  width: 162,
                  height: 28,
                  text: "漢留 第一集 复汉．兴华．拯天下"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p320-metadata-hant",
              locale: "zh-Hant",
              pageNumber: 320,
              pageLabel: "320",
              renderedPageAsset: "/page-320.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 381,
                  width: 235,
                  height: 12,
                  text: "人民幣贊助（支付寶）：youtien@gmail.com 或掃碼右圖"
                }
              ],
              images: []
            },
            {
              pageId: "issue-01-p321-metadata-hant",
              locale: "zh-Hant",
              pageNumber: 321,
              pageLabel: "321",
              renderedPageAsset: "/page-321.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 310,
                  width: 162,
                  height: 28,
                  text: "漢留 第一集 復漢．興華．拯天下"
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
        <ArticleView view={lateStartView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p")).map((node) => node.textContent?.trim());

    expect(bodyParagraphs).toEqual([
      "人民币赞助（支付宝）：youtien@gmail.com 或扫码右图",
      "漢留 第一集 复汉．兴华．拯天下"
    ]);
  });

  it("keeps short metadata lines as separate paragraphs instead of merging them like wrapped prose", () => {
    const metadataListView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-320-links",
        titleHans: "联系信息测试",
        titleHant: "聯絡資訊測試",
        startPage: 320,
        endPage: 320,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p320-links",
              locale: "zh-Hans",
              pageNumber: 320,
              pageLabel: "320",
              renderedPageAsset: "/page-320.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 301,
                  width: 299,
                  height: 12,
                  text: "《汉留》知乎专栏：https://www.zhihu.com/column/c_1943336370526454758"
                },
                {
                  x: 54,
                  y: 317,
                  width: 271,
                  height: 12,
                  text: "《汉留》Ｂ站专区：https://space.bilibili.com/3621415/lists/6317849"
                },
                {
                  x: 54,
                  y: 333,
                  width: 203,
                  height: 12,
                  text: "《汉留》Pateron 专页：http://patreon.com/youtien"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p320-links-hant",
              locale: "zh-Hant",
              pageNumber: 320,
              pageLabel: "320",
              renderedPageAsset: "/page-320.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 301,
                  width: 299,
                  height: 12,
                  text: "《漢留》知乎專欄：https://www.zhihu.com/column/c_1943336370526454758"
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
        <ArticleView view={metadataListView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p")).map((node) => node.textContent?.trim());

    expect(bodyParagraphs).toEqual([
      "《汉留》知乎专栏：https://www.zhihu.com/column/c_1943336370526454758",
      "《汉留》Ｂ站专区：https://space.bilibili.com/3621415/lists/6317849",
      "《汉留》Pateron 专页：http://patreon.com/youtien"
    ]);
  });

  it("keeps short stacked colophon lines separate on closing pages", () => {
    const colophonView: ArticleViewModel = {
      ...view,
      article: {
        ...view.article,
        slug: "page-321-colophon",
        titleHans: "版记短行测试",
        titleHant: "版記短行測試",
        startPage: 321,
        endPage: 321,
        sections: []
      },
      toc: [],
      locales: {
        "zh-Hans": {
          pages: [
            {
              pageId: "issue-01-p321-colophon",
              locale: "zh-Hans",
              pageNumber: 321,
              pageLabel: "321",
              renderedPageAsset: "/page-321.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 310,
                  width: 162,
                  height: 28,
                  text: "漢留 第一集 复汉．兴华．拯天下"
                },
                {
                  x: 54,
                  y: 344,
                  width: 95,
                  height: 14,
                  text: "Celestial Reserve vol.1"
                },
                {
                  x: 54,
                  y: 362,
                  width: 61,
                  height: 13,
                  text: "Reviving China"
                }
              ],
              images: []
            }
          ]
        },
        "zh-Hant": {
          pages: [
            {
              pageId: "issue-01-p321-colophon-hant",
              locale: "zh-Hant",
              pageNumber: 321,
              pageLabel: "321",
              renderedPageAsset: "/page-321.jpg",
              viewport: { width: 420, height: 595 },
              textBlocks: [
                {
                  x: 54,
                  y: 310,
                  width: 162,
                  height: 28,
                  text: "漢留 第一集 復漢．興華．拯天下"
                },
                {
                  x: 54,
                  y: 344,
                  width: 95,
                  height: 14,
                  text: "Celestial Reserve vol.1"
                },
                {
                  x: 54,
                  y: 362,
                  width: 61,
                  height: 13,
                  text: "Reviving China"
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
        <ArticleView view={colophonView} preferences={preferences} />
      </PreferenceSync>
    );

    const bodyParagraphs = Array.from(container.querySelectorAll(".article-blocks p")).map((node) => node.textContent?.trim());

    expect(bodyParagraphs).toEqual(["漢留 第一集 复汉．兴华．拯天下", "Celestial Reserve vol.1", "Reviving China"]);
  });
});
