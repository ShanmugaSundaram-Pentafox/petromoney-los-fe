import { createMuiTheme } from '@material-ui/core';

import overrides from './overrides';
import palette from './palette';
import typography from './typography';

const theme = createMuiTheme({
  themeName: 'Petromoney',
  palette,
  typography,
  overrides,
  shape: {
    borderRadius: 2
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
});

export default theme;