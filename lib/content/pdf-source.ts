import path from "node:path";
import { promises as fs } from "node:fs";

import type { LocaleCode } from "@/lib/content/types";
import { getIssuePdfFileName } from "@/lib/content/pdf";

export async function resolveIssuePdfFilePath(issueId: string, script: LocaleCode) {
  for (const locale of buildLocaleFallbacks(script)) {
    const fileName = getIssuePdfFileName(issueId, locale);

    if (!fileName) {
      continue;
    }

    const candidates = [
      path.join(process.cwd(), fileName),
      path.join(process.cwd(), "public", "pdfs", issueId, `${locale}.pdf`),
      path.join(process.cwd(), "public", "pdfs", `${issueId}.${locale}.pdf`)
    ];

    for (const candidate of candidates) {
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        // Try the next convention.
      }
    }
  }

  return null;
}

function buildLocaleFallbacks(script: LocaleCode): LocaleCode[] {
  return script === "zh-Hant" ? ["zh-Hant", "zh-Hans"] : ["zh-Hans", "zh-Hant"];
}
