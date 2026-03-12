import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SeriesHome } from "@/components/site/series-home";
import type { IssueManifest } from "@/lib/content/types";

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
});
