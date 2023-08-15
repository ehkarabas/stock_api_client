import { LoadingButton } from "@mui/lab";
import { resetLoading } from "../features/authSlice";
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthCall from "../hooks/useAuthCall";
import axios from "axios";

const Home = () => {
  const { isDark } = useSelector((state) => state.theme);
  const { currentUser, loading, socialProviderName, hasFetchedSocial } =
    useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();

  const { userFetch } = useAuthCall();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const listStyles = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    m: 2,
  };

  useEffect(() => {
    dispatch(resetLoading);
  }, []);

  const prevAuthSocial = useRef();

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchUser = async () => {
      await userFetch();
      setIsLoading(false);
    };

    if (
      state?.from === "socialAuth" &&
      socialProviderName &&
      !hasFetchedSocial
    ) {
      fetchUser();
    }

    hasFetchedSocial && setIsLoading(false);

    state?.from !== "socialAuth" && setIsLoading(false);

    prevAuthSocial.current = socialProviderName;

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, [currentUser, hasFetchedSocial]);

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

  return (
    <>
      <Helmet>
        <title>Auth - Home</title>
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
          alignItems: "flex-start",
        }}
        elevation={10}
      >
        <Box sx={{ m: 0, mt: 1, width: "100%" }}>
          <Typography
            gutterBottom
            variant="h2"
            sx={{ textAlign: "center", color: isDark ? "red" : "green" }}
          >
            Welcome to Auth System!
          </Typography>
          <Typography variant="h6" sx={listStyles} margin={0}>
            This is an incredible authentication system with production level
            features!
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
          <Typography sx={listStyles}>Click the Login button</Typography>
          <LoadingButton
            className="homeButtonMargin"
            variant="contained"
            onClick={() => {
              navigate("/signin");
            }}
            loading={loading}
            disabled={currentUser && true}
          >
            Login
          </LoadingButton>
        </Stack>
      </Paper>
    </>
  );
};

export default Home;
