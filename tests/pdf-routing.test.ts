import { describe, expect, it } from "vitest";

import { buildIssuePdfApiPath, buildIssuePdfAssetPath } from "@/lib/content/pdf";

describe("pdf routing helpers", () => {
  it("maps each script to a stable static asset path", () => {
    expect(buildIssuePdfAssetPath("issue-01", "zh-Hans")).toBe("/pdfs/issue-01/zh-Hans.pdf");
    expect(buildIssuePdfAssetPath("issue-01", "zh-Hant")).toBe("/pdfs/issue-01/zh-Hant.pdf");
  });

  it("keeps the compatibility api route script-specific", () => {
    expect(buildIssuePdfApiPath("issue-01", "zh-Hans")).toBe("/api/issues/issue-01/pdf?script=zh-Hans");
    expect(buildIssuePdfApiPath("issue-01", "zh-Hant")).toBe("/api/issues/issue-01/pdf?script=zh-Hant");
  });
});
