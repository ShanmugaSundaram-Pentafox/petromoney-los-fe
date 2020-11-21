import palette from '../palette';

export default {
  paper: {
    '&.MuiPaper-rounded': {
      borderRadius: '6px',
      boxShadow: 'none'
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
