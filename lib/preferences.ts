import type { LocaleCode } from "@/lib/content/types";

export type ReaderTheme = "light" | "dark";

export type ReaderPreferences = {
  theme: ReaderTheme;
  script: LocaleCode;
  fontScale: number;
};

export function parsePreferences(searchParams?: Record<string, string | string[] | undefined>): ReaderPreferences {
  const theme = pickString(searchParams?.theme);
  const script = pickString(searchParams?.script);
  const fontScale = Number(pickString(searchParams?.fontScale) ?? "1");

  return {
    theme: theme === "dark" ? "dark" : "light",
    script: script === "zh-Hant" ? "zh-Hant" : "zh-Hans",
    fontScale: Number.isFinite(fontScale) ? fontScale : 1
  };
}

function pickString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
