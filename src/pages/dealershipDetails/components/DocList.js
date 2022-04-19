import { Typography, Table, TableBody, Button, makeStyles, withStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import DocListPreview from './DocListPreview';
import FileUpload from '../../../components/FileUpload';
import { URL } from '../../../config/serverUrls';
import { getDealershipCheckList } from '../../../services/dealerships.service';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';

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

const DocList = ({ id, currentUser }) => {
  const queryClient = useQueryClient()
  const classes = useStyles();
  const [showUpload, setShowUpload] = useState(false);
  const [rowData, setRowData] = useState();
  const editable = permissionCheck(currentUser.role_name, rulesList.external_view);

  const { data: checkListData = [] } = useQuery(['doc-checklist', id], () => getDealershipCheckList(id), {refetchOnWindowFocus: false})

  const { enqueueSnackbar } = useSnackbar();
  const onCloseUploader = () => {
    setShowUpload(false);
  }

  const onDocUpload = (row) => {
    setShowUpload(true);
    setRowData(row);
  };

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
            <DocListPreview docName={row.description} upload={() => onDocUpload(row)} file={row.file_data} id={i + 1} dealershipId={id} editable={editable} />
          ))}
        </TableBody>
      </Table>
    </div >

  );
};

export default DocList;
