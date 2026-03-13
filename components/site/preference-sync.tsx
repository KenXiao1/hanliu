"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";

import { usePathname } from "next/navigation";

import { buildReaderHref, clampFontScale } from "@/lib/reader-state";
import type { ReaderPreferences } from "@/lib/preferences";

type PreferenceContextValue = {
  preferences: ReaderPreferences;
  updatePreferences: (patch: Partial<ReaderPreferences>) => void;
};

const defaultPreferences: ReaderPreferences = {
  theme: "light",
  script: "zh-Hans",
  fontScale: 1
};

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

export function PreferenceSync({
  preferences,
  children
}: {
  preferences: ReaderPreferences;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const [state, setState] = useState(preferences);
  const clearShiftTimer = useRef<number | null>(null);
  const serializedPreferences = JSON.stringify(preferences);

  useEffect(() => {
    setState(preferences);
  }, [pathname, serializedPreferences, preferences]);

  useEffect(() => {
    syncPreferenceEffects(state);
  }, [state]);

  useEffect(() => {
    return () => {
      if (clearShiftTimer.current) {
        window.clearTimeout(clearShiftTimer.current);
      }
    };
  }, []);

  const updatePreferences = (patch: Partial<ReaderPreferences>) => {
    setState((current) => {
      const next = normalizePreferences(current, patch);

      if (typeof window !== "undefined") {
        const nextHref = buildReaderHref({
          pathname,
          params: new URLSearchParams(window.location.search),
          patch: toSearchPatch(next)
        });

        window.history.replaceState(window.history.state, "", nextHref);
        document.documentElement.dataset.preferenceShift = "on";

        if (clearShiftTimer.current) {
          window.clearTimeout(clearShiftTimer.current);
        }

        clearShiftTimer.current = window.setTimeout(() => {
          delete document.documentElement.dataset.preferenceShift;
        }, 180);
      }

      return next;
    });
  };

  const value = {
    preferences: state,
    updatePreferences
  };

  if (!children) {
    return null;
  }

  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

export function useReaderPreferences(initialPreferences: ReaderPreferences = defaultPreferences): PreferenceContextValue {
  const context = useContext(PreferenceContext);
  const [standaloneState, setStandaloneState] = useState(initialPreferences);
  const serializedInitialPreferences = JSON.stringify(initialPreferences);

  useEffect(() => {
    if (!context) {
      setStandaloneState(initialPreferences);
    }
  }, [context, serializedInitialPreferences, initialPreferences]);

  useEffect(() => {
    if (!context) {
      syncPreferenceEffects(standaloneState);
    }
  }, [context, standaloneState]);

  if (context) {
    return context;
  }

  return {
    preferences: standaloneState,
    updatePreferences: (patch) => {
      setStandaloneState((current) => normalizePreferences(current, patch));
    }
  };
}

function normalizePreferences(
  current: ReaderPreferences,
  patch: Partial<ReaderPreferences>
): ReaderPreferences {
  const next = {
    ...current,
    ...patch
  };

  return {
    theme: next.theme === "dark" ? "dark" : "light",
    script: next.script === "zh-Hant" ? "zh-Hant" : "zh-Hans",
    fontScale: clampFontScale(next.fontScale)
  };
}

function syncPreferenceEffects(preferences: ReaderPreferences) {
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.dataset.script = preferences.script;
  document.documentElement.style.setProperty("--reader-font-scale", String(preferences.fontScale));
  window.localStorage.setItem("hanliu-preferences", JSON.stringify(preferences));
}

function toSearchPatch(preferences: ReaderPreferences) {
  return {
    theme: preferences.theme,
    script: preferences.script,
    fontScale: String(preferences.fontScale)
  };
}
