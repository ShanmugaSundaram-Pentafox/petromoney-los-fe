import { ActionIcon, Box, Flex } from '@mantine/core';
import { IconCircleCheck, IconFileTypePdf, IconPhoto, IconTrash, IconUpload } from '@tabler/icons-react';
import React, { useState } from 'react';
import FilePreview from '../CommonComponents/FilePreview';
import FormDialog from '../CommonComponents/FormDialog/FormDialog';
import { Button } from '../Mantine/Button/Button';
import { Tooltip } from '../Mantine/Tooltip/Tooltip';

export const DocAttachment = ({ 
  imgUrl, 
  onUpload, 
  onDelete, 
  docName, 
  action = false,
  disabled = false, 
  tooltip = 'View' 
}) => {
  const [imageModal, setImageModal] = useState({})

  return (
    <>
      <Flex direction="column" gap="xs">
        <Tooltip label={tooltip} disabled={disabled}>
          <Box 
            className="group relative w-28 h-28 bg-white flex justify-center items-center rounded-lg border border-dashed border-gray-300 hover:border-gray-400 overflow-hidden"
            onClick={() => typeof (imgUrl) == 'string' ? setImageModal({ open: true, image: imgUrl, type: imgUrl?.endsWith('.pdf') }) : null}
          >
            {typeof (imgUrl) === 'string' || imgUrl === null || imgUrl === undefined ? (
              <>
                {imgUrl?.endsWith('.pdf') ? (
                  <IconFileTypePdf size={28} className="text-gray-500" /> 
                  // <img src={imgUrl || Thumbnail} alt={docName} height="100%" width="100%" style={{ borderRadius: 6, padding: 1, objectFit: 'cover', display: 'block' }} />
                ) : (
                  <IconPhoto size={32} stroke={1.5} className="text-gray-500" />
                )}
              </>
            ) : (
              <IconCircleCheck stroke={1.25} size={32} className="text-emerald-600" />
            )}

            <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-b from-gray-100/5 group-hover:from-gray-100/15 to-gray-900/20 group-hover:to-gray-900/30" />

            {action && (
              <ActionIcon 
                variant="filled"
                color="red"
                className="!absolute top-0.5 right-0.5"
                aria-label="Delete"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && onDelete();
                }}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}  
          </Box>
        </Tooltip>
        
        {action && (
          <Flex justify="center">
            <Button   
              variant="outline"
              size="xs" 
              radius="lg"
              leftSection={<IconUpload size={16} />}
              onClick={onUpload}
            >
              Upload
            </Button>
          </Flex>
        )}
      </Flex>
      
      {imgUrl && (
        <FormDialog 
          title={docName} 
          onDownload={imageModal.image} 
          open={imageModal.open} 
          onClose={() => setImageModal({ open: false })}
        >
          <FilePreview data={imageModal} />
        </FormDialog>
      )}
    </>
  )
}