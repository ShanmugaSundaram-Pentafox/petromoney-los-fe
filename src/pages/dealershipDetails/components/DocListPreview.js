import { Badge, Button, Typography, Dialog, DialogContent, DialogContentText, Collapse } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import InfoCircleOutlined from '@material-ui/icons/InfoOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import { ReactComponent as DeleteIcon } from '../../../icons/deleteIcon.svg'
import { deleteDocsImage } from '../../../services/dealerships.service';

const imgFileTypes = ['jfif', 'pjpeg', 'jpeg', 'pjp', 'jpg', 'png'];
const csvFileTypes = ['csv', 'xls', 'xlsx'];
const audioFileTypes = ['mp3', 'wav', '.m4a']
const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
    borderBottom: '1px solid #CCC'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
  },
}))


const usePreviewStyles = makeStyles((theme) => ({
  container: {
    transition: '.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#fcfcfc',
      '& $attachmentDelete': {
        visibility: 'visible'
      }
    },
    border: '1px dashed grey',
    width: 100,
    height: 75,
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '8px 0px 8px 15px',
    position: 'relative'
  },
  smallText: {
    width: 100,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginTop: 2,
    overflow: 'hidden',
    marginLeft: 15,
    fontSize: 10,
    color: '#999'
  },
  attachmentDelete: {
    position: 'absolute', width: 25, height:23, bottom: 0, right: 0, backgroundColor: 'rgb(255,59,48)', borderRadius: '5px 0px 5px 0px', display: 'flex', justifyContent: 'center', alignItems: 'center', visibility: 'hidden',
    '&:hover': {
      border: '2px solid #F19C9C'
    }
  },
  deleteModal: {
    display: 'flex',justifyContent: 'center', alignItems: 'center',marginBottom: 19, width: '100%'
  }
}))
const DocPreview = ({ fileType, url, DocName, updatedDateTime, file_name, fileId, dealershipId, editable }) => {
  const queryClient = useQueryClient()
  const [imageModal, setImageModal] = useState({});
  const classes = usePreviewStyles();
  const [deleteModal, setDeleteModal] = useState({open: false})

  const handleDocDelete = (fileId) => {
    deleteDocsImage([fileId], dealershipId)
      .then((res) => {
        queryClient.invalidateQueries(['doc-checklist', dealershipId])
        setDeleteModal({open:false})
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {
        url ? (
          <Tooltip title={`${file_name} (${updatedDateTime})`}>
            <span>
              <div className={classes.container}
                onClick={() => csvFileTypes.includes(fileType) ? window.open(url) : audioFileTypes.includes(fileType) ? window.open(url) : setImageModal({ open: true, image: url, type: fileType })}
              >
                {
                  imgFileTypes.includes(fileType) ?
                    <img src={url} height="100%" width="100%" style={{ borderRadius: 6, padding: 1, objectFit: 'cover' }} alt={url} />
                    : fileType === 'pdf' ?
                      <PictureAsPdfIcon style={{ color: '#63686E' }} /> 
                      : fileType === 'mp3' || fileType === 'm4a' || fileType === 'wav' ? 
                        <AudiotrackIcon style={{ color: '#63686E' }} />
                        : <ListAltIcon style={{ color: '#63686E'}} />
                }
                {
                  !editable &&
                    <div className={classes.attachmentDelete} onClick={(e) => {e.stopPropagation(); setDeleteModal({open:true, fileId: fileId})}}><DeleteIcon width={16} /></div>
                }
              </div>
              <h5 style={{ width: 100, whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden', marginLeft: 15 }}>{file_name}</h5>
              <span className={classes.smallText}>{updatedDateTime}</span>
            </span>
          </Tooltip>

        ) : (
          <Typography variant='h7' style={{ color: '#b5b5b5', marginLeft: 15 }}>No Documents!</Typography>
        )
      }
      <FormDialog maxWidth={'xl'} title={DocName} onDownload={imageModal?.image} open={imageModal?.open} onClose={() => setImageModal({ open: false })}>
        <FilePreview data={imageModal} />
      </FormDialog>
      <Dialog
        open={deleteModal?.open}
        onClose={() => setDeleteModal({open:false})}
        maxWidth='xs'
        fullWidth
      >
        <DialogContent>
          <div style={{textAlign: 'center', marginBottom: 15}}>
            <InfoCircleOutlined style={{fontSize: 48, color: 'rgb(255,59,48)', margin: 16, marginBottom: 20}} />
            <Typography variant='h3'>Are you sure?</Typography>
          </div>
          <DialogContentText style={{textAlign: 'center'}}>Do you really want to delete this document? This process cannot be undone!</DialogContentText>
        </DialogContent>
        <div className={classes.deleteModal}>
          <Button size='medium' variant='outlined' onClick={() => setDeleteModal({open:false})}>Cancel</Button>
          <Button variant='contained' size='medium' style={{backgroundColor: 'rgb(255,59,48)', color: 'white', marginLeft: 15}} onClick={() => handleDocDelete(deleteModal?.fileId)}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}

const DocListPreview = ({ docName, upload, file, id, dealershipId, editable }) => {
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
          <Badge badgeContent={file[0].file_url && file?.length || 0} color="primary" style={{ marginLeft: 15 }} />
        </div>
        {
          !editable &&
            <div className={classes.titleBtns}>
              <Button size='small' style={{ marginLeft: 15 }} variant='outlined' onClick={upload} color='primary' startIcon={<AddIcon style={{ fontSize: 'small' }} />}>Upload</Button>
            </div>
        }
      </div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap' }}
      >
        {
          file.map((data, i) => {
            return (
              <Collapse in={!collapse} key={i}>
                <DocPreview fileId={data?.file_id} dealershipId={dealershipId} fileType={data.file_type} file_name={data.file_name} url={data.file_url} DocName={docName} updatedDateTime={format(new Date(data?.created_date || data?.modified_date), 'dd/MM/yyyy hh:mm a')} editable={editable} />
              </Collapse>
            )
          })
        }
      </div>
    </div>
  )
}

export default DocListPreview