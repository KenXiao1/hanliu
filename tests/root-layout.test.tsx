import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

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

  it("renders without remote font variable classes on body", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div>child</div>
      </RootLayout>
    );

    expect(html).not.toContain("font-body");
    expect(html).not.toContain("font-display");
  });
});
