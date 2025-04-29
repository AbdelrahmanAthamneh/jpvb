import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: localStorage.getItem("authToken") ? true : false,
  user: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = {
        username: action.payload.username,
      };
      state.error = null;
      state.loading = false;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    register: (state, action) => {
      state.isAuthenticated = true;
      state.user = {
        username: action.payload.username,
      };
      state.error = null;
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("authToken");
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { loginStart, login, registerStart, register, logout, setError } =
  authSlice.actions;
export default authSlice.reducer;
