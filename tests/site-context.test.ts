import { describe, expect, it } from "vitest";

import { resolveSiteContext } from "@/lib/site-context";

describe("resolveSiteContext", () => {
  it("detects the series home on the primary domain", () => {
    expect(resolveSiteContext("hanliu.example.com")).toEqual({
      host: "hanliu.example.com",
      isIssueSubdomain: false,
      issueId: null,
      siteKind: "series"
    });
  });

  it("detects issue subdomains", () => {
    expect(resolveSiteContext("issue-01.hanliu.example.com")).toEqual({
      host: "issue-01.hanliu.example.com",
      isIssueSubdomain: true,
      issueId: "issue-01",
      siteKind: "issue"
    });
  });

  it("falls back to path based issue sites in local development", () => {
    expect(resolveSiteContext("localhost:3000", "/issues/issue-01/article/page-003")).toEqual({
      host: "localhost:3000",
      isIssueSubdomain: false,
      issueId: "issue-01",
      siteKind: "issue"
    });
  });
});
