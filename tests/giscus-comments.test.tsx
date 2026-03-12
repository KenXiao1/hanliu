import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GiscusComments } from "@/components/site/giscus-comments";
import { PreferenceSync } from "@/components/site/preference-sync";
import type { ReaderPreferences } from "@/lib/preferences";

globalThis.React = React;

vi.mock("@giscus/react", () => ({
  default: ({
    theme,
    term
  }: {
    theme: string;
    term: string;
  }) => <div data-testid="giscus" data-theme={theme} data-term={term} />
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/issues/issue-01/discussion"
}));

const lightPreferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  mode: "article",
  fontScale: 1,
  pageZoom: 1
};

describe("GiscusComments", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_GISCUS_REPO", "owner/repo");
    vi.stubEnv("NEXT_PUBLIC_GISCUS_REPO_ID", "repo-id");
    vi.stubEnv("NEXT_PUBLIC_GISCUS_CATEGORY", "General");
    vi.stubEnv("NEXT_PUBLIC_GISCUS_CATEGORY_ID", "category-id");
  });

  it("uses the reader light theme instead of the system color scheme", () => {
    render(
      <PreferenceSync preferences={lightPreferences}>
        <GiscusComments threadId="issue-01" />
      </PreferenceSync>
    );

    expect(screen.getByTestId("giscus").getAttribute("data-theme")).toBe("light");
  });
});
