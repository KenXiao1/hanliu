import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PdfView } from "@/components/site/pdf-view";
import { PreferenceSync } from "@/components/site/preference-sync";
import { ReaderToolbar } from "@/components/site/reader-toolbar";
import { buildIssuePdfAssetPath } from "@/lib/content/pdf";
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

const preferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  mode: "article",
  fontScale: 1,
  pageZoom: 1
};

describe("PdfView", () => {
  it("loads the raw pdf source and reacts to local script changes", async () => {
    const user = userEvent.setup();

    render(
      <PreferenceSync preferences={preferences}>
        <ReaderToolbar
          issueHomePath="/issues/issue-01"
          tocPath="/issues/issue-01/toc"
          discussionPath="/issues/issue-01/discussion"
          currentRouteKind="pdf"
          preferences={preferences}
        />
        <PdfView issueId="issue-01" issueTitle="漢留" />
      </PreferenceSync>
    );

    expect(screen.getByTitle("漢留 PDF 在线阅读").getAttribute("src")).toBe(
      buildIssuePdfAssetPath("issue-01", "zh-Hans")
    );

    await user.click(screen.getByRole("button", { name: "阅读设置" }));
    await user.click(screen.getByRole("button", { name: /繁/ }));

    expect(screen.getByTitle("漢留 PDF 在线阅读").getAttribute("src")).toBe(
      buildIssuePdfAssetPath("issue-01", "zh-Hant")
    );
  });
});
