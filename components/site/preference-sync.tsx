"use client";

import { useEffect } from "react";

import type { ReaderPreferences } from "@/lib/preferences";

export function PreferenceSync({ preferences }: { preferences: ReaderPreferences }) {
  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.script = preferences.script;
    document.documentElement.style.setProperty("--reader-font-scale", String(preferences.fontScale));
    document.documentElement.style.setProperty("--reader-page-zoom", String(preferences.pageZoom));
    window.localStorage.setItem("hanliu-preferences", JSON.stringify(preferences));
  }, [preferences]);

  return null;
}
