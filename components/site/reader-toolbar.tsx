"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Languages, MoonStar, SlidersHorizontal, SunMedium, Type } from "lucide-react";

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [settingsOpen]);

  const currentParams = new URLSearchParams(searchParams.toString());
  const decorateHref = (targetPath: string) =>
    buildReaderHref({
      pathname: targetPath,
      params: currentParams,
      patch: {}
    });

  const replaceCurrent = (patch: Record<string, string>) => {
    setSettingsOpen(false);
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

  const toggleTheme = () => {
    replaceCurrent({ theme: preferences.theme === "light" ? "dark" : "light" });
  };

  return (
    <div className="reader-toolbar">
      <div className="toolbar-group toolbar-nav">
        <Link
          href={decorateHref(issueHomePath)}
          className={currentRouteKind === "issue" ? "toolbar-link is-current" : "toolbar-link"}
        >
          <span>封面</span>
        </Link>
        <Link
          href={decorateHref(tocPath)}
          className={currentRouteKind === "toc" ? "toolbar-link is-current" : "toolbar-link"}
        >
          <span>目录</span>
        </Link>
        <Link href={decorateHref(discussionPath)} className="toolbar-link">
          <span>讨论</span>
        </Link>
        <Link href={decorateHref(alternateModePath)} className="toolbar-link toolbar-accent">
          <span>{currentRouteKind === "layout" ? "文章模式" : "版式模式"}</span>
        </Link>
      </div>

      <div className="toolbar-group toolbar-actions">
        <button
          type="button"
          className="toolbar-link toolbar-theme-toggle"
          onClick={toggleTheme}
          aria-label={preferences.theme === "light" ? "切换到夜读" : "切换到日读"}
        >
          {preferences.theme === "light" ? <MoonStar size={16} /> : <SunMedium size={16} />}
          <span>{preferences.theme === "light" ? "夜读" : "日读"}</span>
        </button>

        <div className="toolbar-settings-wrap">
          <button
            ref={buttonRef}
            type="button"
            className={settingsOpen ? "toolbar-link toolbar-settings-trigger toolbar-accent" : "toolbar-link toolbar-settings-trigger"}
            onClick={() => setSettingsOpen((v) => !v)}
            aria-expanded={settingsOpen}
            aria-label="阅读设置"
          >
            <SlidersHorizontal size={16} />
            <span>阅读设置</span>
            <ChevronDown size={14} className={settingsOpen ? "toolbar-chevron is-open" : "toolbar-chevron"} />
          </button>

          {settingsOpen && (
            <div ref={panelRef} className="settings-panel">
              <div className="settings-section">
                <p className="settings-label">文字</p>
                <div className="settings-row">
                  <button
                    type="button"
                    className={preferences.script === "zh-Hans" ? "toolbar-chip is-active" : "toolbar-chip"}
                    onClick={() => replaceCurrent({ script: "zh-Hans" })}
                  >
                    <Languages size={15} />
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
              </div>

              <div className="settings-section">
                <p className="settings-label">{currentRouteKind === "layout" ? "版式" : "字号"}</p>
                <div className="settings-row">
                  {currentRouteKind === "layout" ? (
                    <>
                      <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ pageZoom: String(clampPageZoom(preferences.pageZoom - 0.2)) })}>
                        <Type size={15} />
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
                        <Type size={15} />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
