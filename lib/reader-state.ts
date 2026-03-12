type ReaderHrefInput = {
  pathname: string;
  params: URLSearchParams;
  patch: Record<string, string>;
};

const FONT_MIN = 0.9;
const FONT_MAX = 1.2;
const ZOOM_STEPS = [0.85, 1, 1.15] as const;

export function buildReaderHref({ pathname, params, patch }: ReaderHrefInput): string {
  const nextParams = new URLSearchParams(params);

  Object.entries(patch).forEach(([key, value]) => {
    nextParams.set(key, value);
  });

  const queryString = nextParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function clampFontScale(value: number): number {
  return Math.min(FONT_MAX, Math.max(FONT_MIN, roundToTenth(value)));
}

export function clampPageZoom(value: number): number {
  return ZOOM_STEPS.reduce((closest, current) => {
    return Math.abs(current - value) < Math.abs(closest - value) ? current : closest;
  }, ZOOM_STEPS[0]);
}

function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10;
}
