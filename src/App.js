// mantine styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import './App.css';
import Routes from './routes/routes';
import { store, persistor } from './store';
import theme from './theme';
import defaultTheme from './theme/mantine-theme/mantineTheme';
import { Notifications } from '@mantine/notifications';

const actionStyle = {
  cursor: 'pointer',
  color: '#fff',
  padding: '10px 14px'
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
const notistackRef = React.createRef();
const onClickClose = key => {
  notistackRef.current.closeSnackbar(key);
}
function App() {
  return (
    <MantineProvider theme={defaultTheme}>
      <Notifications position='top-right' zIndex={999999} />
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider hideIconVariant ref={notistackRef} preventDuplicate maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} action={key => (<body1 style={actionStyle} onClick={() => onClickClose(key)}>DISMISS</body1>)}>
              <HashRouter>
                <PersistGate persistor={persistor}>
                  <Routes />
                </PersistGate>
              </HashRouter>
            </SnackbarProvider>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
