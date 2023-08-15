import { configureStore } from "@reduxjs/toolkit";
import persistedAuthReducer from "../features/authSlice";
import persistedThemeReducer from "../features/themeSlice";
import persistedStockReducer from "../features/stockSlice";

import storage from "redux-persist/lib/storage/session";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    stock: persistedStockReducer,
    theme: persistedThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
