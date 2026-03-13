import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SeriesHome } from "@/components/site/series-home";
import type { IssueManifest } from "@/lib/content/types";
import type { StandaloneStorySummary } from "@/lib/content/stories";

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

const issue: IssueManifest = {
  issueId: "issue-01",
  title: "漢留",
  subtitle: "山海与星海之间",
  cover: "/cover.jpg",
  defaultLocale: "zh-Hans",
  pageCount: 321,
  articles: [
    {
      articleId: "issue-01-a001",
      slug: "opening",
      titleHans: "开篇",
      titleHant: "開篇",
      startPage: 1,
      endPage: 12,
      commentThreadId: "issue-01:opening",
      sections: []
    }
  ],
  toc: []
};

const story: StandaloneStorySummary = {
  slug: "hanliu-founding-story",
  titleHans: "《汉留》创刊故事",
  titleHant: "《漢留》創刊故事",
  summaryHans: "胡又天谈《汉留》的缘起、定位、征稿与发行方式。",
  summaryHant: "胡又天談《漢留》的緣起、定位、徵稿與發行方式。"
};

describe("SeriesHome", () => {
  it("prioritizes direct reading actions when there is only one issue", () => {
    render(<SeriesHome issues={[issue]} />);

    expect(screen.queryByText("浏览全集入口")).toBeNull();
    expect(screen.getByRole("link", { name: "阅读 PDF" }).getAttribute("href")).toBe(
      "/issues/issue-01/pdf?script=zh-Hans"
    );
  });

  it("shows GitHub and Zhihu external links on the homepage", () => {
    render(<SeriesHome issues={[issue]} />);

    expect(screen.getByRole("link", { name: "GitHub" }).getAttribute("href")).toBe(
      "https://github.com/KenXiao1/hanliu"
    );
    expect(screen.getByRole("link", { name: "知乎" }).getAttribute("href")).toBe(
      "https://www.zhihu.com/column/c_1943336370526454758"
    );
  });

  it("renders a legible Zhihu mark for the external link", () => {
    render(<SeriesHome issues={[issue]} />);

    expect(screen.getByRole("link", { name: "知乎" }).textContent).toContain("知");
  });

  it("surfaces standalone stories on the homepage", () => {
    render(<SeriesHome issues={[issue]} stories={[story]} />);

    expect(screen.queryByText("站内文章")).toBeNull();
    expect(screen.queryByText("创刊补充阅读")).toBeNull();
    expect(screen.queryByText("把独立文章放在站内沉淀下来，后续再逐步整理成统一的繁简内容流。")).toBeNull();
    expect(screen.getByRole("heading", { name: "《汉留》创刊故事" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "阅读文章" }).getAttribute("href")).toBe(
      "/stories/hanliu-founding-story"
    );
  });
});
