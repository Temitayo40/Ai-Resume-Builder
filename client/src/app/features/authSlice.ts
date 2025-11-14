import { createSlice } from "@reduxjs/toolkit";
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
    loading: true,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const { login, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
