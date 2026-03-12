import { NextRequest, NextResponse } from "next/server";

import { buildIssuePdfAssetPath } from "@/lib/content/pdf";
import type { LocaleCode } from "@/lib/content/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ issueId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { issueId } = await context.params;
  const script = normalizeScript(request.nextUrl.searchParams.get("script"));
  const assetPath = buildIssuePdfAssetPath(issueId, script);
  const assetUrl = new URL(assetPath, request.nextUrl.origin);

  return NextResponse.redirect(assetUrl, 307);
}

function normalizeScript(script: string | null): LocaleCode {
  return script === "zh-Hant" ? "zh-Hant" : "zh-Hans";
}
