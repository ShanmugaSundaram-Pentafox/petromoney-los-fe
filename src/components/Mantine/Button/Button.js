import { Button as ButtonWrapper } from '@mantine/core';
import React from 'react';

export const Button = ({
  variant = 'filled',
  children,
  ...restProps
}) => {
  return (
    <ButtonWrapper
      variant={variant}
      {...restProps}
    >
      {children}
    </ButtonWrapper>  
  )
}