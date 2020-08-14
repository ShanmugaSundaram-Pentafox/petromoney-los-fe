export default {
  root: {
    // '& label.Mui-focused': {
    //   fontSize: 13
    // },
    // '& .MuiInput-underline:after': {
    //   borderBottomColor: 'green',
    // },
    '& .MuiInputBase-input': {
      fontSize: 13,
    },
    '& .MuiInputBase-input[readonly]+fieldset': {
      borderStyle: 'dotted',
      borderColor: 'rgba(0, 0, 0, 0.1)'
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