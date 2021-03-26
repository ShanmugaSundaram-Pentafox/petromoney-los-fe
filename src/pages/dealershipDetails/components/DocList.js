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
import { getDealershipCheckList} from "../../../services/dealerships.service";
import { getFileNameFromUrl } from "../../../utils/strings.util";
import { URL } from '../../../config/serverUrls'


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
}));

const Docs = ({ data }) => {
  let temp = 0;
  return data.map((file, i) => {
    temp += file.file_url ? 1 : 0;
    return file.file_url ? (
      <a style={{ display: 'inline-block', borderRadius: 4, lineHeight: 1, marginRight: 8, marginBottom: 8, padding: 8, backgroundColor: '#f0f0f0' }} href={file.file_url} target="_blank" title={file.name}>{getFileNameFromUrl(file?.file_url)}</a>
    ) : null
  });
}

const DocList = ({ id }) => {
  const classes = useStyles();
  const [checkListData, setCheckListData] = useState();
  const [showUpload, setShowUpload] = useState(false);
  const [rowData, setRowData] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const onCloseUploader = () => {
    setShowUpload(false);
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
                  {/* <Button onClick={(e) => onView()}>View</Button> */}
                  <Button onClick={(e) => onDocUpload(row)}>Upload</Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocList;
