import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { Avatar, Divider, Stack, Typography } from "@mui/material";
import useAuthCall from "../hooks/useAuthCall";
import { useDispatch, useSelector } from "react-redux";
import socials from "../helper/socials";

const SocialButton = ({ name, url }) => {
  const { loading } = useSelector((state) => state.auth);
  const { socialAuthorize } = useAuthCall();

  return (
    <LoadingButton
      variant="contained"
      loading={loading}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
      }}
      spacing={2}
      onClick={async (e) => {
        await socialAuthorize(name, url);
      }}
    >
      <Avatar
        alt={name}
        sx={{ width: "1.5rem", height: "1.5rem" }}
        src={`/images/${name}_Logo.png`}
      />
      <div style={{ flexGrow: 1, textAlign: "center" }}>
        {`Continue with ${name}`}
      </div>
    </LoadingButton>
  );
};

const SocialLogins = () => {
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        color={theme.palette.success.dark}
      >
        OR
      </Typography>

      {Object.keys(socials).map((social, index) => (
        <SocialButton name={social} url={socials[social]} key={index} />
      ))}
    </>
  );
};

export default SocialLogins;
