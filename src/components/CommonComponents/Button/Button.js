import React from 'react';
import ButtonComp from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const CustomButton = withStyles(theme => ({
  root: {
    textTransform: 'none',
    lineHeight: 1.5,

    '&:hover': {
    
    },
    '&:focus': {
    
    },
    '&:active': {
    
    },
  }
}))(ButtonComp)

const Button = ({ ...rest }) => {
  return <CustomButton disableElevation {...rest} />
}

export default Button;