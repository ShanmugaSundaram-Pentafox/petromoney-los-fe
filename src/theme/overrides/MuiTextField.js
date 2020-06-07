export default {
  root: {
    // '& label.Mui-focused': {
    //   color: 'green',
    // },
    // '& .MuiInput-underline:after': {
    //   borderBottomColor: 'green',
    // },
    '& .MuiInputBase-input': {
      fontSize: 12,
    },
    '& .MuiInputBase-input[readonly]+fieldset': {
      borderStyle: 'dotted',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        // borderWidth: 'red',
      },
      '&:hover fieldset': {
        // borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderWidth: '1px',
      },
      '& input.MuiOutlinedInput-inputMarginDense': {
        padding: 10,
      },
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.80)',
    }
  },
};