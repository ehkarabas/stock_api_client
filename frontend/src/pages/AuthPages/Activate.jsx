import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import useAuthCall from "../../hooks/useAuthCall";
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { resetLoading } from "../../features/authSlice";

const Activate = () => {
  const { isDark } = useSelector((state) => state.theme);
  const { currentUser, loading } = useSelector((state) => state.auth);
  const { activate } = useAuthCall();
  const { uid, token } = useParams();
  const dispatch = useDispatch();

  const styles = {
    m: 2,
  };

  useEffect(() => {
    dispatch(resetLoading);
  }, []);

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Auth - Activate</title>
      </Helmet>

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
        elevation={10}
      >
        <Box sx={{ m: 0, mt: 1, width: "100%" }}>
          <Typography
            gutterBottom
            variant="h2"
            sx={{ textAlign: "center", color: isDark ? "red" : "green" }}
          >
            Welcome!
          </Typography>
        </Box>

        <Divider variant="middle" flexItem />

        <Stack
          direction="column"
          spacing={2}
          divider={
            <Divider
              variant="middle"
              orientation="horizontal"
              flexItem
              sx={{
                margin: "0 !important",
                width: "calc(100% - 2rem)",
                alignSelf: "center",
              }}
            />
          }
        >
          <Typography sx={styles}>
            Click to the Activate button below to activate your account.
          </Typography>
          <LoadingButton
            variant="contained"
            loading={loading}
            className="homeButtonMargin"
            onClick={async () => {
              await activate({ uid, token });
            }}
          >
            Activate
          </LoadingButton>
        </Stack>
      </Paper>
    </>
  );
};

export default Activate;
