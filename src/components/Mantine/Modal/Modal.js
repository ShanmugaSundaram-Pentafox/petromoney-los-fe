import { Modal as ModalWrapper } from '@mantine/core';
import React from 'react';

export const Modal = ({
  open,
  close,
  title,
  children,
  ...restProps
}) => {
  return (
    <ModalWrapper
      opened={open} 
      onClose={close} 
      title={title}
      classNames={{
        title: '!text-xl !font-semibold text-gray-900'
      }}
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 3,
      }}
      {...restProps}
    >
      {children}
    </ModalWrapper>  
  )
}