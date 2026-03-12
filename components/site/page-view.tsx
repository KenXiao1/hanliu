"use client";

import Image from "next/image";
import Link from "next/link";

import { useReaderPreferences } from "@/components/site/preference-sync";
import type { ReaderPreferences } from "@/lib/preferences";
import { getLayoutPageImageProps } from "@/lib/reader-images";
import { withSearchParams } from "@/lib/url";

type PageViewProps = {
  pageView: Awaited<ReturnType<typeof import("@/lib/content/repository").getPageView>>;
  issueRoot: string;
  preferences: ReaderPreferences;
};

export function PageView({ pageView, issueRoot, preferences }: PageViewProps) {
  const { preferences: activePreferences } = useReaderPreferences(preferences);
  const page = pageView.locales[activePreferences.script];

  if (!page) {
    return (
      <div className="page-banner">
        <p className="eyebrow">页面缺失</p>
        <h1>这一页尚未生成。</h1>
      </div>
    );
  }

  const spread = pageView.spread[activePreferences.script];
  const imageProps = getLayoutPageImageProps({
    pageNumber: page.pageNumber,
    viewport: page.viewport
  });

  return (
    <div className="layout-reader">
      <header className="page-banner">
        <p className="eyebrow">版式模式</p>
        <h1>第 {page.pageNumber} 页</h1>
        <p>原版排印。</p>
      </header>

      <div className="layout-stage">
        <div className="layout-frame" style={{ transform: `scale(${preferences.pageZoom})` }}>
          <Image
            src={page.renderedPageAsset}
            alt={`《漢留》 第 ${page.pageNumber} 页`}
            className="layout-page-image"
            width={imageProps.width}
            height={imageProps.height}
            quality={imageProps.quality}
            priority={imageProps.priority}
            sizes={imageProps.sizes}
          />
        </div>
      </div>

      <nav className="page-nav">
        {spread.previous ? (
          <Link href={withSearchParams(`${issueRoot}/read/page/${spread.previous.pageNumber}`, { ...activePreferences, mode: "layout" })}>
            上一页
          </Link>
        ) : (
          <span />
        )}

        {pageView.article ? (
          <Link href={withSearchParams(`${issueRoot}/article/${pageView.article.slug}`, { ...activePreferences, mode: "article" })}>
            转到所属文章
          </Link>
        ) : null}

        {spread.next ? (
          <Link href={withSearchParams(`${issueRoot}/read/page/${spread.next.pageNumber}`, { ...activePreferences, mode: "layout" })}>
            下一页
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
