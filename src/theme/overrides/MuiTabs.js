import palette from '../palette';

export default {
  root: {
    // '&$selected': {
    //   backgroundColor: palette.background.default
    // },
    // '&$hover': {
    //   '&:hover': {
    //     backgroundColor: palette.background.default
    //   }
    // }
  },
  vertical: {
    '& .MuiTab-root': {
      padding: 0,
      textTransform: 'none'
    },
    '& .MuiTab-textColorInherit': {
      opacity: 1
    },
  },
  indicator: {
    display: 'none'
  },
};
