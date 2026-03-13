type ReaderHrefInput = {
  pathname: string;
  params: URLSearchParams;
  patch: Record<string, string>;
};

const FONT_MIN = 0.9;
const FONT_MAX = 1.2;
const OBSOLETE_QUERY_KEYS = ["mode", "pageZoom"] as const;

export function buildReaderHref({ pathname, params, patch }: ReaderHrefInput): string {
  const nextParams = new URLSearchParams(params);

  OBSOLETE_QUERY_KEYS.forEach((key) => {
    nextParams.delete(key);
  });

  Object.entries(patch).forEach(([key, value]) => {
    nextParams.set(key, value);
  });

  const queryString = nextParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function clampFontScale(value: number): number {
  return Math.min(FONT_MAX, Math.max(FONT_MIN, roundToTenth(value)));
}

function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10;
}
