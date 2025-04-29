import { createSlice } from "@reduxjs/toolkit";

const getRomajiSetting = () => {
  const setting = localStorage.getItem("romajiEnabled");
  return setting ? JSON.parse(setting) : false;
};

const initialState = {
  romajiEnabled: getRomajiSetting(),
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleRomaji: (state) => {
      state.romajiEnabled = !state.romajiEnabled;
      localStorage.setItem(
        "romajiEnabled",
        JSON.stringify(state.romajiEnabled)
      );
    },
  },
});

export const { toggleRomaji } = settingsSlice.actions;
export default settingsSlice.reducer;
