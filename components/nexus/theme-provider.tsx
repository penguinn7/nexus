"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  THEMES,
  getTheme,
  type NexusTheme,
  type NexusThemeKey,
} from "@/lib/themes";

interface ThemeContextValue {
  theme: NexusThemeKey;
  themeMeta: NexusTheme;
  setTheme: (key: NexusThemeKey) => void;
  availableThemes: NexusTheme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "nexus-theme";

function applyTheme(key: NexusThemeKey) {
  const meta = getTheme(key);
  const root = document.documentElement;
  const vars = meta.vars;
  for (const [name, val] of Object.entries(vars)) {
    root.style.setProperty(name, `hsl(${val})`);
  }
}

export function ThemeProvider({
  children,
  initialTheme = "y2k",
}: {
  children: ReactNode;
  initialTheme?: NexusThemeKey;
}) {
  const [theme, setThemeState] = useState<NexusThemeKey>(initialTheme);

  useEffect(() => {
    let requested: NexusThemeKey = initialTheme;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = stored as NexusThemeKey;
        if (parsed in THEMES) requested = parsed;
      }
    } catch {
      /* ignore */
    }
    setThemeState(requested);
    applyTheme(requested);
  }, [initialTheme]);

  const setTheme = useCallback((key: NexusThemeKey) => {
    setThemeState(key);
    applyTheme(key);
    try {
      window.localStorage.setItem(STORAGE_KEY, key);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeMeta: getTheme(theme),
      setTheme,
      availableThemes: Object.values(THEMES),
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
