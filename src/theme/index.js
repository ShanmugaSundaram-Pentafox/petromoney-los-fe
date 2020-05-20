import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import typography from './typography';
import overrides from './overrides';
import shadows from './shadows';

const theme = createMuiTheme({
  themeName: "Petromoney",
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