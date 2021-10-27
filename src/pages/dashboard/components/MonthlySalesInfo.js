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
import { deleteDealershipMonthlySalesById, getDealershipSalesById, postDealershipMonthlySalesById, updateDealershipMonthlySalesById } from '../../../services/dealerships.service';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { useSnackbar } from "notistack";


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
  }
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

  useEffect(() => {
    if (id) {
      getDealershipSalesById(id)
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
      .then(res => {
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch(err => {
        enqueueSnackbar(err.message, {
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
        console.log('Sales data save error - ', err);
      })
  }

  const saveEditRow = (data, i) => {
    const objBody = {
      user_id: currentUser.id, ...data
    }
    updateDealershipMonthlySalesById(id, objBody)
      .then(res => {
        setInfo(res);
        setEditRow({});
      })
      .catch(err => {
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
              <Button color="primary" variant="contained" size="small" onClick={() => setAddNewRow(true)}>Add</Button>
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
                        type="number"
                        disabled={true}
                        value={editRow.year}
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
                    <TableCell scope="row" component="th">{row.month} - {row.year}</TableCell>
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
                            className={classes.btnSuccess}
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
                            className={classes.btnSuccess}
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
                        <option value="1">January</option>
                        <option value="2">Feburary</option>
                        <option value="3">March</option>
                        <option value="4">Apirl</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
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