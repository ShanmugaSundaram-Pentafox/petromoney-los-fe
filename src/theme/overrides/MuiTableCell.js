import { colors } from '@material-ui/core';
import palette from '../palette';
import typography from '../typography';

export default {
  root: {
    ...typography.body2,
    padding: '6px 10px',
    // border: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`,
    '&.MuiTableCell-head': {
      fontWeight: 600,
      color: colors.grey[900],
      backgroundColor: colors.grey[200],
      padding: '6px 10px',
    },
    '&.MuiTableCell-body': {
      color: '#111',
    },
    '&.MuiTableCell-sizeSmall': {
      padding: '6px 18px 6px 12px'
    }
  },
  footer: {
    border: 'none'
  }
};
