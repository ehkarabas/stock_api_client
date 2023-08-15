import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import stockSlice, {
  fetchFail,
  getSuccess,
  getFirmsSuccess,
  fetchStart,
  getProdCatgBrndsSuccess,
  getPurchSalesSuccess,
} from "../features/stockSlice";
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";
import useAxios from "./useAxios";

const useStockCall = () => {
  const { axiosWithToken } = useAxios();
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  let url = pathname.slice(7, -1);

  const BASE_URL = process.env.REACT_APP_API_URL;

  const getFirmData = async () => {
    dispatch(fetchStart());

    try {
      const { data } = await axiosWithToken("stock/firms/");
      dispatch(getFirmsSuccess(data));
    } catch (error) {
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message || error.message
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const getStockData = async (urlArgument = undefined) => {
    dispatch(fetchStart());
    if (urlArgument) {
      url = urlArgument;
    }
    try {
      const { data } = await axiosWithToken(
        urlArgument ? "stock/" + urlArgument + "/" : pathname
      );
      dispatch(getSuccess({ data, url }));
    } catch (error) {
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message || error.message
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const deleteStockData = async (id) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`${pathname}${id}/`);
      getStockData();
      toastSuccessNotify(`${url} deleted successfully.`);
    } catch (error) {
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message || error.message
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const postStockData = async (info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(pathname, info);
      getStockData();
      toastSuccessNotify(`${url} posted successfully.`);
    } catch (error) {
      const err = `Error ${error.response.status}: ${
        error.response?.data[Object.keys(error.response?.data)[0]]
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const putStockData = async (id, info) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.put(`${pathname}${id}/`, info);
      getStockData();
      toastSuccessNotify(`${url} edited successfully.`);
    } catch (error) {
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message || error.message
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const getProdCatgBrnds = async (page = url) => {
    dispatch(fetchStart());
    try {
      const [products, categories, brands] = await Promise.all([
        axiosWithToken("stock/products/"),
        axiosWithToken("stock/categories/"),
        axiosWithToken("stock/brands/"),
      ]);

      dispatch(
        getProdCatgBrndsSuccess([
          products?.data,
          categories?.data,
          brands?.data,
        ])
      );
      toastSuccessNotify(`${page} initial fetching successfully done.`);
    } catch (error) {
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message || error.message
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  const getPurchSales = async () => {
    dispatch(fetchStart());
    try {
      const [purchases, sales] = await Promise.all([
        axiosWithToken("stock/purchases/"),
        axiosWithToken("stock/sales/"),
      ]);

      dispatch(getPurchSalesSuccess([purchases?.data, sales?.data]));
      toastSuccessNotify(`stock initial fetching successfully done.`);
    } catch (error) {
      const err = `Error ${error.response.status}: ${
        error.response?.data?.message || error.message
      }`;
      dispatch(fetchFail(err));
      toastErrorNotify(err);
    }
  };

  return {
    getStockData,
    getFirmData,
    deleteStockData,
    postStockData,
    putStockData,
    getProdCatgBrnds,
    getPurchSales,
  };
};

export default useStockCall;
