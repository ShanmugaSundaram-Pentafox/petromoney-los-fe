import { Button as ButtonWrapper } from '@mantine/core';
import React from 'react';

export const Button = ({
  variant = 'filled',
  radius= 'md',
  children,
  ...restProps
}) => {
  return (
    <ButtonWrapper
      variant={variant}
      radius={radius}
      {...restProps}
    >
      {children}
    </ButtonWrapper>  
  )
}