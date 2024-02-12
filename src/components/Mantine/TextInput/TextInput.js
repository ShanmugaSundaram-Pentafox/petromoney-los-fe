import { TextInput as InputWrapper } from '@mantine/core';
import React from 'react';

export const TextInput = (props) => {
  return (
    <InputWrapper
      inputWrapperOrder={['label', 'input', 'description', 'error']}
      {...props}
    />
  )
}