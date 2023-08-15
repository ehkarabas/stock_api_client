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

const ResetPwConfirmForm = ({
  values,
  handleChange,
  errors,
  touched,
  handleBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  return (
    <Form className="forms">
      <Stack spacing={2}>
        <TextField
          id="new_password"
          name="new_password"
          label="New Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={values.new_password}
          error={touched?.new_password && Boolean(errors?.new_password)}
          helperText={touched?.new_password && errors?.new_password}
          onChange={handleChange}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
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
          required
        />

        <TextField
          id="re_new_password"
          name="re_new_password"
          label="Confirm New Password"
          type={showPassword2 ? "text" : "password"}
          variant="outlined"
          value={values.re_new_password}
          error={touched?.re_new_password && Boolean(errors?.re_new_password)}
          helperText={touched?.re_new_password && errors?.re_new_password}
          onChange={handleChange}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
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

        <LoadingButton variant="contained" type="submit" loading={loading}>
          Submit
        </LoadingButton>
      </Stack>
    </Form>
  );
};

export default ResetPwConfirmForm;
