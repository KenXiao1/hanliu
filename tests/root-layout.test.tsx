import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  LXGW_WenKai_TC: () => ({ variable: "font-body" }),
  Noto_Serif_TC: () => ({ variable: "font-display" })
}));

import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("does not preconnect to giscus on every page", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div>child</div>
      </RootLayout>
    );

    expect(html).not.toContain("giscus.app");
  });
});
