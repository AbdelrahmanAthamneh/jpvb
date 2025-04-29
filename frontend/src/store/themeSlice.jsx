import { createSlice } from "@reduxjs/toolkit";

export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
};

const getSystemTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }
  return THEMES.LIGHT;
};

const getStoredTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  return storedTheme || THEMES.SYSTEM;
};

const getEffectiveTheme = (themePreference) => {
  return themePreference === THEMES.SYSTEM ? getSystemTheme() : themePreference;
};

const initialState = {
  themePreference: getStoredTheme(),
  effectiveTheme: getEffectiveTheme(getStoredTheme()),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const newTheme = action.payload;
      state.themePreference = newTheme;
      state.effectiveTheme = getEffectiveTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    },
    updateSystemTheme: (state) => {
      if (state.themePreference === THEMES.SYSTEM) {
        state.effectiveTheme = getSystemTheme();
      }
    },
  },
});

export const { setTheme, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
