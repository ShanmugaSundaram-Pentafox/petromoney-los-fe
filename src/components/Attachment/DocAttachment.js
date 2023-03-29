import { Grid, makeStyles, Tooltip } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import DeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import React, { useState } from 'react';
import { ReactComponent as UploadingIcon } from '../../icons/uploadIcon.svg';
import Thumbnail from '../../image/thumbnailAttach.png';
import FilePreview from '../CommonComponents/FilePreview';
import FormDialog from '../CommonComponents/FormDialog/FormDialog';

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
    <Grid item md={2} style={style}>
      <Grid item>
        <Tooltip title={!disabled ? tooltip : ''}>
          <div className={classes.imgContainer} onClick={() => typeof (imgUrl) == 'string' ? setImageModal({ open: true, image: imgUrl, type: imgUrl?.endsWith('.pdf') }) : null}>
            {
              typeof (imgUrl) === 'string' || imgUrl === null || imgUrl === undefined ?
                imgUrl?.endsWith('.pdf') ?
                  <PictureAsPdfIcon style={{ color: '#63686E' }} /> :
                  <img src={imgUrl || Thumbnail} alt={docName} height="100%" width="100%" style={{ borderRadius: 6, padding: 1, objectFit: 'cover', display: 'block' }} /> :
                <CheckCircleTwoToneIcon style={{ color: green[300], fontSize: 30 }} />
            }
            <div className={classes.overlay} style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(201,201,201,0) 0%, rgba(0,0,0,0.7598389697675946) 100%)' }}>{docName}</div>
          </div>
        </Tooltip>
      </Grid>
      {
        action &&
          <div className={classes.btnsContainer}>
            <Grid item>
              <Tooltip title='Upload'>
                <div className={classes.buttons} onClick={onUpload}>
                  <UploadingIcon />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={!disabled ? 'Delete' : ''}>
                <div className={!disabled ? classes.buttons : classes.disbButtons} onClick={!disabled && onDelete}>
                  <DeleteIcon fontSize='small' style={disabled ? { color: 'gray' } : { color: '#ff3d00' }} />
                </div>
              </Tooltip>
            </Grid>
          </div>
      }
      {
        imgUrl &&
          <FormDialog className={classes.dialogBox} title={docName} onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
            <FilePreview data={imageModal} />
          </FormDialog>
      }
    </Grid>
  )
}