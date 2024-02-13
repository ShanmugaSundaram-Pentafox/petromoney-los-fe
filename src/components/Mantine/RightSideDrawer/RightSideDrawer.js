import { Button, Drawer, Flex } from '@mantine/core'
import React from 'react';

export const RightSideDrawer = ({
  title,
  size,
  opened,
  onClose,
  children,
  footerAction
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
      {/* Drawer content */}
      {footerAction ? (
        <div style={{ flexGrow: 1, padding: 16, overflowY: 'auto' }}>
          {children}  
        </div>
      ) : 
        children
      }

      {/* Sticky footer */}
      {footerAction && (
        <Flex
          h="64"
          style={{
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'end',
            padding: '0 16px',
            background: '#FFFFFF',
            borderTop: '1px solid #eaeaea',
            zIndex: 9
          }}
        >
          <Flex gap="sm">
            <Button
              variant="outline"
              size="sm"
              color="gray"
              onClick={footerAction.left.onClick}
            >
              {footerAction.left.buttonName ?? 'Go back'} 
            </Button>

            <Button
              variant="filled"
              size="sm"
              color="rgba(0, 0, 0, 1)"
              onClick={footerAction.right.onClick}
              loading={footerAction.right.loading}
            >
              {footerAction.right.buttonName ?? 'Save'}
            </Button>
          </Flex>
        </Flex>
      )}
    </Drawer>
  )
}