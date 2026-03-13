import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreferenceSync } from "@/components/site/preference-sync";
import { StandaloneStoryView } from "@/components/site/standalone-story-view";
import type { StandaloneStory } from "@/lib/content/stories";
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

const story: StandaloneStory = {
  slug: "hanliu-founding-story",
  titleHans: "《汉留》创刊故事",
  titleHant: "《漢留》創刊故事",
  summaryHans: "简体摘要",
  summaryHant: "繁體摘要",
  locales: {
    "zh-Hans": {
      title: "《汉留》创刊启事(簡体版)",
      markdown: "## 《汉留》创刊启事(簡体版)\n\n简体段落。",
      sourcePath: "《汉留》创刊故事简体版-胡又天的文章.md"
    },
    "zh-Hant": {
      title: "《漢留》創刊啟事(繁體版)",
      markdown: "## 《漢留》創刊啟事(繁體版)\n\n繁體段落。",
      sourcePath: "《汉留》创刊故事繁体版.md"
    }
  }
};

describe("StandaloneStoryView", () => {
  it("switches rendered story content when changing script preference", async () => {
    const user = userEvent.setup();

    render(
      <PreferenceSync preferences={preferences}>
        <StandaloneStoryView story={story} preferences={preferences} />
      </PreferenceSync>
    );

    expect(screen.getByRole("heading", { name: "《汉留》创刊故事" })).toBeTruthy();
    expect(screen.getByText("简体段落。")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "繁" }));

    expect(screen.getByRole("heading", { name: "《漢留》創刊故事" })).toBeTruthy();
    expect(screen.getByText("繁體段落。")).toBeTruthy();
  });
});
