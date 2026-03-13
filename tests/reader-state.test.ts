import { describe, expect, it } from "vitest";

import { buildReaderHref, clampFontScale } from "@/lib/reader-state";

describe("reader-state", () => {
  it("omits the query delimiter when there are no params", () => {
    expect(
      buildReaderHref({
        pathname: "/issues/issue-01",
        params: new URLSearchParams(),
        patch: {}
      })
    ).toBe("/issues/issue-01");
  });

  it("preserves the current route when switching script", () => {
    expect(
      buildReaderHref({
        pathname: "/article/page-003",
        params: new URLSearchParams("mode=article&pageZoom=1&script=zh-Hans&theme=light"),
        patch: { script: "zh-Hant" }
      })
    ).toBe("/article/page-003?script=zh-Hant&theme=light");
  });

  it("clamps article font scale to supported values", () => {
    expect(clampFontScale(0.7)).toBe(0.9);
    expect(clampFontScale(1.26)).toBe(1.2);
  });
});
