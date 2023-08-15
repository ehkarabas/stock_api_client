import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { Form } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";

const ResetEmailConfirmForm = ({
  values,
  handleChange,
  errors,
  touched,
  handleBlur,
}) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <Form className="forms">
      <Stack spacing={2}>
        <TextField
          id="new_email"
          name="new_email"
          label="New Email"
          type="email"
          variant="outlined"
          value={values.new_email}
          error={touched?.new_email && Boolean(errors?.new_email)}
          helperText={touched?.new_email && errors?.new_email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <TextField
          id="re_new_email"
          name="re_new_email"
          label="Confirm New Email"
          type="email"
          variant="outlined"
          value={values.re_new_email}
          error={touched?.re_new_email && Boolean(errors?.re_new_email)}
          helperText={touched?.re_new_email && errors?.re_new_email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <LoadingButton variant="contained" type="submit" loading={loading}>
          Submit
        </LoadingButton>
      </Stack>
    </Form>
  );
};

export default ResetEmailConfirmForm;
