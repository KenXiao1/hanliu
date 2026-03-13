"use client";

import { startTransition } from "react";

import Link from "next/link";
import { Languages, MoonStar, SunMedium, Type } from "lucide-react";

import { clampFontScale } from "@/lib/reader-state";
import type { ReaderPreferences } from "@/lib/preferences";
import { withSearchParams } from "@/lib/url";
import { useReaderPreferences } from "@/components/site/preference-sync";

type ReaderToolbarProps = {
  issueHomePath: string;
  tocPath: string;
  discussionPath: string;
  currentRouteKind: "article" | "toc" | "issue" | "discussion" | "pdf";
  preferences: ReaderPreferences;
};

export function ReaderToolbar({
  issueHomePath,
  tocPath,
  discussionPath,
  currentRouteKind,
  preferences
}: ReaderToolbarProps) {
  const { preferences: activePreferences, updatePreferences } = useReaderPreferences(preferences);

  const decorateHref = (targetPath: string) =>
    withSearchParams(targetPath, activePreferences);

  const replaceCurrent = (patch: Partial<ReaderPreferences>) => {
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

        <div className="toolbar-control-group" aria-label="文字切换" role="group">
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

        {currentRouteKind !== "pdf" ? (
          <div className="toolbar-control-group" aria-label="字号调节" role="group">
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
