import { createTheme } from "@mui/material/styles";
import ThemeProviderWrapper from "./components/Theme/ThemeProviderWrapper";
import AppRouter from "./router/AppRouter";
import { grey, blueGrey } from "@mui/material/colors";
import { Provider } from "react-redux";
import store, { persistor } from "./app/store";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: grey["900"],
      },
      secondary: {
        main: blueGrey["900"],
      },
    },
  });

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProviderWrapper>
            <AppRouter />
            <ToastContainer />
          </ThemeProviderWrapper>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
