import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { string, object, ref } from "yup";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import ProfileForm from "../../components/AuthForms/ProfileForm";
import { useEffect, useState } from "react";
import useAuthCall from "../../hooks/useAuthCall";
import { resetLoading } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const {
    currentUser,
    first_name,
    last_name,
    image,
    about,
    socialProviderName,
  } = useSelector((state) => state.auth);
  const { isDark } = useSelector((state) => state.theme);
  const { userFetch, updateProfile, emailReset, pwChange } = useAuthCall();
  const [initialValues, setInitialValues] = useState({
    email: "",
    name: "",
    image: "",
    about: "",
    new_password: "",
    re_new_password: "",
    re_email: "",
    current_password: "",
    re_current_password: "",
  });
  const [userFetched, setUserFetched] = useState(false);
  const [updateToggle, setUpdateToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidUrl = (url) => {
    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    return true;
  };

  const profileSchema = object({
    email: string()
      .email("Email is not valid.")
      .required("You must enter your email."),
    re_email: string()
      .oneOf([ref("email"), null], "Emails must match.")
      .required("You must confirm your email."),
    first_name: string()
      .min(2, "Name must be at least 2 characters.")
      .max(40, "Name must be at most 40 characters.")
      .required("You must enter your name."),
    last_name: string()
      .min(2, "Surname must be at least 2 characters.")
      .max(40, "Surname must be at most 40 characters.")
      .required("You must enter your surname."),
    image: string()
      .test("is-url-valid", "URL is not valid", isValidUrl)
      .required("You must enter a valid image url."),
    about: string()
      .min(10, "Bio must be at least 10 characters.")
      .max(500, "Bio must be at most 500 characters.")
      .required("You must enter a bio."),
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
    current_password: string()
      .min(8, "Password must be at least 8 characters.")
      .max(20, "Password must be at most 20 characters.")
      .matches(/\d+/, "Must contain at least 1 digit.")
      .matches(/[a-z]+/, "Must contain at least 1 lowercase.")
      .matches(/[A-Z]+/, "Must contain at least 1 uppercase.")
      .matches(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
        "Must contain at least 1 special character."
      )
      .required("You must enter your current password."),
    re_current_password: string()
      .oneOf([ref("current_password"), null], "Passwords must match.")
      .required("You must confirm your current password."),
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      if (currentUser && !socialProviderName) {
        await userFetch();
        setUserFetched(true);

        setInitialValues({
          email: currentUser || "",
          first_name: first_name || "",
          last_name: last_name || "",
          image: image || "",
          about: about || "",
          new_password: "",
          re_new_password: "",
          re_email: "",
          current_password: "",
          re_current_password: "",
        });
      }
      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    if (!isCancelled) {
      setIsLoading(true);
      fetchData();
    }

    return () => {
      setIsLoading(false);
      isCancelled = true;
    };
  }, [updateToggle]);

  useEffect(() => {
    dispatch(resetLoading);
  }, []);

  if (isLoading) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        mt={2}
        sx={{
          width: "100%",
        }}
      >
        <CircularProgress color="success" />
      </Stack>
    );
  }

  if (socialProviderName) {
    return (
      <Paper
        sx={{
          minWidth: "270px",
          width: "50%",
          maxWidth: "768px",
          m: "10px auto",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        elevation={0}
      >
        <Box sx={{ m: 0, mt: 1, width: "100%" }}>
          <Typography
            gutterBottom
            variant="h5"
            sx={{ textAlign: "center", color: isDark ? "red" : "green" }}
          >
            Logged in via {socialProviderName} Auth
          </Typography>
        </Box>

        <Typography sx={{ m: 2 }}>
          Authenticated as {first_name} {last_name}
        </Typography>

        <Avatar
          alt={`${first_name} ${last_name}`}
          sx={{
            width: 60,
            height: 60,
          }}
          src={image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
          }}
        />

        <Typography sx={{ m: 2 }}>
          Your accounts email :{" "}
          {currentUser.slice(0, 2) +
            currentUser.slice(2, currentUser.indexOf("@")).replace(/./g, "*") +
            currentUser.slice(currentUser.indexOf("@"))}
        </Typography>

        <Button
          variant="contained"
          color="info"
          onClick={(e) => {
            navigate(`/`);
          }}
        >
          Home
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Helmet>
        <title>Auth - Profile</title>
      </Helmet>

      <Container maxWidth="sm">
        <Stack
          justifyContent="center"
          direction="column"
          gap={2}
          spacing={2}
          p={2}
        >
          <Typography variant="h4" align="center">
            My Profile
          </Typography>
          <Stack
            direction="column"
            gap={2}
            divider={
              <Divider
                variant="middle"
                orientation="horizontal"
                flexItem
                sx={{
                  margin: "0 !important",
                  width: "100%",
                }}
              />
            }
          >
            {userFetched &&
              [
                "email",
                "first_name",
                "last_name",
                "image",
                "about",
                "new_password",
                "current_password",
              ].map((field) => (
                <Formik
                  key={field}
                  enableReinitialize
                  initialValues={{
                    ...(field === "email" && {
                      email: initialValues["email"],
                      re_email: "",
                    }),
                    ...(field === "new_password" && {
                      new_password: initialValues["new_password"],
                      re_new_password: "",
                      current_password: "",
                    }),
                    ...(field === "current_password" && {
                      current_password: initialValues["current_password"],
                      re_current_password: "",
                    }),
                    ...(field !== "new_password" &&
                      field !== "current_password" &&
                      field !== "email" && {
                        [field]: initialValues[field],
                      }),
                  }}
                  validationSchema={profileSchema.pick([
                    field,
                    ...(field === "email" ? ["re_email"] : []),
                    ...(field === "new_password"
                      ? ["re_new_password", "current_password"]
                      : []),
                    ...(field === "current_password"
                      ? ["re_current_password"]
                      : []),
                  ])}
                  onSubmit={async (
                    values,
                    { resetForm, setSubmitting, setErrors }
                  ) => {
                    if (field !== "current_password") {
                      if (field === "email") {
                        await emailReset({ email: values.email });
                      } else if (field === "new_password") {
                        await pwChange({
                          new_password: values.new_password,
                          re_new_password: values.re_new_password,
                          current_password: values.current_password,
                        });
                      } else {
                        await updateProfile({ [field]: values[field] });
                        setUpdateToggle(!updateToggle);
                      }
                    }
                    setSubmitting(false);
                    resetForm();
                  }}
                >
                  {(formikProps) => (
                    <ProfileForm
                      field={field}
                      updateToggle={updateToggle}
                      {...formikProps}
                    />
                  )}
                </Formik>
              ))}
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default Profile;
