import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core';
import { deleteDealershipMonthlySalesById, getDealershipMonthlySalesById, postDealershipMonthlySalesById, updateDealershipMonthlySalesById } from '../../../services/dealerships.service';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { useSnackbar } from "notistack";
import clsx from 'clsx';



const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
  },
  infoIcon: {
    width: 16,
    height: 15,
    color: '#ff0000'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  table: {
    marginBottom: 20,
  },
  btnDelete: {
    '&.MuiButton-root': { color: "#ef5350" },
    border: "1px #ef5350 solid",
    marginLeft: 2
  },
  btnEdit: {
    '&.MuiButton-root': { color: "#2196f3" },
    border: "1px #2196f3 solid",
    marginLeft: 2
  },
}));

const SalesInfoWrapper = styled.div`
  padding-top: 8px;
  margin-bottom:10px;
  overflow-y:auto;
  
`;

const SalesTableWrapper = styled.div`
  display: flex;
  padding: 4px 0;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`;

const getPastFiveYears = () => {
  const LastFiveYear = []
  const date = new Date();
  const currentYear = date.getFullYear();
  for (let i = 0; i < 5; i++) {
    LastFiveYear.push(currentYear - i)
  }
  return LastFiveYear;
}


const MonthlySalesInfo = ({ id, titleAlign, column, currentUser }) => {
  const [info, setInfo] = useState([]);
  const classes = useStyles();
  const [addNewRow, setAddNewRow] = useState();
  const [apiData, setApiData] = useState({});
  const [editRow, setEditRow] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const LastFiveYear = getPastFiveYears()

  const month = [
    { label: 'January', value: 1 },
    { label: 'Feburary', value: 2 },
    { label: 'March', value: 3 },
    { label: 'Apirl', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ]

  useEffect(() => {
    if (id) {
      getDealershipMonthlySalesById(id)
        .then(data => setInfo(data))
        .catch(err => null)
    }
  }, [id]);

  const onTextChange = e => {
    const { name, value } = e.target;
    setApiData({
      ...apiData,
      [name]: value
    })
  }

  const deleteSalesRow = (rowData, rowIndex) => {
    deleteDealershipMonthlySalesById(id, rowData, rowIndex)
      .then((res) => {
        setInfo(res);
      })
      .catch(err => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }

  const saveNewSalesData = () => {
    if (Object.keys(apiData).length < 4) return null;
    postDealershipMonthlySalesById(id, apiData)
      .then(res => {
        setInfo(res);
        setAddNewRow(false);
      })
      .catch(err => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        console.log('Sales data save error - ', err);
      })
  }

  const saveEditRow = (data, i) => {
    // const objBody = {
    //   user_id: currentUser.id, ...data
    // }
    delete data.rowIndex
    updateDealershipMonthlySalesById(id, data)
      .then(res => {
        setInfo(res);
        setEditRow({});
      })
      .catch(err => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
        console.log('Sales data save error - ', err);
      })
  }

  const editSalesRow = (rowData, rowIndex) => {
    setEditRow({ ...rowData, rowIndex });
  }

  const onEditTextChange = e => {
    const { name, value } = e.target;
    setEditRow({
      ...editRow,
      [name]: value
    })
  }
  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit)
  return (
    <SalesInfoWrapper>
      <div className={classes.title}>
        <Typography align={titleAlign} variant="h5">Sales History (Month-wise)</Typography>
        <UserCan
          role={currentUser.role_name}
          perform={rulesList.dealership_edit}
          yes={() => (
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Button color="primary" variant="contained" size="small" onClick={() => { setAddNewRow(true); setEditRow({}) }}>Add</Button>
            </div>
          )}
        />
      </div>
      <SalesTableWrapper column={column}>
        <div className={classes.table}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sales Data(in KL)</TableCell>
                <TableCell align="center">MS</TableCell>
                <TableCell align="center">HSD</TableCell>
                <TableCell align="right">Total (in KL)</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                info?.map((row, i) => i === editRow?.rowIndex ? (
                  <TableRow key={`edit-row-${i}`}>
                    <TableCell scope="row" component="th">
                      <TextInput
                        fullWidth={true}
                        label="Month"
                        name="month"
                        disabled={true}
                        value={month[editRow.month - 1].label}
                        onChange={onEditTextChange}
                      />
                      -
                      <TextInput
                        fullWidth={true}
                        label="Year"
                        name="year"
                        type="number"
                        disabled={true}
                        value={editRow.year}
                        onChange={onEditTextChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextInput
                        label="MS (KL)"
                        name="ms"
                        type="number"
                        value={editRow.ms}
                        onChange={onEditTextChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextInput
                        label="HSD (KL)"
                        name="hsd"
                        type="number"
                        value={editRow.hsd}
                        onChange={onEditTextChange}
                      />
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        className={classes.btnSuccess}
                        onClick={() => saveEditRow(editRow, i)}>
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setEditRow({});
                        }}>
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={i}>
                    <TableCell scope="row" component="th">{month.find(function (type, index) {
                      if (type.value == row.month)
                        return true;
                    })?.label} - {row.year}</TableCell>
                    <TableCell align="right">{row.ms?.toFixed(2)}</TableCell>
                    <TableCell align="right">{row.hsd?.toFixed(2)}</TableCell>
                    <TableCell align="right">{(row.ms + row.hsd)?.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {
                        editable ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            className={clsx(classes.btnSuccess, classes.btnEdit)}
                            onClick={() => editSalesRow(row, i)}>
                            Edit
                          </Button>
                        ) : null
                      }
                      {
                        editable ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            className={clsx(classes.btnSuccess, classes.btnDelete)}
                            onClick={() => deleteSalesRow(row, i)}>
                            Delete
                          </Button>
                        ) : null
                      }

                    </TableCell>
                  </TableRow>
                ))
              }
              {
                addNewRow && (
                  <TableRow key={"new-row"}>
                    <TableCell scope="row" component="th">
                      <TextInput
                        select
                        fullWidth={true}
                        label="Month"
                        name="month"
                        type="number"
                        value={apiData.month}
                        onChange={onTextChange}
                      >
                        <option value=" ">Choose month</option>
                        {
                          month.map((item, i) => {
                            return (
                              <option value={item.value}>{item.label}</option>
                            )
                          })
                        }
                      </TextInput>
                      -
                      <TextInput
                        select
                        fullWidth={true}
                        label="Year"
                        name="year"
                        type="number"
                        value={apiData.year}
                        onChange={onTextChange}
                      >
                        <option value=" ">Choose year</option>
                        {
                          LastFiveYear.map(item => {
                            return <option value={item}>{item}</option>
                          })
                        }
                      </TextInput>
                    </TableCell>
                    <TableCell align="right">
                      <TextInput
                        label="MS (KL)"
                        name="ms"
                        type="number"
                        value={apiData.ms}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextInput
                        label="HSD (KL)"
                        name="hsd"
                        type="number"
                        value={apiData.hsd}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setAddNewRow(false);
                        }}>
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={saveNewSalesData}>
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </div>
      </SalesTableWrapper>
    </SalesInfoWrapper>
  )
}
export default MonthlySalesInfo;