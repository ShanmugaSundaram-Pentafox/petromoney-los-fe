import { Box, Avatar, Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import FormDialog from './FormDialog/FormDialog';
import { getSignedUrl } from '../../services/common.service';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 11,
    color: '#888',
  },
  details: {
    borderColor: 'grey',
    minWidth: 80,
    // minHeight: 45,
    maxWidth: 250,
    textAlign: 'left',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    display: 'flex',
    alignItems: 'center'
  },
  avatarCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const PreviewWrapper = styled.div`
    width:45vw;
    .image {
        width: 100%;
        object-fit: contain;
        }
    .iframe-container {
        height:72vh;
        overflow: hidden;
        padding-top: 45%;
        // position: relative;
    }
    .iframe-container iframe {
        width:100%;
        height:100%;
        left: 0;
        position: absolute;
        top: 0;
    }
`;

export const ViewData = ({ title, value, style = { marginBottom: 8 }, endIcon }) => {
  const classes = useStyles()
  return (
    <Box className={classes.details} style={style}>
      <p className={classes.title}>{title}</p>
      <strong className={classes.text}>
        {value ? value : '-'}
        {
          endIcon && endIcon
        }
      </strong>
    </Box >
  )
}
export const AvatarCard = ({ file, title, tooltip }) => {
  const classes = useStyles()
  const [imageModal, setImageModal] = useState({})
  return (
    <>
      <div onClick={() => setImageModal({ open: true, image: file, type: file?.endsWith('.pdf') })} style={{ margin: 10, paddingLeft: 10 }} tabIndex={0} role="button" onKeyDown={'click'}>
        <Tooltip title={tooltip}>
          <div className={classes.avatarCard}>
            <Avatar src={`${file}`} />
            <Typography style={{ marginTop: 4 }}>{title}</Typography>
          </div>
        </Tooltip>
      </div>
      <FormDialog className={classes.dialogBox} title={title} onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
        <FilePreview data={imageModal} />
      </FormDialog>
    </>
  )
}


const FilePreview = ({ data }) => {
  const [signedUrl, setSignedUrl] = useState()
  useEffect(() => {
    getSignedUrl(data?.image)
      .then((res) => {
        setSignedUrl(res?.url)
      })
      .catch((err) => console.log('err >>>>>', err))

  }, [data?.image])
  return (
    <PreviewWrapper>
      {
        data?.type == true || data?.type == 'pdf' ?
          <div className="iframe-container">
            <iframe title='File Preview' src={signedUrl} frameBorder="0" ></iframe>
          </div> :
          <img className="image" src={signedUrl} alt='viewer' />
      }
    </PreviewWrapper>
  )

}
export default FilePreview;