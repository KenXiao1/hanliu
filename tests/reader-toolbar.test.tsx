import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReaderToolbar } from "@/components/site/reader-toolbar";
import type { ReaderPreferences } from "@/lib/preferences";

globalThis.React = React;

const replaceMock = vi.fn();
let mockedPathname = "/issues/issue-01";
let mockedSearchParams = "script=zh-Hans&theme=light";

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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock
  }),
  usePathname: () => mockedPathname,
  useSearchParams: () => new URLSearchParams(mockedSearchParams)
}));

const basePreferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  fontScale: 1
};

describe("ReaderToolbar", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    mockedPathname = "/issues/issue-01";
    mockedSearchParams = "script=zh-Hans&theme=light";
  });

  it("toggles theme locally without triggering a route replace", async () => {
    const user = userEvent.setup();

    render(
      <ReaderToolbar
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        currentRouteKind="issue"
        preferences={basePreferences}
      />
    );

    const toggle = screen.getByRole("button", { name: "切换到夜读" });
    expect(toggle.textContent ?? "").not.toContain("夜读");

    await user.click(toggle);

    expect(replaceMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "切换到日读" })).toBeTruthy();
  });

  it("shows script and font controls directly in the toolbar", () => {
    render(
      <ReaderToolbar
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        currentRouteKind="article"
        preferences={{ ...basePreferences, theme: "dark" }}
      />
    );

    expect(screen.queryByRole("button", { name: "阅读设置" })).toBeNull();
    expect(screen.getByRole("button", { name: /简/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /繁/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /小/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /大/ })).toBeTruthy();
  });

  it("switches script locally without triggering a route replace", async () => {
    const user = userEvent.setup();

    render(
      <ReaderToolbar
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        currentRouteKind="article"
        preferences={basePreferences}
      />
    );

    await user.click(screen.getByRole("button", { name: /繁/ }));

    expect(replaceMock).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "封面" }).getAttribute("href")).toContain("script=zh-Hant");
    expect(screen.getByRole("link", { name: "目录" }).getAttribute("href")).toContain("script=zh-Hant");
  });

  it("shows font scale controls directly for article reading", () => {
    render(
      <ReaderToolbar
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        currentRouteKind="article"
        preferences={basePreferences}
      />
    );

    expect(screen.getByRole("button", { name: /小/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: "100%" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /大/ })).toBeTruthy();
  });

  it("does not expose a global layout mode shortcut in the toolbar", () => {
    render(
      <ReaderToolbar
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        currentRouteKind="article"
        preferences={basePreferences}
      />
    );

    expect(screen.queryByText("版式模式")).toBeNull();
    expect(screen.queryByText("文章模式")).toBeNull();
  });
});
