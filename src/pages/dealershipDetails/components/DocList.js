import React, { useState } from "react";
import { useMount } from "react-use";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import FileUpload from "../../../components/FileUpload";
import { getDealershipCheckList } from "../../../services/dealerships.service";

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

const DocList = ({ id }) => {
  const classes = useStyles();
  const [checkListData, setCheckListData] = useState();
  const [showUpload, setShowUpload] = useState(false);
  const [rowData, setRowData] = useState();

  const onCloseUploader = () => {
    setShowUpload(false);
  }

  const onView = () => {};

  const onDocUpload = (row) => {
    setShowUpload(true);
    setRowData(row);
  };

  useMount(() => {
    getDealershipCheckList(id)
      .then((data) => setCheckListData(data))
      .catch((e) => null);
  });

  if (!checkListData || !checkListData.length) return null;

  return (
    <div className={classes.wrapper}>
      {showUpload && <FileUpload id={id} data={rowData} open={showUpload} onCloseUploader={onCloseUploader}/>}
      <Typography variant="h5" align={"center"} className={classes.title}>
        Dealers Document
      </Typography>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Document Name</TableCell>
            <TableCell align="center">Document Type</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checkListData.map((row) => (
            <TableRow key={row.doc_id}>
              <TableCell align="center">{row.doc_id}</TableCell>
              <TableCell align="center">{row.doc_name}</TableCell>
              <TableCell align="center">{row.doc_type}</TableCell>
              <TableCell align="center">
                <ButtonGroup size="small" aria-label="dealer action buttons">
                  <Button onClick={(e) => onView()}>View</Button>
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
