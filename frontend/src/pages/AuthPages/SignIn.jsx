import { useTheme } from "@emotion/react";
import { resetLoading } from "../../features/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import useAuthCall from "../../hooks/useAuthCall";
import { object, string, number, date, InferType, ref } from "yup";
import { Helmet } from "react-helmet";
import { Avatar, Container, Stack, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SignInForm from "../../components/AuthForms/SignInForm";
import SocialLogins from "../../components/SocialLogins";

const SignIn = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { login } = useAuthCall();
  const { currentUser } = useSelector((state) => state.auth);

  const loginSchema = object({
    email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
    password: string()
      .min(8, "Password must be at least 8 characters.")
      .max(20, "Password must be at most 20 characters.")
      .matches(/\d+/, "Must contain at least 1 digit.")
      .matches(/[a-z]+/, "Must contain at least 1 lowercase.")
      .matches(/[A-Z]+/, "Must contain at least 1 uppercase.")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
        "Must contain at least 1 special character."
      )
      .required("You must enter your password."),
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
        <title>Auth - Login</title>
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
            <LockIcon size="30" />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            color={theme.palette.success.dark}
          >
            Sign In
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values, actions) => {
              login(values);
            }}
            component={(props) => <SignInForm {...props} />}
          />

          <SocialLogins />

          <Typography>
            Don't have an account?{" "}
            <Link to="/auth/signup/" className="text-red-600">
              Sign up
            </Link>
          </Typography>
          <Typography>
            Forgot your password?{" "}
            <Link to="/auth/reset_password/" className="text-red-600">
              Reset Password
            </Link>
          </Typography>
          <Typography>
            Haven't received activation mail yet?{" "}
            <Link to="/auth/resend_activation/" className="text-red-600">
              Resend Activation
            </Link>
          </Typography>
        </Stack>
      </Container>
    </>
  );
};

export default SignIn;
