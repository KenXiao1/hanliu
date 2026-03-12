"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { ChevronDown, Languages, MoonStar, SlidersHorizontal, SunMedium, Type } from "lucide-react";

import { clampFontScale, clampPageZoom } from "@/lib/reader-state";
import type { ReaderPreferences } from "@/lib/preferences";
import { withSearchParams } from "@/lib/url";
import { useReaderPreferences } from "@/components/site/preference-sync";

type ReaderToolbarProps = {
  issueHomePath: string;
  tocPath: string;
  discussionPath: string;
  alternateModePath?: string;
  currentRouteKind: "article" | "layout" | "toc" | "issue" | "discussion";
  preferences: ReaderPreferences;
};

export function ReaderToolbar({
  issueHomePath,
  tocPath,
  discussionPath,
  currentRouteKind,
  preferences
}: ReaderToolbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { preferences: activePreferences, updatePreferences } = useReaderPreferences(preferences);

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

  const decorateHref = (targetPath: string) =>
    withSearchParams(targetPath, activePreferences);

  const replaceCurrent = (patch: Partial<ReaderPreferences>) => {
    setSettingsOpen(false);
    startTransition(() => {
      updatePreferences(patch);
    });
  };

  const toggleTheme = () => {
    replaceCurrent({ theme: activePreferences.theme === "light" ? "dark" : "light" });
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
        <Link
          href={decorateHref(discussionPath)}
          className={currentRouteKind === "discussion" ? "toolbar-link is-current" : "toolbar-link"}
        >
          <span>讨论</span>
        </Link>
      </div>

      <div className="toolbar-group toolbar-actions">
        <button
          type="button"
          className="toolbar-link toolbar-theme-toggle"
          onClick={toggleTheme}
          aria-label={activePreferences.theme === "light" ? "切换到夜读" : "切换到日读"}
        >
          {activePreferences.theme === "light" ? <MoonStar size={16} /> : <SunMedium size={16} />}
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
                    className={activePreferences.script === "zh-Hans" ? "toolbar-chip is-active" : "toolbar-chip"}
                    onClick={() => replaceCurrent({ script: "zh-Hans" })}
                  >
                    <Languages size={15} />
                    简
                  </button>
                  <button
                    type="button"
                    className={activePreferences.script === "zh-Hant" ? "toolbar-chip is-active" : "toolbar-chip"}
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
                      <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ pageZoom: clampPageZoom(activePreferences.pageZoom - 0.2) })}>
                        <Type size={15} />
                        远
                      </button>
                      <button type="button" className="toolbar-chip is-active">
                        {Math.round(clampPageZoom(activePreferences.pageZoom) * 100)}%
                      </button>
                      <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ pageZoom: clampPageZoom(activePreferences.pageZoom + 0.2) })}>
                        近
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ fontScale: clampFontScale(activePreferences.fontScale - 0.1) })}>
                        <Type size={15} />
                        小
                      </button>
                      <button type="button" className="toolbar-chip is-active">
                        {Math.round(clampFontScale(activePreferences.fontScale) * 100)}%
                      </button>
                      <button type="button" className="toolbar-chip" onClick={() => replaceCurrent({ fontScale: clampFontScale(activePreferences.fontScale + 0.1) })}>
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
