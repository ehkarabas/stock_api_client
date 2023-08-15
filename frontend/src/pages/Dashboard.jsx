import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuListItems from "../components/MenuListItems";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useAuthCall from "../hooks/useAuthCall";
import { Outlet, useLocation } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";
import { useState } from "react";
import ThemeToggle from "../components/Theme/ThemeToggle";
import { useTheme } from "@emotion/react";
import { Helmet } from "react-helmet";

const drawerWidth = 240;

function Dashboard(props) {
  const theme = useTheme();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const { currentUser } = useSelector((state) => state.auth);
  const { isDark } = useSelector((state) => state.theme);

  const { logout, logoutAll } = useAuthCall();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Helmet>
        <title>Stock - Dashboard</title>
      </Helmet>
      <Toolbar />
      <Divider />
      <MenuListItems />

      {/* <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </>
  );

  const brandSpanStyle = makeStyles({
    root: {
      color: "aqua",
    },
  });

  const brandSpanClasses = brandSpanStyle();

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Cool<span className={brandSpanClasses.root}>Stock</span>
          </Typography>

          <ThemeToggle />

          {currentUser && (
            <Button
              color="inherit"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          )}
          {currentUser && (
            <Button
              color="inherit"
              onClick={() => {
                logoutAll();
              }}
            >
              Logout All
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: isDark
                ? theme.palette.secondary.dark
                : theme.palette.primary.dark,
              color: "#fff",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: isDark
                ? theme.palette.success.dark
                : theme.palette.primary.light,
              color: "#fff",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {!["/stock/auth/profile", "/stock/about"].includes(pathname) && (
          <Toolbar />
        )}
        {/* <Typography paragraph>
          Lorem ipsum dolor sit amet.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit.
        </Typography> */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
