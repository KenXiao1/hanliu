"use client";

import { startTransition } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BookOpenText, Languages, MoonStar, Palette, ScrollText, SunMedium, Type } from "lucide-react";

import { buildReaderHref, clampFontScale, clampPageZoom } from "@/lib/reader-state";
import type { ReaderPreferences } from "@/lib/preferences";

type ReaderToolbarProps = {
  issueHomePath: string;
  tocPath: string;
  discussionPath: string;
  alternateModePath: string;
  currentRouteKind: "article" | "layout" | "toc" | "issue";
  preferences: ReaderPreferences;
};

export function ReaderToolbar({
  issueHomePath,
  tocPath,
  discussionPath,
  alternateModePath,
  currentRouteKind,
  preferences
}: ReaderToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams.toString());
  const decorateHref = (targetPath: string) =>
    buildReaderHref({
      pathname: targetPath,
      params: currentParams,
      patch: {}
    });

  const replaceCurrent = (patch: Record<string, string>) => {
    startTransition(() => {
      router.replace(
        buildReaderHref({
          pathname,
          params: currentParams,
          patch
        }),
        { scroll: false }
      );
    });
  };

  return (
    <div className="reader-toolbar">
      <div className="toolbar-group toolbar-nav">
        <Link href={decorateHref(issueHomePath)} className="toolbar-link">
          <Palette size={16} />
          <span>封面</span>
        </Link>
        <Link href={decorateHref(tocPath)} className="toolbar-link">
          <ScrollText size={16} />
          <span>目录</span>
        </Link>
        <Link href={decorateHref(discussionPath)} className="toolbar-link">
          <BookOpenText size={16} />
          <span>讨论</span>
        </Link>
        <Link href={decorateHref(alternateModePath)} className="toolbar-link toolbar-accent">
          <span>{currentRouteKind === "layout" ? "文章模式" : "版式模式"}</span>
        </Link>
      </div>

      <div className="toolbar-group">
        <div className="toolbar-label">
          <MoonStar size={16} />
          <span>主题</span>
        </div>
        <button
          type="button"
          className={preferences.theme === "light" ? "toolbar-chip is-active" : "toolbar-chip"}
          onClick={() => replaceCurrent({ theme: "light" })}
        >
          <SunMedium size={15} />
          明
        </button>
        <button
          type="button"
          className={preferences.theme === "dark" ? "toolbar-chip is-active" : "toolbar-chip"}
          onClick={() => replaceCurrent({ theme: "dark" })}
        >
          <MoonStar size={15} />
          暗
        </button>
      </div>

      <div className="toolbar-group">
        <div className="toolbar-label">
          <Languages size={16} />
          <span>字體</span>
        </div>
        <button
          type="button"
          className={preferences.script === "zh-Hans" ? "toolbar-chip is-active" : "toolbar-chip"}
          onClick={() => replaceCurrent({ script: "zh-Hans" })}
        >
          简
        </button>
        <button
          type="button"
          className={preferences.script === "zh-Hant" ? "toolbar-chip is-active" : "toolbar-chip"}
          onClick={() => replaceCurrent({ script: "zh-Hant" })}
        >
          繁
        </button>
      </div>

      <div className="toolbar-group">
        <div className="toolbar-label">
          <Type size={16} />
          <span>{currentRouteKind === "layout" ? "缩放" : "字号"}</span>
        </div>
        {currentRouteKind === "layout" ? (
          <>
            <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ pageZoom: String(clampPageZoom(preferences.pageZoom - 0.2)) })}>
              远
            </button>
            <button type="button" className="toolbar-chip is-active">
              {Math.round(clampPageZoom(preferences.pageZoom) * 100)}%
            </button>
            <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ pageZoom: String(clampPageZoom(preferences.pageZoom + 0.2)) })}>
              近
            </button>
          </>
        ) : (
          <>
            <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ fontScale: String(clampFontScale(preferences.fontScale - 0.1)) })}>
              小
            </button>
            <button type="button" className="toolbar-chip is-active">
              {Math.round(clampFontScale(preferences.fontScale) * 100)}%
            </button>
            <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ fontScale: String(clampFontScale(preferences.fontScale + 0.1)) })}>
              大
            </button>
          </>
        )}
      </div>
    </div>
  );
}
