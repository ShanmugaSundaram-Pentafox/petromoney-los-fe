import React from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from 'react-query'
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import theme from "./theme";
import "./App.scss";
import Routes from "./routes/routes";
import { store, persistor } from "./store";


const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
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
