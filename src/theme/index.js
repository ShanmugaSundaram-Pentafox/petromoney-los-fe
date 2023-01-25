import { createTheme } from '@material-ui/core/styles';

import overrides from './overrides';
import palette from './palette';
import typography from './typography';

const theme = createTheme({
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