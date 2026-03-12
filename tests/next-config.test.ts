import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("nextConfig headers", () => {
  it("allows same-origin iframe embeds so the inline pdf reader can render", async () => {
    const headerRules = await nextConfig.headers?.();
    const siteWideRule = headerRules?.find((rule) => rule.source === "/:path*");
    const frameHeader = siteWideRule?.headers.find((header) => header.key === "X-Frame-Options");

    expect(frameHeader?.value).toBe("SAMEORIGIN");
  });
});
