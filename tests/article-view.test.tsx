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
  mode: "article",
  fontScale: 1,
  pageZoom: 1
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
});
