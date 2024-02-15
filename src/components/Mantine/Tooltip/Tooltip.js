import { Tooltip as TooltipWrapper } from '@mantine/core';
import React from 'react';

export const Tooltip = ({
  ...restProps
}) => {
  return (
    <TooltipWrapper
      fz="xs" 
      className="p-2"
      zIndex={99999}
      {...restProps}
    />
  )
}