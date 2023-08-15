import { ThemeProvider, createTheme } from "@mui/material";
import { useSelector } from "react-redux";

const ThemeProviderWrapper = ({ children }) => {
  const isDark = useSelector((state) => state.theme.isDark);

  const defaultTheme = createTheme();

  const theme = createTheme({
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      type: isDark ? "dark" : "light",
      error: {
        main: isDark ? "#f99600" : "#ff0000",
      },
      primary: {
        main: isDark ? "#81c784" : "#1976D2",
      },
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark ? "#fff" : "#000",
            "&.Mui-error": {
              color: isDark ? "#f99600" : "#ff0000",
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          filterForm: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panel: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panelHeader: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panelContent: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panelFooter: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: isDark ? "#fff" : "#000",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: isDark ? "#fff" : "#000",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: isDark ? "#fff" : "#000",
            "&::placeholder": {
              color: isDark ? "#fff" : "#000",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: isDark ? "#fff" : "#000",
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&.homeButtonMargin": {
              margin: "1rem !important",
            },
            "&.socialLoginButtonMargin": {
              backgroundColor: "transparent !important",
              margin: "0 !important",
              marginLeft: "1rem !important",
              flexGrow: 1,
              boxShadow: "none !important",
              "&:hover": {
                backgroundColor: "transparent !important",
                boxShadow: "none !important",
                transition: "none !important",
              },
            },
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
