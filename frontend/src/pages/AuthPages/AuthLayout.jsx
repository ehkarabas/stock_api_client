import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import image from "../../assets/result.svg";
import Grid from "@mui/material/Grid";

import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import ThemeToggle from "../../components/Theme/ThemeToggle";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const AuthLayout = () => {
  const { isDark } = useSelector((state) => state.theme);

  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundColor: isDark ? "#64748B !important" : "#FFF !important",
      }}
    >
      <Stack direction="row" p={2}>
        <Typography variant="h3" color="primary" align="center" flexGrow={1}>
          STOCK APP AUTH
        </Typography>
        <ThemeToggle />
      </Stack>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="row-reverse"
        rowSpacing={{ sm: 3 }}
        sx={{
          height: "100vh",
          p: 2,
        }}
      >
        <Grid item xs={12} sm={10} md={6}>
          <Outlet />
        </Grid>

        <Grid item xs={0} sm={7} md={6}>
          <Container>
            <img src={image} alt="" />
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthLayout;
