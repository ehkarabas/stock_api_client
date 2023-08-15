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

const SignUpForm = ({ values, handleChange, errors, touched, handleBlur }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  return (
    <Form className="forms">
      <Stack spacing={2}>
        <TextField
          label="Email"
          name="email"
          id="email"
          type="email"
          variant="outlined"
          value={values.email}
          error={touched?.email && Boolean(errors?.email)}
          helperText={touched?.email && errors?.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <TextField
          label="Name"
          name="first_name"
          id="first_name"
          type="text"
          variant="outlined"
          value={values.first_name}
          error={touched?.first_name && Boolean(errors?.first_name)}
          helperText={touched?.first_name && errors?.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={{ "&:focus": { outline: "none !important" } }}
          required
        />

        <TextField
          label="Last Name"
          name="last_name"
          id="last_name"
          type="text"
          variant="outlined"
          value={values.last_name}
          error={touched?.last_name && Boolean(errors?.last_name)}
          helperText={touched?.last_name && errors?.last_name}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={{ "&:focus": { outline: "none !important" } }}
          required
        />

        <TextField
          label="Image Url"
          name="image"
          id="image"
          type="url"
          variant="outlined"
          value={values.image}
          error={touched?.image && Boolean(errors?.image)}
          helperText={touched?.image && errors?.image}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextField
          label="About"
          name="about"
          id="about"
          variant="outlined"
          multiline
          maxRows={4}
          value={values.about}
          error={touched?.about && Boolean(errors?.about)}
          helperText={touched?.about && errors?.about}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <TextField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={values.password}
          error={touched?.password && Boolean(errors?.password)}
          helperText={touched?.password && errors?.password}
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
          id="re_password"
          name="re_password"
          label="Confirm Password"
          type={showPassword2 ? "text" : "password"}
          variant="outlined"
          value={values.re_password}
          error={touched?.re_password && Boolean(errors?.re_password)}
          helperText={touched?.re_password && errors?.re_password}
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

export default SignUpForm;
