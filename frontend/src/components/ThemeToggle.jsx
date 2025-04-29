import { useDispatch, useSelector } from "react-redux";
import { setTheme, THEMES } from "../store/themeSlice";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const dispatch = useDispatch();
  const { themePreference } = useSelector((state) => state.theme);

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
      <button
        onClick={() => dispatch(setTheme(THEMES.LIGHT))}
        className={`p-2 rounded-md ${
          themePreference === THEMES.LIGHT
            ? "bg-white text-black shadow-sm dark:bg-gray-700 dark:text-white"
            : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        }`}
        aria-label="Light mode"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => dispatch(setTheme(THEMES.DARK))}
        className={`p-2 rounded-md ${
          themePreference === THEMES.DARK
            ? "bg-white text-black shadow-sm dark:bg-gray-700 dark:text-white"
            : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        }`}
        aria-label="Dark mode"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => dispatch(setTheme(THEMES.SYSTEM))}
        className={`p-2 rounded-md ${
          themePreference === THEMES.SYSTEM
            ? "bg-white text-black shadow-sm dark:bg-gray-700 dark:text-white"
            : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        }`}
        aria-label="System preference"
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}
