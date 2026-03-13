import { describe, expect, it } from "vitest";

import { getStandaloneStories, getStandaloneStory } from "@/lib/content/stories";

describe("getStandaloneStories", () => {
  it("lists the hanliu founding story for homepage navigation", async () => {
    const stories = await getStandaloneStories();

    expect(stories).toContainEqual(
      expect.objectContaining({
        slug: "hanliu-founding-story",
        titleHans: "《汉留》创刊故事",
        titleHant: "《漢留》創刊故事"
      })
    );
  });
});

describe("getStandaloneStory", () => {
  it("loads both simplified and traditional markdown sources for the same story", async () => {
    const story = await getStandaloneStory("hanliu-founding-story");

    expect(story).not.toBeNull();
    expect(story?.locales["zh-Hans"].markdown).toContain("## 《汉留》创刊启事(簡体版)");
    expect(story?.locales["zh-Hant"].markdown).toContain("## 《漢留》創刊啟事(繁體版)");
    expect(story?.locales["zh-Hans"].markdown).toContain("发行方式：免费");
    expect(story?.locales["zh-Hant"].markdown).toContain("發行方式：免費");
  });
});
