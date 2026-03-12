import { describe, expect, it } from "vitest";

import { buildReaderHref, clampFontScale, clampPageZoom } from "@/lib/reader-state";

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
        params: new URLSearchParams("mode=article&script=zh-Hans&theme=light"),
        patch: { script: "zh-Hant" }
      })
    ).toBe("/article/page-003?mode=article&script=zh-Hant&theme=light");
  });

  it("clamps article font scale to supported values", () => {
    expect(clampFontScale(0.7)).toBe(0.9);
    expect(clampFontScale(1.26)).toBe(1.2);
  });

  it("clamps page zoom to supported fixed steps", () => {
    expect(clampPageZoom(0.7)).toBe(0.85);
    expect(clampPageZoom(1.3)).toBe(1.15);
  });
});
