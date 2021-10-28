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

const imgFileTypes = ['jfif', 'pjpeg', 'jpeg', 'pjp', 'jpg', 'png'];
const csvFileTypes = ['csv', 'xls', 'xlsx'];
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


const DocPreview = ({ fileType, url, DocName }) => {
  const useStyles = makeStyles((theme) => ({
    container: {
      transition: 'all .2s ease-in-out',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#fcfcfc'
      },
      border: '1px dashed grey',
      width: 100,
      height: 75,
      borderRadius: 6,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '8px 0px 8px 15px'
    }
  }))

  const [imageModal, setImageModal] = useState({});
  const classes = useStyles();
  const fileName = url?.split('/')[5]
  return (
    <>
      {
        url ? (
          <Tooltip title={fileName}>
            <span>
              <div className={classes.container}
                onClick={() => csvFileTypes.includes(fileType) ? window.open(url) : setImageModal({ open: true, image: url, type: fileType })}
              >
                {
                  imgFileTypes.includes(fileType) ?
                    <img src={url} height="100%" width="100%" style={{ borderRadius: 6, padding: 1, objectFit: 'cover' }} />
                    : fileType === 'pdf' ?
                      <PictureAsPdfIcon style={{ color: '#63686E' }} />
                      : <ListAltIcon style={{ color: '#63686E' }} />
                }
              </div>
              <h5 style={{ width: 100, whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden', marginLeft: 15 }}>{fileName}</h5>
            </span>
          </Tooltip>

        ) : (
          <Typography variant='h7' style={{ color: '#b5b5b5', marginLeft: 15 }}>No Documents!</Typography>
        )
      }
      <FormDialog title={DocName} onDownload={imageModal?.image} open={imageModal?.open} onClose={() => setImageModal({ open: false })}>
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
    <>
      <div className={classes.root}>
        <div className={classes.titleRow}>
          <div onClick={() => handleCollapse()} style={{ cursor: 'pointer' }}>
            <Typography variant='h7' onClick={() => handleCollapse}><strong>{`${id}. ${DocName}`}</strong></Typography>
            <Badge badgeContent={file[0].file_url && file?.length || 0} color="primary" style={{ marginLeft: 15 }} />
          </div>
          <div className={classes.titleBtns}>
            {
              file[0].file_url && file?.length >= 1 && (
                <Button size='small' onClick={deleteDocs} style={{ color: '#FF5C58', borderColor: '#FF5C58' }} startIcon={<DeleteForeverIcon style={{ fontSize: 'small' }} />}>Delete</Button>
              )
            }
            <Button size='small' style={{ marginLeft: 15 }} variant='outlined' onClick={upload} color='primary' startIcon={<AddIcon style={{ fontSize: 'small' }} />}>Upload</Button>
          </div>
        </div>
        <div
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          {
            file.map((data, i) => {
              return (
                !collapse ? (
                  <DocPreview fileType={data.file_type} url={data.file_url} DocName={DocName} />
                ) : (
                  null
                )
              )
            })
          }
        </div>
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
    </>
  )
}

export default DocListPreview
