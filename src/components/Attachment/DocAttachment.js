import { Grid, makeStyles, Tooltip } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import DeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import React, { useState } from 'react';
import { ReactComponent as UploadingIcon } from '../../icons/uploadIcon.svg';
import FilePreview from '../CommonComponents/FilePreview';
import FormDialog from '../CommonComponents/FormDialog/FormDialog';
import { ActionIcon, ActionIconGroup, Box, Flex } from '@mantine/core';
import { IconFileTypePdf, IconPhoto, IconPhotoUp, IconTrash, IconUpload } from '@tabler/icons-react';
import { Button } from '../Mantine/Button/Button';

const useStyles = makeStyles({
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    height: 25,
    textAlign: 'center',
    paddingTop: 5,
    borderRadius: 3
  },
  buttons: {
    width: 44,
    height: 34,
    border: '1px solid rgb(0,0,0,0.4)',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    cursor: 'pointer',
    alignItems: 'center',
    '&:hover': {
      border: '1px solid rgb(0,0,0,0.7)'
    }
  },
  disbButtons: {
    width: 44,
    height: 34,
    border: '1px solid rgb(0,0,0,0.4)',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnsContainer: {
    width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: 10
  },
  imgContainer: {
    maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 90, border: '1px solid rgb(0,0,0,0.4)', borderRadius: 4, position: 'relative', cursor: 'pointer'
  }
})

export const DocAttachment = ({ imgUrl, onUpload, onDelete, docName, action = false, disabled = false, tooltip = 'View', style = { marginRight: 0 } }) => {
  const classes = useStyles();
  const [imageModal, setImageModal] = useState({})
  return (
    <>
      <Flex direction="column" gap="xs">
        <Tooltip title={!disabled ? tooltip : ''}>
          <Box 
            className="group relative w-28 h-28 bg-white flex justify-center items-center rounded-lg border border-dashed border-gray-300 hover:border-gray-400 overflow-hidden cursor-pointer"
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
              <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
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
          className={classes.dialogBox} 
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