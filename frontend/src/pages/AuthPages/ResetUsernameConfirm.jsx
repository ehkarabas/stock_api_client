import { useTheme } from "@emotion/react";
import { resetLoading } from "../../features/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import useAuthCall from "../../hooks/useAuthCall";
import { object, string, number, date, InferType, ref } from "yup";
import { Helmet } from "react-helmet";
import { Avatar, Container, Stack, Typography } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Link, Navigate, useParams } from "react-router-dom";
import ResetEmailConfirmForm from "../../components/AuthForms/ResetEmailConfirmForm";

const ResetUsernameConfirm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { emailResetConfirm } = useAuthCall();
  const { currentUser } = useSelector((state) => state.auth);
  const { uid, token } = useParams();

  const newEmailSchema = object({
    new_email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
    re_new_email: string()
      .oneOf([ref("new_email"), null], "Emails must match.")
      .required("You must confirm your email."),
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
        <title>Auth - Reset Email Confirm</title>
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
            <ManageAccountsIcon size="30" />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            color={theme.palette.success.dark}
          >
            Reset Email
          </Typography>
          <Formik
            initialValues={{
              new_email: "",
              re_new_email: "",
            }}
            validationSchema={newEmailSchema}
            onSubmit={async (values, actions) => {
              await emailResetConfirm({ ...values, uid: uid, token: token });
            }}
            component={(props) => <ResetEmailConfirmForm {...props} />}
          />
        </Stack>
      </Container>
    </>
  );
};

export default ResetUsernameConfirm;
