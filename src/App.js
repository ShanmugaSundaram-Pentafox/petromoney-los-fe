import React from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import theme from "./theme";

import "./App.scss";
import Routes from "./routes/routes";
import { store, persistor } from "./store";
import { QueryClient,QueryClientProvider } from "react-query";

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}>
          <ThemeProvider theme={theme}>
            <HashRouter>
              <PersistGate persistor={persistor}>
                <Routes />
              </PersistGate>
            </HashRouter>
          </ThemeProvider>
        </SnackbarProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
