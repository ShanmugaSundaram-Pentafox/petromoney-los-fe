import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MonthlySalesInfo from './MonthlySalesInfo';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getDealershipSalesById, postDealershipSalesById } from '../../../services/dealerships.service';
import { useQuery } from 'react-query';


const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
  },
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
    marginBottom: 10,
  },
  btnEdit: {
    '&.MuiButton-root': { color: '#2196f3' },
    border: '1px #2196f3 solid',
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

const SalesInfo = ({
  id,
  titleAlign,
  column,
  currentUser,
  readOnly
}) => {
  // const [info, setInfo] = useState([]);
  const classes = useStyles();
  const [addNewRow, setAddNewRow] = useState();
  const [apiData, setApiData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [editRow, setEditRow] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { data: info = [] } = useQuery(['sales', id], () => getDealershipSalesById(id))


  // useEffect(() => {
  //   if (id) {
  //     getDealershipSalesById(id)
  //       .then(data => setInfo(data))
  //       .catch(err => null)
  //   }
  // }, [id]);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const onTextChange = e => {
    const { name, value } = e.target;
    setApiData({
      ...apiData,
      [name]: value
    })
  }

  const open = Boolean(anchorEl);

  const saveNewSalesData = () => {
    if (parseInt(apiData.from_year) < 1900 || parseInt(apiData.from_year) >= parseInt(apiData.to_year)) {
      enqueueSnackbar('Year error, Please check...', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
    else {
      if (Object.keys(apiData).length < 4) return null;
      const objBody = {
        user_id: currentUser.id, ...apiData
      }
      postDealershipSalesById(id, objBody)
        .then(res => {
          // setInfo(res);
          setAddNewRow(false);
        })
        .catch(err => {
          console.log('Sales data save error - ', err);
        })

    }
  }

  const saveEditRow = (data, i) => {
    if (parseInt(data.from_year) < 1900 || parseInt(data.from_year) >= parseInt(data.to_year)) {
      enqueueSnackbar('Year error, Please check...', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    } else {
      const objBody = {
        user_id: currentUser.id, ...data
      }
      postDealershipSalesById(id, objBody)
        .then(res => {
          // setInfo(res);
          setEditRow({});
        })
        .catch(err => {
          console.log('Sales data save error - ', err);
        })
    }
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
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant='subtitle2' component='div'>The combined value of MS and HSD are considered</Typography>
      </Popover>
      <div className={classes.title}>
        <Typography align={titleAlign} variant="h5">Sales History</Typography>
        {
          !readOnly && (
            <UserCan
              role={currentUser.role_name}
              perform={rulesList.dealership_edit}
              yes={() => (
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Button color="primary" variant="contained" size="small" onClick={() => setAddNewRow(true)}>Add</Button>
                </div>
              )}
            />
          )
        }

      </div>
      <SalesTableWrapper column='row'>
        <div className={classes.table}>
          <Table size="small">
            {
              Array.isArray(info) && info.length ? (
                <TableHead>
                  <TableRow>
                    <TableCell>Sales Data(in KL)</TableCell>
                    <TableCell>MS</TableCell>
                    <TableCell>HSD</TableCell>
                    <TableCell>Total (in KL)</TableCell>
                    {!readOnly && <TableCell align="right">Action</TableCell>}
                  </TableRow>
                </TableHead>
              ) : <Typography variant="body1" style={{color: 'rgb(0,0,0,0.5)'}}>NA</Typography>
            }
            <TableBody>
              {
                Array.isArray(info) && info?.map((row, i) => i === editRow?.rowIndex ? (
                  <TableRow key={`edit-row-${i}`}>
                    <TableCell scope="row" component="th">
                      <TextInput
                        number
                        fullWidth={false}
                        label="From Year"
                        name="from_year"
                        disabled={true}
                        value={editRow.from_year}
                        onChange={onEditTextChange}
                      />
                      -
                      <TextInput
                        number
                        fullWidth={false}
                        label="To Year"
                        name="to_year"
                        disabled={true}
                        value={editRow.to_year}
                        onChange={onEditTextChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        number
                        label="MS (KL)"
                        name="ms"
                        value={editRow.ms}
                        onChange={onEditTextChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        number
                        label="HSD (KL)"
                        name="hsd"
                        value={editRow.hsd}
                        onChange={onEditTextChange}
                      />
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                    {
                      !readOnly && (
                        <TableCell>
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
                      )
                    }

                  </TableRow>
                ) : (
                  <TableRow key={i}>
                    <TableCell scope="row" component="th">{row.from_year} - {row.to_year}</TableCell>
                    <TableCell>{row.ms?.toFixed(2)}</TableCell>
                    <TableCell>{row.hsd?.toFixed(2)}</TableCell>
                    <TableCell>{(row.ms + row.hsd)?.toFixed(2)}</TableCell>
                    {!readOnly && <TableCell align="right">
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
                    </TableCell>}
                  </TableRow>
                ))
              }
              {
                addNewRow && (
                  <TableRow key={'new-row'}>
                    <TableCell scope="row" component="th">
                      <TextInput
                        number
                        fullWidth={false}
                        label="From Year"
                        name="from_year"
                        value={apiData.from_year}
                        onChange={onTextChange}
                      />
                      -
                      <TextInput
                        number
                        fullWidth={false}
                        label="To Year"
                        name="to_year"
                        value={apiData.to_year}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        number
                        label="MS (KL)"
                        name="ms"
                        value={apiData.ms}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        number
                        label="HSD (KL)"
                        name="hsd"
                        value={apiData.hsd}
                        onChange={onTextChange}
                      />
                    </TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>
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
                        // className={classes.btnSuccess}
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
      <MonthlySalesInfo readOnly={readOnly} currentUser={currentUser} id={id} titleAlign={titleAlign} column='row' />
    </SalesInfoWrapper>
  )
}

export default SalesInfo;