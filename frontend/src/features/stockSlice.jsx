import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

const stockSlice = createSlice({
  name: "stock",

  initialState: {
    purchases: [],
    sales: [],
    firms: [],
    brands: [],
    products: [],
    categories: [],
    loading: false,
    error: false,
    test: 0,
  },
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = false;
    },

    getSuccess: (state, { payload: { data, url } }) => {
      state.loading = false;
      state[url] = data;
    },

    getFirmsSuccess: (state, { payload }) => {
      state.loading = false;
      state.firms = payload;
    },

    getProdCatgBrndsSuccess: (state, { payload }) => {
      state.loading = false;
      state.products = payload[0];
      state.categories = payload[1];
      state.brands = payload[2];
    },

    getPurchSalesSuccess: (state, { payload }) => {
      state.loading = false;
      state.purchases = payload[0];
      state.sales = payload[1];
    },

    fetchFail: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    test: (state, { payload }) => {
      payload++;
      return { ...state, updatedPayload: payload };
    },
  },
});

const persistConfig = {
  key: "stock",
  storage,
};

const persistedStockReducer = persistReducer(persistConfig, stockSlice.reducer);

export const {
  fetchStart,
  getSuccess,
  getFirmsSuccess,
  fetchFail,
  getProdCatgBrndsSuccess,
  getPurchSalesSuccess,
  test,
} = stockSlice.actions;
export default persistedStockReducer;
