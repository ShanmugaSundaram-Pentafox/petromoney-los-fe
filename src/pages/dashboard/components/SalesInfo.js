import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import Currency from '../../../components/Number/Currency';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core';
import { getDealershipSalesById, postDealershipSalesById } from '../../../services/dealerships.service';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { useSnackbar } from "notistack";


/**
{
  "dealership_id": 15257010,
  "from_year": 2016,
  "hsd": 593.77,
  "hsd_rs": 930.03,
  "ms": 729.0,
  "ms_rs": 1343.0,
  "tmf": 1523.8,
  "to_year": 2017
}
 */


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
    marginBottom: 20,
  }
}));

const SalesInfoWrapper = styled.div`
  padding-top: 8px;
  margin-bottom:10px;
  overflow-y:auto;
  h5 {
    // margin-top: 12px;
    // font-size: 18px;
  }
`;

const SalesTableWrapper = styled.div`
  display: flex;
  padding: 4px 0;
  flex-direction: ${props => props.column ? 'column' : 'row'};

  > div {
    &:last-child {
      // flex: 1;
      // padding-left: 12px;
    }
  }
`;

const SalesInfo = ({
  id,
  titleAlign,
  column,
  currentUser
}) => {
  const [info, setInfo] = useState([]);
  const classes = useStyles();
  const [addNewRow, setAddNewRow] = useState();
  const [apiData, setApiData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [editRow, setEditRow] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      getDealershipSalesById(id)
        .then(data => setInfo(data))
        .catch(err => null)
    }
  }, [id]);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
    if (parseInt(apiData.from_year) < 1900 || parseInt(apiData.from_year) >= parseInt(apiData.to_year)){
      enqueueSnackbar("Year error, Please check...", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "error",
      });
    }
    else{
      if (Object.keys(apiData).length < 4) return null;
      const objBody = {
        user_id: currentUser.id, ...apiData
      }
      postDealershipSalesById(id, objBody)
        .then(res => {
          setInfo(res);
          setAddNewRow(false);
        })
        .catch(err => {
          console.log('Sales data save error - ', err);
        })
      
    }
  }

  const saveEditRow = (data, i) => {
  if (parseInt(data.from_year) < 1900 || parseInt(data.from_year) >= parseInt(data.to_year)){
      enqueueSnackbar("Year error, Please check...", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "error",
      });
    } else {
      const objBody = {
        user_id: currentUser.id, ...data
      }
      postDealershipSalesById(id, objBody)
        .then(res => {
          setInfo(res);
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

  // if(Array.isArray(info) && !info.length)
  //   return (
  //     <SalesInfoWrapper>
  //       <Typography align={titleAlign} variant="h5">Sales data not available</Typography>
  //       <div style={{ textAlign: 'center', marginTop: 8, paddingBottom: 8 }}>
  //         <Button color="primary" variant="contained" size="small" onClick={() => null}>Add Sales Data</Button>
  //       </div>
  //     </SalesInfoWrapper>
  //   );
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
        <UserCan
          role={currentUser.role_name}
          perform={rulesList.dealership_edit}
          yes={() => (
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Button color="primary" variant="contained" size="small" onClick={() => setAddNewRow(true)}>Add Sales Data</Button>
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
                {/* <TableCell align="center">MS Gross</TableCell> */}
                <TableCell align="center">HSD</TableCell>
                {/* <TableCell align="center">HSD Gross</TableCell> */}
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
                        fullWidth={false}
                        label="From Year"
                        name="from_year"
                        type="number"
                        value={editRow.from_year}
                        onChange={onEditTextChange}
                      />
                      -
                      <TextInput
                        fullWidth={false}
                        label="To Year"
                        name="to_year"
                        type="number"
                        value={editRow.to_year}
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
                    <TableCell scope="row" component="th">{row.from_year} - {row.to_year}
                      {/* {row.to_year >= 2020 ? <InfoOutlinedIcon
                        className={classes.infoIcon}
                        color='primary'
                        aria-haspopup="true"
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose} />
                        : null} */}
                    </TableCell>
                    {/* {row.to_year >= 2020 ?
                      <TableCell align="center" colSpan={2}>{row.ms?.toFixed(2)}</TableCell>
                      : <> */}
                    <TableCell align="right">{row.ms?.toFixed(2)}</TableCell>
                    {/* <TableCell align="right">{row.ms_gross?.toFixed(2)}</TableCell> */}
                    <TableCell align="right">{row.hsd?.toFixed(2)}</TableCell>
                    {/* <TableCell align="right">{row.hsd_gross?.toFixed(2)}</TableCell> */}
                    {/* </>} */}
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

                    </TableCell>
                  </TableRow>
                ))
              }
              {
                addNewRow && (
                  <TableRow key={"new-row"}>
                    <TableCell scope="row" component="th">
                      <TextInput
                        fullWidth={false}
                        label="From Year"
                        name="from_year"
                        type="number"
                        value={apiData.from_year}
                        onChange={onTextChange}
                      />
                      -
                      <TextInput
                        fullWidth={false}
                        label="To Year"
                        name="to_year"
                        type="number"
                        value={apiData.to_year}
                        onChange={onTextChange}
                      />
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
                        <ClearRoundedIcon fontSize="small" />
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        // className={classes.btnSuccess}
                        onClick={saveNewSalesData}>
                        <DoneRoundedIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>

                )
              }
            </TableBody>
          </Table>

          {/* <UserCan
            role={currentUser.role_name}
            perform={rulesList.dealership_edit}
            yes={() => (
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Button color="primary" variant="contained" size="small" onClick={() => setAddNewRow(true)}>Add Sales Data</Button>
              </div>
            )}
          /> */}
        </div>
        <div className={classes.table}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sales Data(in Lakhs)</TableCell>
                <TableCell align="center">MS</TableCell>
                <TableCell align="center">MS Gross</TableCell>
                <TableCell align="center">HSD</TableCell>
                <TableCell align="center">HSD Gross</TableCell>
                <TableCell align="right">Total (in Lakhs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                info.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row" component="th">{row.from_year} - {row.to_year}
                      {/* {row.to_year >= 2020 ? <InfoOutlinedIcon
                        className={classes.infoIcon}
                        color='primary'
                        aria-haspopup="true"
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose} />
                        : null} */}
                    </TableCell>
                    {/* {row.to_year >= 2020 ?
                      <TableCell align="center" colSpan={2}><Currency value={row.ms_rs?.toFixed(2)} /></TableCell>
                      : <> */}
                    <TableCell align="right"><Currency value={row.ms_rs?.toFixed(2)} /></TableCell>
                    <TableCell align="right"><Currency value={row.ms_gross?.toFixed(2)} /></TableCell>
                    <TableCell align="right"><Currency value={row.hsd_rs?.toFixed(2)} /></TableCell>
                    <TableCell align="right"><Currency value={row.hsd_gross?.toFixed(2)} /></TableCell>
                    {/* </>} */}
                    <TableCell align="right"><Currency value={(row.ms_rs + row.hsd_rs)?.toFixed(2)} /></TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </SalesTableWrapper>

    </SalesInfoWrapper>
  )
}

export default SalesInfo;