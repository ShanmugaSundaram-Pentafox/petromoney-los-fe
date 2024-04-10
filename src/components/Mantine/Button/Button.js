import { Button as ButtonWrapper } from '@mantine/core';
import React from 'react';

export const Button = ({
  colorScheme,
  variant = 'filled',
  children,
  ...restProps
}) => {
  return (
    <ButtonWrapper
      variant={variant}
      color={colorScheme === 'primary' ? 'rgba(0, 0, 0, 1)' : colorScheme === 'secondary' ? 'gray' : restProps.color}
      {...restProps}
    >
      {children}
    </ButtonWrapper>  
  )
}