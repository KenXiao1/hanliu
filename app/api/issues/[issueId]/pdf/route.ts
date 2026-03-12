import path from "node:path";
import { promises as fs } from "node:fs";

import { NextRequest, NextResponse } from "next/server";

import { resolveIssuePdfFilePath } from "@/lib/content/pdf-source";
import type { LocaleCode } from "@/lib/content/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ issueId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { issueId } = await context.params;
  const script = normalizeScript(request.nextUrl.searchParams.get("script"));
  const filePath = await resolveIssuePdfFilePath(issueId, script);

  if (!filePath) {
    return new NextResponse(`PDF source not found for ${issueId} (${script}).`, {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  const fileBuffer = await fs.readFile(filePath);

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(path.basename(filePath))}"`,
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function normalizeScript(script: string | null): LocaleCode {
  return script === "zh-Hant" ? "zh-Hant" : "zh-Hans";
}
