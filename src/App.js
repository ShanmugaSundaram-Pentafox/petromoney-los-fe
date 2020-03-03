import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

import './App.scss';
import Routes from './routes/routes';
import { store, persistor } from './store';


function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <PersistGate persistor={persistor}>
            <Routes />
          </PersistGate>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
