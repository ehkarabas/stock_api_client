import { CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Charts from "../components/Charts";
import KpiCards from "../components/KpiCards";
import useStockCall from "../hooks/useStockCall";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useAuthCall from "../hooks/useAuthCall";
import { useRef } from "react";
import axios from "axios";

const Home = () => {
  const { getStockData, getPurchSales } = useStockCall();
  const { currentUser, socialProviderName, hasFetchedSocial } = useSelector(
    (state) => state.auth
  );
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();

  const { userFetch } = useAuthCall();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const prevAuthSocial = useRef();

  useEffect(() => {
    getPurchSales();
  }, []);

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
    <div>
      <Typography variant="h4" color="error" mb={3}>
        Dashboard
      </Typography>
      <KpiCards />
      <Charts />
    </div>
  );
};

export default Home;
