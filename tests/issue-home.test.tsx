import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { IssueHome } from "@/components/site/issue-home";
import { PreferenceSync } from "@/components/site/preference-sync";
import { ReaderToolbar } from "@/components/site/reader-toolbar";
import type { IssueManifest, PageData } from "@/lib/content/types";
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
  default: ({
    alt,
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => <img alt={alt} {...props} />
}));

const preferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  fontScale: 1
};

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

const coverHans: PageData = {
  pageId: "issue-01-cover-hans",
  locale: "zh-Hans",
  pageNumber: 1,
  pageLabel: "1",
  renderedPageAsset: "/cover-hans.jpg",
  viewport: { width: 600, height: 800 },
  textBlocks: [],
  images: []
};

const coverHant: PageData = {
  pageId: "issue-01-cover-hant",
  locale: "zh-Hant",
  pageNumber: 1,
  pageLabel: "1",
  renderedPageAsset: "/cover-hant.jpg",
  viewport: { width: 600, height: 800 },
  textBlocks: [],
  images: []
};

describe("IssueHome preferences", () => {
  it("updates article titles and pdf entry links locally when switching script", async () => {
    const user = userEvent.setup();

    render(
      <PreferenceSync preferences={preferences}>
        <ReaderToolbar
          issueHomePath="/issues/issue-01"
          tocPath="/issues/issue-01/toc"
          discussionPath="/issues/issue-01/discussion"
          currentRouteKind="issue"
          preferences={preferences}
        />
        <IssueHome
          issue={issue}
          coverPages={{
            "zh-Hans": coverHans,
            "zh-Hant": coverHant
          }}
          issueHomePath="/issues/issue-01"
          discussionPath="/issues/issue-01/discussion"
        />
      </PreferenceSync>
    );

    expect(screen.getByRole("heading", { name: "开篇" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "阅读 PDF" }).getAttribute("href")).toContain(
      "/issues/issue-01/pdf?script=zh-Hans"
    );

    await user.click(screen.getByRole("button", { name: /繁/ }));

    expect(screen.getByRole("heading", { name: "開篇" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "阅读 PDF" }).getAttribute("href")).toContain(
      "/issues/issue-01/pdf?script=zh-Hant"
    );
  });
});
