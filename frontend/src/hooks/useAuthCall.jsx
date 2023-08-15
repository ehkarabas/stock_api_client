import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { socialAuthFetch } from "../features/authSlice";
import {
  fetchStart,
  fetchFail,
  fetchSuccess,
  loginSuccess,
  logoutSuccess,
  userFetchSuccess,
  socialAuthorizeSuccess,
  socialAuthenticateSuccess,
  socialAuthenticateFail,
} from "../features/authSlice";
import { toastSuccessNotify, toastWarnNotify } from "../helper/ToastNotify";
import ErrorCatcher from "../helper/ErrorCatch";
import useAxios from "./useAxios";
import axios from "axios";

const useAuthCall = () => {
  const { axiosPublic, axiosWithToken } = useAxios();
  const { refreshToken, socialProviderName } = useSelector(
    (state) => state.auth
  );
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosPublic.post(`auth/jwt/create/`, userInfo);
      await setTimeout(() => {}, 5000);

      const decodedToken = await axiosPublic.decodeToken(data.access, true);

      const payload = {
        email: decodedToken?.email,
        id: decodedToken?.user_id,
        first_name: data?.first_name,
        last_name: data?.last_name,
        is_staff: data?.is_staff,
        image: data?.image,
        about: data?.about,
        access: data?.access,
        refresh: data?.refresh,
      };

      dispatch(loginSuccess(payload));
      navigate("/stock", { state: { from: "signIn" } });
      toastSuccessNotify("Logged in successfully.");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const logout = async () => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`auth/logout/`, {
        refresh_token: refreshToken,
      });

      dispatch(logoutSuccess());
      navigate("/auth/signin");
      toastSuccessNotify("Logged out.");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const logoutAll = async () => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`auth/logout_all/`);
      dispatch(logoutSuccess());
      navigate("/auth/signin");
      toastSuccessNotify("Logged out from all devices.");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const register = async (userInfo) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosPublic.post(`auth/users/`, userInfo);

      dispatch(fetchSuccess());

      toastSuccessNotify(
        "Registered successfully. Activation email sent to your email, activate your account and login."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const activate = async (obj) => {
    dispatch(fetchStart());
    try {
      await axiosPublic.post(`auth/users/activation/`, obj);

      dispatch(fetchSuccess());
      toastSuccessNotify(
        "Your account has been activated. Login with your credentials."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const reActivate = async (email) => {
    dispatch(fetchStart());
    try {
      await axiosPublic.post(`auth/users/resend_activation/`, email);

      dispatch(fetchSuccess());
      toastSuccessNotify(
        "If you entered your account's email correct, an email has sent to you. Check your email."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error, pathname);
      dispatch(fetchFail(err));
    }
  };

  const pwReset = async (email) => {
    dispatch(fetchStart());
    try {
      await axiosPublic.post(`auth/users/reset_password/`, email);

      dispatch(fetchSuccess());
      toastSuccessNotify(
        "If you entered your account's email correct, an email has sent to you. Check your email."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const pwResetConfirm = async (obj) => {
    dispatch(fetchStart());
    try {
      await axiosPublic.post(`auth/users/reset_password_confirm/`, obj);

      dispatch(fetchSuccess());
      toastSuccessNotify(
        "Your password has been successfully reset. Sign in again."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const emailReset = async (email) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`auth/users/reset_email/`, email);

      await logout();

      toastSuccessNotify(
        "If you entered your account's email correct, an email has sent to you. Check your email."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const emailResetConfirm = async (obj) => {
    dispatch(fetchStart());
    try {
      await axiosPublic.post(`auth/users/reset_email_confirm/`, obj);

      dispatch(fetchSuccess());
      toastSuccessNotify(
        "Your email has been successfully reset. Sign in again with your new email."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const pwChange = async (obj) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.post(`auth/users/set_password/`, obj);

      await logout();

      toastSuccessNotify(
        "Your password has been successfully changed. Sign in again."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const userFetch = async () => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken(`auth/users/me/`);

      socialProviderName && dispatch(socialAuthFetch);
      dispatch(userFetchSuccess(data));
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const updateProfile = async (updatedData) => {
    dispatch(fetchStart());
    try {
      const { data } = await axiosWithToken.patch(
        `auth/users/me/`,
        updatedData
      );
      dispatch(fetchSuccess());
      await userFetch();
      toastSuccessNotify("Profile successfully updated!");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const userDeleteSelf = async (password) => {
    dispatch(fetchStart());
    try {
      await axiosWithToken.delete(`auth/users/me/`, { data: password });

      dispatch(logoutSuccess());

      toastSuccessNotify(
        "Your account has been successfully deleted. To continue browsing the site, login with different account."
      );
      navigate("/auth/signin");
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const socialAuthorize = async (providerName, providerUrl) => {
    const BASE_URL_CLIENT = process.env.REACT_APP_CLIENT_URL;
    const BASE_URL_API = process.env.REACT_APP_API_URL;
    dispatch(fetchStart());
    try {
      const {
        data: { authorization_url },
      } = await axiosPublic(
        `${BASE_URL_API}auth/o/${providerUrl}/?redirect_uri=${BASE_URL_CLIENT}auth/${providerName.toLowerCase()}-auth`,
        { withCredentials: true }
      );

      const url = new URL(authorization_url);
      const getStateFromUrl = url.searchParams.get("state");

      window.location.replace(authorization_url);
    } catch (error) {
      console.error(error);
      const err = ErrorCatcher(error);
      dispatch(fetchFail(err));
    }
  };

  const socialAuthenticate = async ({
    state = null,
    code = null,
    providerName,
    providerUrl,
  }) => {
    const BASE_URL = process.env.REACT_APP_API_URL;

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    };

    const details = {
      state: state,
      code: code,
    };

    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    dispatch(fetchStart());
    try {
      const { data } = await axios.post(
        `${BASE_URL}auth/o/${providerUrl}/?${formBody}`,
        {},
        config
      );
      console.log(
        `${providerName}Authenticate response => ${JSON.stringify(data)}`
      );
      dispatch(socialAuthenticateSuccess(data));
      dispatch(socialAuthorizeSuccess({ providerName, providerUrl }));
      toastSuccessNotify(`Logged in via ${providerName} successfully.`);
    } catch (error) {
      console.error(error);
      const mightBeCookieError = Array.isArray(
        error?.response?.data?.non_field_errors
      )
        ? error?.response?.data?.non_field_errors[0]
        : null;
      typeof mightBeCookieError === "string" &&
        mightBeCookieError
          .split(" ")
          .map((word) => word.toLowerCase())
          .includes("state") &&
        toastWarnNotify(
          `Something might be wrong with your browser cookie settings, try either authenticate via ${providerName} again or clear ${providerName} cookies or authenticate via an email account.`,
          4000
        );
      navigate("/auth/signin");
      const err = ErrorCatcher(error);
      dispatch(socialAuthenticateFail(err));
    }
  };

  return {
    login,
    register,
    logout,
    logoutAll,
    activate,
    reActivate,
    pwReset,
    pwResetConfirm,
    emailReset,
    emailResetConfirm,
    pwChange,
    userFetch,
    updateProfile,
    userDeleteSelf,
    socialAuthorize,
    socialAuthenticate,
  };
};

export default useAuthCall;
