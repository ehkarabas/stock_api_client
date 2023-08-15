import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import axios from "axios";
import { toastSuccessNotify, toastWarnNotify } from "../helper/ToastNotify";
import ErrorCatcher from "../helper/ErrorCatch";

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, thunkAPI) => {
    const BASE_URL = process.env.REACT_APP_API_URL;
    const { getState, rejectWithValue } = thunkAPI;
    try {
      const response = await axios.post(`${BASE_URL}auth/jwt/refresh/`, {
        refresh: refreshToken,
      });

      const { data } = response;
      toastSuccessNotify("Your token has been successfully renewed.");
      return data.access;
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    currentUser: null,
    id: null,
    first_name: "",
    last_name: "",
    isAdmin: false,
    image: "",
    about: "",
    loading: false,
    error: false,
    errorMessage: "",
    token: null,
    refreshToken: null,
    initialAuth: null,
    socialProviderName: "",
    socialProviderURL: "",
    socialNavigateState: false,
    hasFetchedSocial: false,
  },

  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
      state.errorMessage = "";
    },
    loginSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.errorMessage = "";
      state.socialProviderName = "";
      state.socialProviderURL = "";
      state.currentUser = payload?.email;
      state.id = payload?.id;
      state.first_name = payload?.first_name;
      state.last_name = payload?.last_name;
      state.isAdmin = payload?.is_staff;
      state.image = payload?.image;
      state.about = payload?.about;
      state.token = payload?.access;
      state.refreshToken = payload?.refresh;
      state.initialAuth = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.error = false;
      state.errorMessage = "";
      state.socialProviderName = "";
      state.socialProviderURL = "";
      state.socialNavigateState = false;
      state.hasFetchedSocial = false;
      state.currentUser = null;
      state.id = null;
      state.first_name = "";
      state.last_name = "";
      state.isAdmin = false;
      state.image = "";
      state.about = "";
      state.token = null;
      state.refreshToken = null;
      state.initialAuth = null;
    },
    userFetchSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.errorMessage = "";
      state.currentUser = payload?.email;
      state.id = payload?.id;
      state.first_name = payload?.first_name;
      state.last_name = payload?.last_name;
      state.isAdmin = payload?.is_staff;
      state.image = payload?.image;
      state.about = payload?.about;
      state.initialAuth = false;
    },
    fetchFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = payload;
    },
    fetchSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.errorMessage = "";
    },
    socialAuthorizeSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.errorMessage = "";
      state.socialProviderName = payload?.providerName;
      state.socialProviderURL = payload?.providerUrl;
    },
    socialAuthenticateSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.errorMessage = "";
      state.currentUser = payload?.user;
      state.token = payload?.access;
      state.refreshToken = payload?.refresh;
    },
    socialAuthenticateFail: (state, { payload }) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = payload;
      state.socialProviderName = "";
      state.socialProviderURL = "";
    },
    socialNavigateStateSetter: (state, { payload }) => {
      state.socialNavigateState = payload;
    },
    initialAuthSetter: (state, { payload }) => {
      state.initialAuth = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("auth/resetLoading", (state) => {
        state.loading = false;
        state.error = false;
        state.errorMessage = "";
      })
      .addCase("auth/socialAuthFetch", (state) => {
        state.hasFetchedSocial = true;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.errorMessage = "";
      })
      .addCase(refreshAccessToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.errorMessage = "";
        state.token = payload;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload
          ? action.payload
          : action.error.message;
      });
  },
});

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

export const {
  fetchStart,
  loginSuccess,
  logoutSuccess,
  userFetchSuccess,
  fetchFail,
  fetchSuccess,
  initialAuthSetter,
  socialAuthorizeSuccess,
  socialAuthenticateSuccess,
  socialAuthenticateFail,
  socialNavigateStateSetter,
} = authSlice.actions;
export const resetLoading = { type: "auth/resetLoading" };
export const socialAuthFetch = { type: "auth/socialAuthFetch" };

export default persistedAuthReducer;
