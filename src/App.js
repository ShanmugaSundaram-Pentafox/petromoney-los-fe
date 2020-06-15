import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import theme from "./theme";

import "./App.scss";
import Routes from "./routes/routes";
import { store, persistor } from "./store";

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right'}}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <PersistGate persistor={persistor}>
              <Routes />
            </PersistGate>
          </BrowserRouter>
        </ThemeProvider>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
