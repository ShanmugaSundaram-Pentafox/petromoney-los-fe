import { Badge, Button, Paper, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdfTwoTone';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import FilePreview from '../../../components/CommonComponents/FilePreview';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
    borderBottom: '1px solid #CCC'
  },
  container: {
    maxWidth: 100,
    margin: 8,
    marginBottom: 2
  },
  card: {
    transition: 'all .2s ease-in-out',
    cursor: 'pointer',
    border: '1px dashed grey',
    '&:hover': {
      backgroundColor: '#fcfcfc'
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 15,
    height: 80,
    width: 100,
    borderRadius: 6,
  },
  typography: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginTop: 2,
    fontSize: 10,
    overflow: 'hidden',
  },
  alert: {
    color: '#b5b5b5',
    marginLeft: 15
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
  fileSection: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 10
  },
  button: {
    marginLeft: 15
  },
  image: {
    borderRadius: 6,
    padding: 1,
    objectFit: 'contain'
  }
}))


const DocPreview = ({ fileType, url }) => {
  const [imageModal, setImageModal] = useState({});
  const classes = useStyles();
  const fileName = url?.split('/')[5]
  return (
    <>
      {
        url ? (
          <Tooltip title={fileName}>
            <span className={classes.container}>
              <div className={classes.card} onClick={() => setImageModal({ open: true, image: url, type: url?.endsWith('.pdf') })}>
                {
                  fileType === 'png' ?
                    <img src={url} height="100%" width="100%" className={classes.image} />
                    : fileType === 'pdf' ?
                      <PictureAsPdfIcon color="action" />
                      : <ListAltIcon color="action" />
                }
              </div>
              <Typography component="h5" className={classes.typography}>{fileName}</Typography>
            </span>
          </Tooltip>

        ) : (
          <Typography className={classes.alert}>No Documents!</Typography>
        )
      }
      <FormDialog title='Document' onDownload={imageModal?.image} open={imageModal?.open} onClose={() => setImageModal({ open: false })}>
        <FilePreview data={imageModal} />
      </FormDialog>
    </>
  )
}

const DocListPreview = ({ docName, upload, deleteDocs, file, id }) => {
  const classes = useStyles();
  const [collapse, setCollapse] = useState(false);

  const handleCollapse = () => {
    setCollapse(!collapse)
  }
  return (
    <div className={classes.root}>
      <div className={classes.titleRow}>
        <div onClick={() => handleCollapse()} style={{ cursor: 'pointer' }}>
          <Typography variant='h7' onClick={() => handleCollapse}><strong>{`${id}. ${docName}`}</strong></Typography>
          <Badge badgeContent={file[0].file_url && file?.length || 0} color="primary" className={classes.button} />
        </div>
        <div className={classes.titleBtns}>
          {
            file[0].file_url && file?.length >= 1 && (
              <Button
                size='small'
                onClick={deleteDocs}
                style={{ color: '#FF5C58', border: '1px solid #FF5C58' }}
                variant='outlined' startIcon={<DeleteForeverIcon fontSize="small" />} >
                Delete
              </Button>
            )
          }
          <Button
            size='small'
            className={classes.button}
            variant='outlined' onClick={upload}
            color='primary'
            startIcon={<AddIcon fontSize='small' />} >
            Upload
          </Button>
        </div>
      </div>
      <div className={classes.fileSection}>
        {
          file.map((data, i) => {
            return (
              !collapse ? (
                <DocPreview fileType={data.file_type} url={data.file_url} />
              ) : null
            )
          })
        }
      </div>
    </div >
  )
}

export default DocListPreview
