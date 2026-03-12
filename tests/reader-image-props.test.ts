import { describe, expect, it } from "vitest";

import { getIssueCoverImageProps, getLayoutPageImageProps } from "@/lib/reader-images";

describe("reader-images", () => {
  it("uses production-safe responsive sizes and eagerly prioritizes the current page", () => {
    expect(
      getLayoutPageImageProps({
        pageNumber: 5,
        viewport: {
          width: 480,
          height: 800
        }
      })
    ).toEqual({
      width: 960,
      height: 1600,
      quality: 68,
      priority: true,
      sizes: "(max-width: 768px) 92vw, (max-width: 1060px) calc(100vw - 140px), 920px"
    });
  });

  it("avoids unsupported CSS functions in the sizes attribute", () => {
    expect(getLayoutPageImageProps({
      pageNumber: 1,
      viewport: {
        width: 300,
        height: 500
      }
    }).sizes).not.toContain("min(");
  });

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
