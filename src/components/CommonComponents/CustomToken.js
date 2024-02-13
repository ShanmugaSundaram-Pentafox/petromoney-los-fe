import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Badge } from '@mantine/core';
import React from 'react';

export const CustomToken = ({
  variant= 'success', 
  label, 
  icon='default'
}) => {
  return(
    <Badge
      size="sm"
      classNames={{
        section: '!mr-0'
      }}
      color={variant === 'success' ? 'green' : variant === 'warn' ? 'orange' : variant === 'error' ? 'red' : 'blue'}
      leftSection={icon === 'default' ? <span className="w-2.5 h-2.5 bg-white rounded-xl mr-1" /> : icon === 'tick' ? <CheckIcon className="w-4 h-4" /> : icon === 'cross' ? <XMarkIcon className="w-4 h-4" /> : null}
    >
      {label?.toUpperCase()}  
    </Badge> 
  )
}

export default CustomToken;
