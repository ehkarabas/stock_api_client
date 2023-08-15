import { Form, Field, useFormikContext } from "formik";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import ProfileDeleteModal from "../modals/ProfileDeleteModal";
import { useTheme } from "@mui/styles";

const ProfileForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  field,
  updateToggle,
}) => {
  const isVerificationFieldNeeded = [
    "email",
    "new_password",
    "current_password",
  ].includes(field);
  const { resetForm, setTouched, setErrors, setFieldValue, setFieldTouched } =
    useFormikContext();
  const { currentUser, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const theme = useTheme();

  let emailDomain = "";
  if (currentUser) {
    emailDomain = currentUser.split("@")[1];
  }

  const modalShow = (e) => {
    e.preventDefault();
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    resetForm({ values: { ...values } });
    setTouched({});
    setErrors({});
    setFieldTouched(field, false, false);
  }, [updateToggle]);

  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {field === "current_password" && (
          <Typography variant="h6" textAlign="center" color={"red !important"}>
            DANGER ZONE
          </Typography>
        )}
        <Typography variant="h6" textAlign="center">{`${
          field === "new_password"
            ? "Password"
            : field === "current_password"
            ? "Delete Account"
            : field === "first_name"
            ? "Name"
            : field === "last_name"
            ? "Last Name"
            : field.charAt(0).toUpperCase() + field.slice(1)
        }`}</Typography>
        {field === "email" && (
          <Typography variant="body1">
            Current Email :{" "}
            {currentUser
              ? currentUser.slice(0, 2) +
                currentUser
                  .slice(2, currentUser.indexOf("@"))
                  .replace(/./g, "*") +
                currentUser.slice(currentUser.indexOf("@"))
              : "User not logged in"}
          </Typography>
        )}
        <Field
          name={field}
          as={TextField}
          variant="outlined"
          fullWidth
          label={
            field === "new_password"
              ? (field.charAt(0).toUpperCase() + field.slice(1)).replace(
                  "_",
                  " "
                )
              : field === "current_password"
              ? "Current password"
              : field === "first_name"
              ? "Name"
              : field === "last_name"
              ? "Last Name"
              : field.charAt(0).toUpperCase() + field.slice(1)
          }
          value={field !== "email" ? values[field] : undefined}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched[field] && Boolean(errors[field])}
          helperText={touched[field] && errors[field]}
          type={
            ["email", "first_name", "last_name", "image", "about"].includes(
              field
            )
              ? "text"
              : showPassword
              ? "text"
              : "password"
          }
          InputProps={{
            endAdornment: ["new_password", "current_password"].includes(
              field
            ) && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required={["name", "image", "about"].includes(field) ? false : true}
        />
        {isVerificationFieldNeeded && (
          <Field
            name={`re_${field}`}
            as={TextField}
            variant="outlined"
            fullWidth
            label={`Confirm ${
              field === "new_password"
                ? field.replace("_", " ")
                : field === "current_password"
                ? field.replace("_", " ")
                : field.charAt(0).toUpperCase() + field.slice(1)
            }`}
            value={values[`re_${field}`]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              (touched[`re_${field}`] || touched[`re_new_${field}`]) &&
              Boolean(errors[`re_${field}`])
            }
            helperText={touched[`re_${field}`] && errors[`re_${field}`]}
            type={
              field === "email" ? "text" : showPassword2 ? "text" : "password"
            }
            InputProps={{
              endAdornment: ["new_password", "current_password"].includes(
                field
              ) && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword2(!showPassword2);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />
        )}
        {field === "new_password" && (
          <Field
            name="current_password"
            as={TextField}
            variant="outlined"
            fullWidth
            label="Current password"
            value={values["current_password"]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched["current_password"] && Boolean(errors["current_password"])
            }
            helperText={
              touched["current_password"] && errors["current_password"]
            }
            type={showPassword3 ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword3(!showPassword3);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    edge="end"
                  >
                    {showPassword3 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />
        )}
        <LoadingButton
          variant="contained"
          style={{
            backgroundColor:
              field === "current_password" ? "red" : theme.palette.primary.main,
          }}
          type="submit"
          loading={loading}
          sx={{ alignSelf: "flex-start" }}
          onClick={field === "current_password" ? modalShow : undefined}
          disabled={
            field === "current_password"
              ? Object.keys(errors).length !== 0
              : false
          }
        >
          {field === "email"
            ? "RESET"
            : field === "new_password"
            ? "CHANGE"
            : field === "current_password"
            ? "DELETE"
            : "UPDATE"}
        </LoadingButton>
      </Stack>
      {field === "current_password" && (
        <ProfileDeleteModal
          currentPassword={values.current_password}
          setDeleteModalOpen={setDeleteModalOpen}
          deleteModalOpen={deleteModalOpen}
        />
      )}
    </Form>
  );
};

export default ProfileForm;
