import { useEffect, useState } from "react";

const themeKey = "parosayshi:new-theme";
const themes = ["peach", "mint", "lilac"] as const;

export type Theme = (typeof themes)[number];

const isTheme = (theme: string | undefined): theme is Theme =>
  Boolean(theme && themes.includes(theme as Theme));

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === "undefined") return "peach";
    const current = document.documentElement.dataset.theme;
    return isTheme(current) ? current : "peach";
  });

  const setTheme = (nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(themeKey, nextTheme);
    } catch (_) {
      // Theme persistence is best-effort.
    }
  };

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  useEffect(() => {
    setTheme(theme);
    // Run once to sync the button state with the early inline script.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { theme, cycleTheme };
}
