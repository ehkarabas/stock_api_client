import { Formik } from "formik";
import { object, string, number, date, InferType, ref } from "yup";
import { resetLoading } from "../../features/authSlice";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Container, Stack, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useTheme } from "@emotion/react";
import useAuthCall from "../../hooks/useAuthCall";
import { Link, Navigate } from "react-router-dom";
import SignUpForm from "../../components/AuthForms/SignUpForm";
import SocialLogins from "../../components/SocialLogins";

const SignUp = () => {
  const theme = useTheme();
  const { register } = useAuthCall();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const isValidUrl = (url) => {
    if (!url) {
      return true;
    }

    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    return true;
  };

  const signupSchema = object({
    email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
    first_name: string()
      .min(2, "Name must be at least 2 characters.")
      .max(40, "Name must be at most 40 characters.")
      .required("You must enter your name."),
    last_name: string()
      .min(2, "Surname must be at least 2 characters.")
      .max(40, "Surname must be at most 40 characters.")
      .required("You must enter your surname."),
    image: string()
      .test("is-url-valid", "URL is not valid", (value) => isValidUrl(value))
      .notRequired(),
    about: string()
      .min(10, "Bio must be at least 10 characters.")
      .max(500, "Bio must be at most 100 characters.")
      .notRequired(),
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
    re_password: string()
      .oneOf([ref("password"), null], "Passwords must match.")
      .required("You must confirm your password."),
  });

  useEffect(() => {
    dispatch(resetLoading);
  }, []);

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Auth - Signup</title>
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
            Sign Up
          </Typography>
          <Formik
            initialValues={{
              email: "",
              first_name: "",
              last_name: "",
              image: "",
              about: "",
              password: "",
              re_password: "",
            }}
            validationSchema={signupSchema}
            onSubmit={(values, actions) => {
              register(values);
            }}
            component={(props) => <SignUpForm {...props} />}
          />
          <Typography>
            Already have an account?{" "}
            <Link to="/auth/signin" className="text-red-600">
              Login
            </Link>
          </Typography>

          <SocialLogins />
        </Stack>
      </Container>
    </>
  );
};

export default SignUp;
