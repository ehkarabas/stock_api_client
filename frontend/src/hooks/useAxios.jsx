import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { refreshAccessToken, refreshGoogleToken } from "../features/authSlice";
import { fetchStart, fetchFail, logoutSuccess } from "../features/authSlice";
import { toastSuccessNotify, toastErrorNotify } from "../helper/ToastNotify";
import ErrorCatcher from "../helper/ErrorCatch";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { decodeToken, tokenHasExpired } from "../helper/RefreshCheck";

const useAxios = () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const { token, refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const axiosWithToken = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cancelToken: source.token,
  });

  const logout = async () => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`auth/logout/`, {
        refresh_token: refreshToken,
      });
      dispatch(logoutSuccess());
      navigate("/");
      toastSuccessNotify("Logged out.");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  axiosWithToken.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;

      if (
        originalRequest.url === "auth/logout/" ||
        originalRequest.url === "auth/logout_all/"
      ) {
        return originalRequest;
      } else if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "auth/login/"
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return axiosWithToken(originalRequest);
            })
            .catch((err) => {
              console.error(err);
              const error = ErrorCatcher(err);
              toastErrorNotify(error);
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          dispatch(refreshAccessToken(refreshToken))
            .then((action) => {
              const newToken = action.payload;
              originalRequest.headers["Authorization"] = "Bearer " + newToken;
              processQueue(null, newToken);
              resolve(axiosWithToken(originalRequest));
            })
            .catch(async (err) => {
              await logout();
              console.error(err);
              const error = ErrorCatcher(err);
              toastErrorNotify(error);
              processQueue(err, null);
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      } else {
        console.error(error);
        return Promise.reject(error);
      }
    }
  );

  const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    cancelToken: source.token,
  });

  axiosPublic.decodeToken = decodeToken;

  useEffect(() => {
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  return { axiosWithToken, axiosPublic };
};

export default useAxios;
