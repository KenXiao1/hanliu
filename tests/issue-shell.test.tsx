import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IssueShell } from "@/components/site/issue-shell";
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

vi.mock("@/components/site/reader-toolbar", () => ({
  ReaderToolbar: () => <div data-testid="reader-toolbar" />
}));

const issue: IssueManifest = {
  issueId: "issue-01",
  title: "漢留",
  subtitle: "山海与星海之间",
  cover: "/cover.jpg",
  defaultLocale: "zh-Hans",
  pageCount: 321,
  articles: [],
  toc: []
};

const preferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  fontScale: 1
};

describe("IssueShell", () => {
  it("routes the site mark back to the series homepage", () => {
    render(
      <IssueShell
        issue={issue}
        preferences={preferences}
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        currentRouteKind="issue"
      >
        <div>content</div>
      </IssueShell>
    );

    expect(screen.getByRole("link", { name: /Celestial Reserve/ }).getAttribute("href")).toBe("/");
  });
});
