import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuthCall from "../../hooks/useAuthCall";
import { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import socials from "../../helper/socials";
import { useDispatch, useSelector } from "react-redux";
import { toastWarnNotify } from "../../helper/ToastNotify";

const SocialAuth = () => {
  const { socialProviderName } = useSelector((state) => state.auth);
  const { socialAuthenticate } = useAuthCall();
  const { search, pathname } = useLocation();

  const urlProviderPart = pathname.slice(pathname.indexOf("/", 1) + 1);

  const providerName =
    urlProviderPart.charAt(0).toUpperCase() +
    urlProviderPart.slice(1, urlProviderPart.indexOf("-"));
  const providerUrl = socials[providerName];

  const effectRan = useRef(false);

  useEffect(() => {
    const values = queryString.parse(search);
    console.log(
      `${socialProviderName} location.search values => ${JSON.stringify(
        values,
        null,
        2
      )}`
    );
    const state = values?.state;
    const code = values?.code;

    const socialDispatch = async (state, code, providerName, providerUrl) => {
      await socialAuthenticate({ state, code, providerName, providerUrl });
    };

    if (state && code && !effectRan.current) {
      socialDispatch(state, code, providerName, providerUrl);
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  return <Navigate to="/" state={{ from: "socialAuth" }} />;
};

export default SocialAuth;
