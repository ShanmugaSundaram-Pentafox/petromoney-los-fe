import React from 'react';
import { getSignedUrl } from '../../../services/common.service';
import { ActionIcon, Box, Group, Modal, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';


const FormDialog = ({
  title,
  children,
  actions,
  open,
  onClose,
  onDownload,
  maxWidth = '60%'
}) => {

  const handleClick = () => {
    if (onDownload) {
      getSignedUrl(onDownload)
        .then(res => {
          window.open(res?.url)
        })
        .catch(err => console.log(' getSignedUrl err >>>', err))
    }
  }

  return (
    <Modal
      onClose={onClose}
      opened={open}
      maw={maxWidth}
      size={'auto'}
      title={
        <Group>
          <Title order={5}>{title}</Title>
          {onDownload ? (
            <ActionIcon variant='subtle' onClick={handleClick} >
              <IconDownload />
            </ActionIcon >
          ) : null}
        </Group>
      }
      zIndex={99999}
    >
      {children}
      {
        actions && (
          <Box>
            {actions}
          </Box>
        )
      }
    </Modal >
  );
}

export default FormDialog;