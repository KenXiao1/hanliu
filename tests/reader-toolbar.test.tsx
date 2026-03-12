import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReaderToolbar } from "@/components/site/reader-toolbar";
import type { ReaderPreferences } from "@/lib/preferences";

globalThis.React = React;

const replaceMock = vi.fn();
let mockedPathname = "/issues/issue-01";
let mockedSearchParams = "mode=article&script=zh-Hans&theme=light";

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
  mode: "article",
  fontScale: 1,
  pageZoom: 1
};

describe("ReaderToolbar", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    mockedPathname = "/issues/issue-01";
    mockedSearchParams = "mode=article&script=zh-Hans&theme=light";
  });

  it("shows a direct theme toggle in the toolbar", async () => {
    const user = userEvent.setup();

    render(
      <ReaderToolbar
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        alternateModePath="/issues/issue-01/read/page/1"
        currentRouteKind="issue"
        preferences={basePreferences}
      />
    );

    await user.click(screen.getByRole("button", { name: "切换到夜读" }));

    expect(replaceMock).toHaveBeenCalledWith(
      "/issues/issue-01?mode=article&script=zh-Hans&theme=dark",
      { scroll: false }
    );
  });

  it("uses a labeled settings trigger for secondary reading preferences", async () => {
    const user = userEvent.setup();

    render(
      <ReaderToolbar
        issueHomePath="/issues/issue-01"
        tocPath="/issues/issue-01/toc"
        discussionPath="/issues/issue-01/discussion"
        alternateModePath="/issues/issue-01/read/page/1"
        currentRouteKind="layout"
        preferences={{ ...basePreferences, theme: "dark", mode: "layout" }}
      />
    );

    await user.click(screen.getByRole("button", { name: "阅读设置" }));

    expect(screen.getByText("文字")).toBeTruthy();
    expect(screen.getByText("版式")).toBeTruthy();
  });
});
