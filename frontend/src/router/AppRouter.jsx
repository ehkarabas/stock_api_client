import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import PrivateRouter from "./PrivateRouter";
import Dashboard from "../pages/Dashboard";
import Purchases from "../pages/Purchases";
import Firms from "../pages/Firms";
import Brands from "../pages/Brands";
import Products from "../pages/Products";
import Sales from "../pages/Sales";
import Home from "../pages/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import AuthLayout from "../pages/AuthPages/AuthLayout";
import SocialAuth from "../pages/AuthPages/SocialAuth";
import SignUp from "../pages/AuthPages/SignUp";
import SignIn from "../pages/AuthPages/SignIn";
import About from "../pages/About";
import ResetPwAndReActivate from "../pages/AuthPages/ResetPwAndReActivate";
import Activate from "../pages/AuthPages/Activate";
import ResetPasswordConfirm from "../pages/AuthPages/ResetPasswordConfirm";
import ResetUsernameConfirm from "../pages/AuthPages/ResetUsernameConfirm";
import Profile from "../pages/AuthPages/Profile";
import { toastWarnNotify } from "../helper/ToastNotify";
import NotFound from "../pages/NotFound";
import { socialNavigateStateSetter } from "../features/authSlice";

const RedirectLayout = () => {
  const { pathname, state } = useLocation();
  const location = useLocation();
  const { currentUser, socialNavigateState, initialAuth } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stateRef = useRef(state?.from);

  useEffect(() => {
    if (pathname === "/") {
      if (currentUser) {
        if (socialNavigateState) {
          dispatch(socialNavigateStateSetter(false));
          navigate("/stock", { state: { from: "socialAuth" } });
        } else {
          navigate("/stock");
        }
      } else if (socialNavigateState) {
      } else {
        if (state?.from !== "socialAuth") {
          navigate("/auth/signin");
        }
      }
    }
    if (pathname.startsWith("/auth") && currentUser) {
      if (!initialAuth) {
        toastWarnNotify("You have already authenticated, continue browsing.");
      }
      navigate("/stock");
    }
  }, [currentUser]);

  useEffect(() => {
    if (stateRef.current === "socialAuth") {
      dispatch(socialNavigateStateSetter(true));
    }
  }, []);

  return <Outlet />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectLayout />} />
        <Route path="auth" element={<AuthLayout />}>
          <Route element={<RedirectLayout />}>
            <Route path="google-auth" element={<SocialAuth />} />
            <Route path="linkedin-auth" element={<SocialAuth />} />
            <Route path="github-auth" element={<SocialAuth />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />

            <Route path="reset_password" element={<ResetPwAndReActivate />} />
            <Route
              path="resend_activation"
              element={<ResetPwAndReActivate />}
            />
            <Route path="activate/:uid/:token" element={<Activate />} />
            <Route
              path="password/reset/confirm/:uid/:token"
              element={<ResetPasswordConfirm />}
            />
            <Route
              path="email/reset/confirm/:uid/:token"
              element={<ResetUsernameConfirm />}
            />
          </Route>
        </Route>
        <Route path="stock" element={<PrivateRouter />}>
          <Route path="" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="sales" element={<Sales />} />
            <Route path="firms" element={<Firms />} />
            <Route path="brands" element={<Brands />} />
            <Route path="products" element={<Products />} />
            <Route path="about" element={<About />} />
            <Route path="auth/profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
