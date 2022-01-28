import { Checkbox, FormControlLabel, FormGroup, Paper, Typography, Table, TableBody, Button, makeStyles, withStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import DocListPreview from './DocListPreview';
import FilePreview from '../../../components/CommonComponents/FilePreview';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import FileUpload from '../../../components/FileUpload';
import { URL } from '../../../config/serverUrls';
import { deleteDocsImage, getDealershipCheckList } from '../../../services/dealerships.service';
import { getFileNameFromUrl } from '../../../utils/strings.util';

const DeleteButton = withStyles(() => ({
  root: {
    background: '#DC143C',
    textTransform: 'none',
    lineHeight: 1.5,
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 38,
    padding: '0 30px',
    marginBottom: '8px',

    '&:hover': {
      background: '#DC143C',
    },
    '&:focus': {

    },
    '&:active': {

    },
  }
}))(Button)


const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: 8,
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8,
  },
  table: {
    padding: 8,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner_modal: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 600,
  },
  content: {
    padding: '10px 40px',
    fontSize: 14,

  },
  modal_title: {
    marginBottom: 20,

  },
  list: {
    textAlign: 'center',
  },
  button: {
    margin: 0,
    float: 'right',
  },
}));


const Docs = ({ data }) => {
  const classes = useStyles();
  const [imageModal, setImageModal] = useState({})
  let temp = 0;
  return (
    <>
      {
        data.map((file, i) => {
          temp += file.file_url ? 1 : 0;
          return file.file_url ? (
            <div>
              <Button onClick={() => setImageModal({ open: true, image: file.file_url, type: file.file_url.endsWith('.pdf') })}>
                <a href={file?.file_url} style={{ display: 'inline-block', borderRadius: 4, lineHeight: 1, marginRight: 8, marginBottom: 8, padding: 8, backgroundColor: '#f0f0f0' }}>{getFileNameFromUrl(file?.file_url)} </a>
              </Button>
            </div>

          ) : null
        })
      }
      <FormDialog title={'File Preview'} onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
        <FilePreview data={imageModal} />
      </FormDialog>
    </>
  );

}

const DocList = ({ id }) => {
  const queryClient = useQueryClient()
  const classes = useStyles();
  const [showUpload, setShowUpload] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [rowData, setRowData] = useState();
  const [array, setArray] = useState([]);
  const [description, setDescription] = useState();
  const { data: checkListData = [] } = useQuery(['doc-checklist', id], () => getDealershipCheckList(id), {refetchOnWindowFocus: false})

  const getValue = (e) => {
    const val = e?.target?.value;
    if (!val) return;
    if (array.includes(val)) {
      var n = array.indexOf(val);
      setArray((d) => {
        const re = [...d];
        re.splice(n, 1);
        return re;
      });
    } else {
      setArray((d) => {
        return d.concat(val);
      });
    }
  }

  const { enqueueSnackbar } = useSnackbar();
  const onCloseUploader = () => {
    setShowUpload(false);
  }
  const handleModal = (data, desc) => {
    setOpenModal(true);
    // setImageModal(true);
    setModalData(data);
    setDescription(desc);
  }

  const onDocUpload = (row) => {
    setShowUpload(true);
    setRowData(row);
  };

  const DeleteDocs = () => {
    deleteDocsImage(array, id)
      .then((res) => {
        queryClient.invalidateQueries(['doc-checklist', id])
        setOpenModal(false)
        setModalData([])
        setArray([])
      })
      .catch((err) => {
        alert(err?.message)
        console.log(err);
      });
  }

  const handleSave = (files) => {
    const formData = new FormData();
    const dealerShipId = id;
    const docID = rowData.doc_id;
    files.map(file => {
      const fileName = file.name.replace(/[()%.,+\-&]/g, '').toLowerCase().replace(/\s/g, '_');
      formData.append(`file-${id}`, file);
      formData.append('fileName', fileName);
      formData.append('id', rowData.doc_id);
    });
    
    fetch(`${URL.base}${URL.checklist}/${dealerShipId}/doc/${docID}`, {
      method: 'POST',
      body: formData
    })
      .then(data => {
        enqueueSnackbar('File Upload Success', { variant: 'success' });
        onCloseUploader();
        queryClient.invalidateQueries(['doc-checklist', id])
      })
      .catch(error => {
        enqueueSnackbar('File Upload Failed', { variant: 'error' });

      })
  };

  return (
    <div className={classes.wrapper}>
      {showUpload && <FileUpload handleSave={handleSave} id={id} data={rowData} title='Upload Dealership Document' open={showUpload} onCloseUploader={onCloseUploader} />}
      <Typography variant="h5" align={'Left'} className={classes.title}>
        Dealership Documents
      </Typography>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableBody>
          {Array.isArray(checkListData) && checkListData.map((row, i) => row.doc_type !== 'dealer' && (
            <DocListPreview docName={row.description} upload={() => onDocUpload(row)} deleteDocs={() => handleModal(row.file_data, row.description)} file={row.file_data} id={i + 1} />
          ))}
        </TableBody>
      </Table>
      <FormDialog
        title={description}
        open={openModal}
        onClose={() => setOpenModal(false)}
        actions={
          array.length !== 0 ?
            <DeleteButton className={classes.button} variant="contained" onClick={() => DeleteDocs()}>Delete</DeleteButton>
            : null
        }
      >
        <div className={classes.content}>
          <div className={classes.list}>
            <div>
              {
                modalData.map(item => {
                  return (
                    <Paper key={item.file_id} style={{ minWidth: '350px' }}>
                      <FormGroup>
                        <FormControlLabel
                          key={item.file_id}
                          control={<Checkbox key={item.region} color="primary" value={item.file_id} onChange={(e) => getValue(e)} />}
                          label={item?.file_name}
                          value={item?.file_name}
                        />
                      </FormGroup>
                    </Paper>
                  )

                })
              }
            </div>
          </div>
        </div>
      </FormDialog>
    </div >

  );
};

export default DocList;
