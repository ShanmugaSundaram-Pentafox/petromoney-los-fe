import React from 'react';
import ButtonComp from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';

const Button = ({ ...rest }) => {
  return <ButtonComp {...rest} />
}

export default Button;