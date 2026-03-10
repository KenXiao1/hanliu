import { describe, expect, it } from "vitest";

import {
  buildArticleManifests,
  cleanOutlineTitle,
  slugifyArticleTitle
} from "@/lib/content/manifest";
import type { OutlineEntry } from "@/lib/content/types";

describe("cleanOutlineTitle", () => {
  it("removes corrupted suffixes from outline titles", () => {
    expect(cleanOutlineTitle("皇汉是如何出现的17F17F")).toBe("皇汉是如何出现的");
    expect(cleanOutlineTitle("我如何成为皇汉：一个「台湾旗鱼人」的见证231F231F")).toBe(
      "我如何成为皇汉：一个「台湾旗鱼人」的见证"
    );
  });
});

describe("slugifyArticleTitle", () => {
  it("creates stable article slugs from cleaned titles", () => {
    expect(slugifyArticleTitle("从山海出发，向星海征伐", 3)).toBe("page-003");
    expect(slugifyArticleTitle("专题：我如何成为皇汉", 129)).toBe("page-129");
  });
});

describe("buildArticleManifests", () => {
  it("turns outline entries into article manifests with nested sections", () => {
    const outline: OutlineEntry[] = [
      { level: 1, page: 3, titleHans: "从山海出发，向星海征伐", titleHant: "從山海出發，向星海征伐" },
      { level: 2, page: 3, titleHans: "我们是谁？", titleHant: "我們是誰？" },
      { level: 2, page: 4, titleHans: "告别泥土雕刻的旧我", titleHant: "告別泥土雕刻的舊我" },
      { level: 1, page: 8, titleHans: "复周：一个未完成的大计划", titleHant: "復周：一個未完成的大計畫" },
      { level: 2, page: 8, titleHans: "前言", titleHant: "前言" }
    ];

    const result = buildArticleManifests(outline, 12);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      articleId: "issue-01-a001",
      slug: "page-003",
      startPage: 3,
      endPage: 7,
      commentThreadId: "issue-01:page-003"
    });
    expect(result[0].sections).toEqual([
      { level: 2, page: 3, titleHans: "我们是谁？", titleHant: "我們是誰？" },
      { level: 2, page: 4, titleHans: "告别泥土雕刻的旧我", titleHant: "告別泥土雕刻的舊我" }
    ]);
    expect(result[1].endPage).toBe(12);
  });
});
