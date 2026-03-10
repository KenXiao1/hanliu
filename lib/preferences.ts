import type { LocaleCode } from "@/lib/content/types";

export type ReaderTheme = "light" | "dark";
export type ReaderMode = "article" | "layout";

export type ReaderPreferences = {
  theme: ReaderTheme;
  script: LocaleCode;
  mode: ReaderMode;
  fontScale: number;
  pageZoom: number;
};

export function parsePreferences(searchParams?: Record<string, string | string[] | undefined>): ReaderPreferences {
  const theme = pickString(searchParams?.theme);
  const script = pickString(searchParams?.script);
  const mode = pickString(searchParams?.mode);
  const fontScale = Number(pickString(searchParams?.fontScale) ?? "1");
  const pageZoom = Number(pickString(searchParams?.pageZoom) ?? "1");

  return {
    theme: theme === "dark" ? "dark" : "light",
    script: script === "zh-Hant" ? "zh-Hant" : "zh-Hans",
    mode: mode === "layout" ? "layout" : "article",
    fontScale: Number.isFinite(fontScale) ? fontScale : 1,
    pageZoom: Number.isFinite(pageZoom) ? pageZoom : 1
  };
}

function pickString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
