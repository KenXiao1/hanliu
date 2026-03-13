import type { ReaderTheme } from "@/lib/preferences";
import type { LocaleCode } from "@/lib/content/types";
import { withSearchParams } from "@/lib/url";

const ISSUE_PDF_FILENAMES: Partial<Record<string, Record<LocaleCode, string>>> = {
  "issue-01": {
    "zh-Hans": "Celestial_Reserve_《漢留》第一集（簡體版）20260309.pdf",
    "zh-Hant": "Celestial_Reserve_《漢留》第一集（繁體版）20260309.pdf"
  }
};

const ISSUE_PDF_ASSET_PATHS: Partial<Record<string, Record<LocaleCode, string>>> = {
  "issue-01": {
    "zh-Hans": "/pdfs/issue-01/zh-Hans.pdf",
    "zh-Hant": "/pdfs/issue-01/zh-Hant.pdf"
  }
};

export function buildIssuePdfPagePath(issueRoot: string, script: LocaleCode, theme?: ReaderTheme) {
  return withSearchParams(`${issueRoot.replace(/\/$/, "")}/pdf`, { script, theme });
}

export function buildIssuePdfApiPath(issueId: string, script: LocaleCode) {
  return withSearchParams(`/api/issues/${issueId}/pdf`, { script });
}

export function buildIssuePdfAssetPath(issueId: string, script: LocaleCode) {
  return ISSUE_PDF_ASSET_PATHS[issueId]?.[script] ?? buildIssuePdfApiPath(issueId, script);
}

export function getIssuePdfFileName(issueId: string, script: LocaleCode) {
  return ISSUE_PDF_FILENAMES[issueId]?.[script] ?? null;
}
