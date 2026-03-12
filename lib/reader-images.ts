type LayoutPageImageInput = {
  pageNumber: number;
  viewport: {
    width: number;
    height: number;
  };
};

export function getLayoutPageImageProps({ pageNumber, viewport }: LayoutPageImageInput) {
  return {
    width: Math.round(viewport.width * 2),
    height: Math.round(viewport.height * 2),
    quality: 68,
    priority: pageNumber >= 1,
    sizes: "(max-width: 768px) 92vw, (max-width: 1060px) calc(100vw - 140px), 920px"
  };
}
