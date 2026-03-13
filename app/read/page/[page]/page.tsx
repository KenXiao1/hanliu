import { notFound, redirect } from "next/navigation";

import { parsePreferences } from "@/lib/preferences";
import { withSearchParams } from "@/lib/url";

type PageReaderProps = {
  params: Promise<{ page: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PageReader({ params, searchParams }: PageReaderProps) {
  const [{ page }, resolvedSearchParams] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber)) {
    notFound();
  }

  const preferences = parsePreferences(resolvedSearchParams);
  redirect(
    withSearchParams("/pdf", {
      script: preferences.script,
      theme: preferences.theme
    })
  );
}
