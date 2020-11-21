import palette from '../palette';
import { colors } from '@material-ui/core';
import typography from '../typography';

export default {
  root: {
    ...typography.body2,
    padding: '6px 12px',
    border: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`,
    '&.MuiTableCell-head': {
      fontWeight: 600,
      color: colors.grey[900],
    },
    '&.MuiTableCell-sizeSmall': {
      padding: '6px 18px 6px 12px'
    }
  }
};
