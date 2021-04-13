import React, { useState } from "react";
import { useMount } from "react-use";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
// import Typography from "@material-ui/core/Typography";
import { useSnackbar } from 'notistack';
// import Chip from '@material-ui/core/Chip';
import { makeStyles } from "@material-ui/core/styles";
import FileUpload from "../../../components/FileUpload";
import { deleteDocsImage, getDealershipCheckList } from "../../../services/dealerships.service";
import { getFileNameFromUrl } from "../../../utils/strings.util";
import { URL } from '../../../config/serverUrls';
import Modal from '@material-ui/core/Modal';
import { Box, Checkbox, FormControlLabel, FormGroup, IconButton, Paper, Typography } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import ButtonComp from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog";

const DeleteButton = withStyles(theme => ({
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
}))(ButtonComp)


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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inner_modal: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 600,
  },
  content: {
    padding: '0 40px 40px 40px',
    fontSize: 14,

  },
  modal_title: {
    marginBottom: 20,

  },
  list: {
    textAlign: "center",
  },
  button: {
    marginTop : 20,
    float: "right",
  }
}));


const Docs = ({ data }) => {
  let temp = 0;
  return data.map((file, i) => {
    temp += file.file_url ? 1 : 0;
    return file.file_url ? (
      <div>
        <a style={{ display: 'inline-block', borderRadius: 4, lineHeight: 1, marginRight: 8, marginBottom: 8, padding: 8, backgroundColor: '#f0f0f0' }} href={file.file_url} target="_blank" title={file.name}>{getFileNameFromUrl(file?.file_url)} </a>
      </div>
    ) : null
  });
}

const DocList = ({ id }) => {
  const classes = useStyles();
  const [checkListData, setCheckListData] = useState();
  const [showUpload, setShowUpload] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [rowData, setRowData] = useState();
  const [value, setValue] = useState();
  const [array, setArray] = useState([]);
  const [description, setDescription] = useState();

  const getValue = (e) => {
    const val = e?.target?.value;
    if (!val) return;
    if (array.includes(val)) {
      var n = array.indexOf(val);
      setArray((d) => {
        d.splice(n, 1);
        return d;
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
    setModalData(data);
    setDescription(desc);
  }

  const onView = () => { };

  const onDocUpload = (row) => {
    setShowUpload(true);
    setRowData(row);
  };

  useMount(() => {
    getDealershipCheckList(id)
      .then((data) => setCheckListData(data))
      .catch((e) => null);
  });
  const DeleteDocs = () => {
    deleteDocsImage(array, id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
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
      formData.append(`fileName`, fileName);
      formData.append(`id`, rowData.doc_id);
    });
    fetch(`${URL.base}${URL.checklist}/${dealerShipId}/doc/${docID}`, {
      method: 'POST',
      body: formData
    })
      .then(data => {
        enqueueSnackbar('File Upload Success', { variant: "success" });
        onCloseUploader();
        window.location.reload();
      })
      .catch(error => {
        enqueueSnackbar('File Upload Failed', { variant: "error" });

      })

    // uploadDocument(dealerShipId, docID, formData)
    //   .then(data => {
    //     enqueueSnackbar('File Upload Success', { variant: "success" });
    //     onCloseUploader();
    //   })
    //   .catch(e => {
    //     enqueueSnackbar('File Upload Failed', { variant: "error" });
    //   });
  };

  return (
    <div className={classes.wrapper}>
      {showUpload && <FileUpload handleSave={handleSave} id={id} data={rowData} open={showUpload} onCloseUploader={onCloseUploader} />}
      {/* <Typography variant="h5" align={"center"} className={classes.title}>
        Dealership Documents
      </Typography> */}
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            {/* <TableCell align="center">ID</TableCell> */}
            <TableCell style={{ minWidth: 300 }}>Document Name</TableCell>
            {/* <TableCell align="center">Document Type</TableCell> */}
            <TableCell align="center">Files</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(checkListData) && checkListData.map((row, i) => row.doc_type !== 'dealer' && (
            <TableRow key={row.doc_id}>
              {/* <TableCell align="center">{row.doc_id}</TableCell> */}
              <TableCell>{row.description}</TableCell>
              {/* <TableCell align="center">{row.doc_type}</TableCell> */}
              <TableCell align="right">
                <Docs data={Array.isArray(row.file_data) && row.file_data.length ? row.file_data : []} />
                <ButtonGroup size="small" aria-label="dealer action buttons">
                  <Button onClick={() => handleModal(row.file_data, row.description)}>Delete</Button>
                  <Button onClick={(e) => onDocUpload(row)}>Upload</Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FormDialog
        title={description}
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className={classes.content}>
          <div className={classes.list}>
            <div>
              {
                modalData.map(item => {
                  return (
                    < Paper key={item.file_id} >
                      <FormGroup>
                        <FormControlLabel
                          key={item.file_id}
                          control={<Checkbox key={item.region} color="primary" value={item.file_id} onChange={(e) => getValue(e)} />}
                          label={getFileNameFromUrl(item?.file_url)}
                          value={getFileNameFromUrl(item?.file_url)}
                        />
                      </FormGroup>
                    </Paper>
                  )

                })
              }
            </div>
          </div>
          {
            array.length !== 0 ? <DeleteButton className={classes.button} variant="contained" onClick={() => DeleteDocs()}>Delete</DeleteButton> : null
          }
        </div>
      </FormDialog>
      {/* <Modal
        className={classes.modal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        action={array.length !== 0 ? <DeleteButton className={classes.button} variant="contained" onClick={() => DeleteDocs()}>Delete</DeleteButton> : null}

      >
        <div className={classes.inner_modal}>
          <Box p={2} borderRadius={4} bgcolor={"#f0f0f0"} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" component="h2">{description}</Typography>
            <IconButton size="small">
              <CloseIcon onClick={() => setOpenModal(false)} />
            </IconButton>
          </Box>
          
          </div>
        </div>
      </Modal> */}
    </div >

  );
};

export default DocList;
