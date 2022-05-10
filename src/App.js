import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { QueryClient,QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import './App.css';
import Routes from './routes/routes';
import { store, persistor } from './store';
import theme from './theme';

const actionStyle = {
  cursor: 'pointer',
  color: '#fff',
  padding: '10px 14px'
}


const queryClient = new QueryClient()
const notistackRef = React.createRef();
const onClickClose = key => {
  notistackRef.current.closeSnackbar(key);
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider hideIconVariant ref={notistackRef} preventDuplicate maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}} action={key => (<body1 style={actionStyle} onClick={() => onClickClose(key)}>DISMISS</body1>)}>
            <HashRouter>
              <PersistGate persistor={persistor}>
                <Routes />
              </PersistGate>
            </HashRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
