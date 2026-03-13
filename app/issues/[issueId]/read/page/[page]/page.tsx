import { notFound, redirect } from "next/navigation";

import { parsePreferences } from "@/lib/preferences";
import { withSearchParams } from "@/lib/url";

type IssuePageFallbackReaderProps = {
  params: Promise<{ issueId: string; page: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IssuePageFallbackReader({
  params,
  searchParams
}: IssuePageFallbackReaderProps) {
  const [{ issueId, page }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber)) {
    notFound();
  }

  const preferences = parsePreferences(resolvedSearchParams);
  redirect(
    withSearchParams(`/issues/${issueId}/pdf`, {
      script: preferences.script,
      theme: preferences.theme
    })
  );
}
