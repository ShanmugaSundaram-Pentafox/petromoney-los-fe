import palette from '../palette';

export default {
  paper: {
    '&.MuiPaper-rounded': {
      borderRadius: '12px'
    },
  },
  root: {
    '&$selected': {
      backgroundColor: palette.background.default
    },
    '&$hover': {
      '&:hover': {
        backgroundColor: palette.background.default
      }
    }
  }
};
