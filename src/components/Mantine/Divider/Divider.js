import { Divider as DividerWrapper } from '@mantine/core';
import React from 'react';

export const Divider = (props) => {
  return (
    <DividerWrapper
      styles={(theme) => ({
        label: {
          color: theme.colors.dark[2],
          fontSize: 14,    
          fontWeight: 600,
        },
      })}
      {...props}
    />
  )
}