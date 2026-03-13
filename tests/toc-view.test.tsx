import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TocView } from "@/components/site/toc-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import type { IssueManifest } from "@/lib/content/types";
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
      startPage: 3,
      endPage: 12,
      commentThreadId: "issue-01:opening",
      sections: []
    }
  ],
  toc: [
    {
      level: 1,
      page: 1,
      titleHans: "封面题字",
      titleHant: "封面題字"
    },
    {
      level: 1,
      page: 3,
      titleHans: "开篇",
      titleHant: "開篇"
    }
  ]
};

const preferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  fontScale: 1
};

describe("TocView", () => {
  it("routes non-article toc entries to the pdf reader instead of deprecated layout pages", () => {
    render(
      <PreferenceSync preferences={preferences}>
        <TocView issue={issue} issueRoot="/issues/issue-01" script="zh-Hans" />
      </PreferenceSync>
    );

    expect(screen.getByRole("link", { name: /封面题字/ }).getAttribute("href")).toBe(
      "/issues/issue-01/pdf?script=zh-Hans&theme=light"
    );
    expect(screen.getByRole("link", { name: /开篇/ }).getAttribute("href")).toBe(
      "/issues/issue-01/article/opening?theme=light&script=zh-Hans&fontScale=1"
    );
  });
});
