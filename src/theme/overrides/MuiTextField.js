export default {
  root: {
    // '& label.Mui-focused': {
    //   fontSize: 13
    // },
    // '& .MuiInput-underline:after': {
    //   borderBottomColor: 'green',
    // },
    '&.MuiFormControl-marginNormal': {
      margin: '4px 0',
    },
    '& .MuiInputBase-input': {
      fontSize: 13,
      color: '#222444'
    },
    '& .MuiInputBase-input[readonly]+fieldset': {
      borderStyle: 'dotted',
      borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    // '& .MuiInputBase-input.MuiInputBase-inputMultiline[readonly]+fieldset': {
    //   borderStyle: 'solid',
    //   borderColor: 'rgba(0, 0, 0, 0.23)'
    // },
    '& textarea.MuiInputBase-input+textarea.MuiInputBase-input[readonly]+fieldset': {
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.23)'
    },
    '& textarea.MuiInputBase-input[readonly]+textarea.MuiInputBase-input[readonly]+fieldset': {
      borderStyle: 'dotted',
      borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderStyle: 'dotted',
      borderColor: 'rgba(0, 0, 0, 0.5)',
      background: 'rgba(0,0,0,0.03)'
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
      '& input.MuiOutlinedInput-input': {
        padding: 10,
      },
      '&.MuiOutlinedInput-adornedEnd': {
        paddingRight: 0
      }
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.80)',
    }
  },
};