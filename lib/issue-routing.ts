import { headers } from "next/headers";

import { resolveSiteContext } from "@/lib/site-context";

const FALLBACK_ISSUE_ID = "issue-01";

export async function getHostSiteContext(pathname = "/") {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";

  return resolveSiteContext(host, pathname);
}

export async function resolveImplicitIssueId(pathname = "/") {
  const context = await getHostSiteContext(pathname);
  return context.issueId ?? FALLBACK_ISSUE_ID;
}
