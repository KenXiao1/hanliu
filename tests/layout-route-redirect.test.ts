import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

globalThis.React = React;

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  redirect: (...args: unknown[]) => redirectMock(...args)
}));

describe("legacy layout routes", () => {
  beforeEach(() => {
    redirectMock.mockReset();
  });

  it("redirects issue-scoped page layout routes to the issue pdf reader", async () => {
    const pageModule = await import("@/app/issues/[issueId]/read/page/[page]/page");

    await pageModule.default({
      params: Promise.resolve({ issueId: "issue-01", page: "30" }),
      searchParams: Promise.resolve({ script: "zh-Hant", theme: "dark" })
    });

    expect(redirectMock).toHaveBeenCalledWith("/issues/issue-01/pdf?script=zh-Hant&theme=dark");
  });

  it("redirects implicit layout routes to the canonical pdf reader", async () => {
    const pageModule = await import("@/app/read/page/[page]/page");

    await pageModule.default({
      params: Promise.resolve({ page: "30" }),
      searchParams: Promise.resolve({ script: "zh-Hans", theme: "light" })
    });

    expect(redirectMock).toHaveBeenCalledWith("/pdf?script=zh-Hans&theme=light");
  });
});
