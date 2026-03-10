export type SiteKind = "series" | "issue";

export type SiteContext = {
  host: string;
  siteKind: SiteKind;
  issueId: string | null;
  isIssueSubdomain: boolean;
};

const ISSUE_SUBDOMAIN_PATTERN = /^(issue-\d+)\./i;
const PATH_ISSUE_PATTERN = /^\/issues\/(issue-\d+)(?:\/|$)/i;

export function resolveSiteContext(host: string, pathname = "/"): SiteContext {
  const normalizedHost = host.toLowerCase();
  const subdomainMatch = normalizedHost.match(ISSUE_SUBDOMAIN_PATTERN);

  if (subdomainMatch) {
    return {
      host,
      siteKind: "issue",
      issueId: subdomainMatch[1],
      isIssueSubdomain: true
    };
  }

  const pathMatch = pathname.match(PATH_ISSUE_PATTERN);
  if (pathMatch) {
    return {
      host,
      siteKind: "issue",
      issueId: pathMatch[1],
      isIssueSubdomain: false
    };
  }

  return {
    host,
    siteKind: "series",
    issueId: null,
    isIssueSubdomain: false
  };
}
