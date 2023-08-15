import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toastWarnNotify } from "../helper/ToastNotify";

const PrivateRouter = () => {
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) {
      toastWarnNotify("You must login first to browse users zone.");
    }
  }, []);

  return currentUser ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default PrivateRouter;
