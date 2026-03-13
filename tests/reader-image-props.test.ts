import { describe, expect, it } from "vitest";

import { getIssueCoverImageProps } from "@/lib/reader-images";

describe("reader-images", () => {
  it("keeps the issue cover image within the hero slot budget", () => {
    expect(
      getIssueCoverImageProps({
        viewport: {
          width: 873.12,
          height: 612.24
        }
      })
    ).toEqual({
      width: 1310,
      height: 918,
      quality: 64,
      priority: true,
      sizes: "(max-width: 768px) calc(100vw - 36px), (max-width: 1280px) 54vw, 720px"
    });
  });
});
