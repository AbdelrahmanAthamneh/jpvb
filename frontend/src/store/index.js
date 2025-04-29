import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import settingsReducer from "./settingsSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    theme: themeReducer,
  },
});
