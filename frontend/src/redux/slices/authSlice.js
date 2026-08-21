import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setUser,
  clearUser,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;