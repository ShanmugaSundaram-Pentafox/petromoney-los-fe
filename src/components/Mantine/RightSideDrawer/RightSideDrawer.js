import { Drawer } from '@mantine/core'
import React from 'react';

export const RightSideDrawer = ({
  title,
  size,
  opened,
  onClose,
  children
}) => {
  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      overlayProps={{ backgroundOpacity: 0.2, blur: 2 }}
      title={title}
      size={size}
      zIndex={99999}
      styles={{
        content: {
          overflow: 'hidden',
        },
        header: {
          borderBottom: '1px solid #eaeaea',
        },
        title: {
          fontWeight: 700,
        },
        body: {
          padding: 0,
          height: 'calc(100% - 62px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      }}
      closeOnEscape={false}
    >
      {children}
    </Drawer>
  )
}