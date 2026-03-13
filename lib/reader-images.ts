type CoverImageInput = {
  viewport: {
    width: number;
    height: number;
  };
};

export function getIssueCoverImageProps({ viewport }: CoverImageInput) {
  return {
    width: Math.round(viewport.width * 1.5),
    height: Math.round(viewport.height * 1.5),
    quality: 64,
    priority: true,
    sizes: "(max-width: 768px) calc(100vw - 36px), (max-width: 1280px) 54vw, 720px"
  };
}
