import { useTheme } from "@emotion/react";
import { resetLoading } from "../../features/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import useAuthCall from "../../hooks/useAuthCall";
import { object, string, number, date, InferType, ref } from "yup";
import { Helmet } from "react-helmet";
import { Avatar, Container, Stack, Typography } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Link, Navigate, useParams } from "react-router-dom";
import ResetPwConfirmForm from "../../components/AuthForms/ResetPwConfirmForm";

const ResetPasswordConfirm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pwResetConfirm } = useAuthCall();
  const { currentUser } = useSelector((state) => state.auth);
  const { uid, token } = useParams();

  const newPwSchema = object({
    new_password: string()
      .min(8, "Password must be at least 8 characters.")
      .max(20, "Password must be at most 20 characters.")
      .matches(/\d+/, "Must contain at least 1 digit.")
      .matches(/[a-z]+/, "Must contain at least 1 lowercase.")
      .matches(/[A-Z]+/, "Must contain at least 1 uppercase.")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
        "Must contain at least 1 special character."
      )
      .required("You must enter your new password."),
    re_new_password: string()
      .oneOf([ref("new_password"), null], "Passwords must match.")
      .required("You must confirm your new password."),
  });

  /*
  setFormComp({
    ...formComp,
    [e.target.name]: e.target.value
  });
  JavaScript'teki "computed property name" özelliğinden yararlanilir

  let key = "name";
  let obj = {[key]: "John"}; 

  e.target.name bir değişkendir ve bu değişkeni kullanarak degiskenin degerini objenin key'ine dinamik olarak atamak için computed property names özelliğini kullanıyoruz.
  */

  useEffect(() => {
    dispatch(resetLoading);
  }, []);

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Auth - Reset Password Confirm</title>
      </Helmet>

      <Container maxWidth="sm">
        <Stack justifyContent="center" spacing={2} p={2}>
          <Avatar
            sx={{
              backgroundColor: "success.dark",
              m: "auto",
              width: 40,
              height: 40,
            }}
          >
            <LockResetIcon size="30" />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            color={theme.palette.success.dark}
          >
            Reset Password
          </Typography>
          <Formik
            initialValues={{
              new_password: "",
              re_new_password: "",
            }}
            validationSchema={newPwSchema}
            onSubmit={async (values, actions) => {
              await pwResetConfirm({ ...values, uid: uid, token: token });
            }}
            component={(props) => <ResetPwConfirmForm {...props} />}
          />
        </Stack>
      </Container>
    </>
  );
};

export default ResetPasswordConfirm;
