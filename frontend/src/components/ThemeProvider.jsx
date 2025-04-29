import { useEffect } from "react";
import { useSelector } from "react-redux";
import { THEMES } from "../store/themeSlice";

export function ThemeProvider({ children }) {
  const { themePreference, effectiveTheme } = useSelector(
    (state) => state.theme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("dark");

    if (effectiveTheme === THEMES.DARK) {
      root.classList.add("dark");
    }

    localStorage.setItem("theme", themePreference);
  }, [themePreference, effectiveTheme]);

  useEffect(() => {
    if (themePreference !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const root = window.document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themePreference]);

  return children;
}
