import { Avatar, Container, Stack, Typography } from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { useTheme } from "@mui/styles";
import { Formik } from "formik";
import useAuthCall from "../../hooks/useAuthCall";
import { object, string, number, date, InferType, ref } from "yup";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { resetLoading } from "../../features/authSlice";
import { Navigate, useLocation } from "react-router-dom";
import ResetPwReActivateForm from "../../components/AuthForms/ResetPwReActivateForm";

const ResetPwAndReActivate = () => {
  const theme = useTheme();
  const { pwReset, reActivate } = useAuthCall();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  const resetRequestSchema = object({
    email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
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
        <title>
          {pathname === "/auth/reset_password/"
            ? "Auth - Reset Password"
            : "Auth - Account Re-activation"}
        </title>
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
            <PsychologyAltIcon size="30" />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            color={theme.palette.success.dark}
          >
            {pathname === "/auth/reset_password/"
              ? "Reset Password"
              : "Resend Activation"}
          </Typography>
          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={resetRequestSchema}
            onSubmit={async (values, actions) => {
              pathname === "/auth/reset_password/"
                ? await pwReset(values)
                : await reActivate(values);
            }}
            component={(props) => <ResetPwReActivateForm {...props} />}
          />
        </Stack>
      </Container>
    </>
  );
};

export default ResetPwAndReActivate;
