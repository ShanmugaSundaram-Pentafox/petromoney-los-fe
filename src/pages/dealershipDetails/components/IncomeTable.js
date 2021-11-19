import React, { useState, Fragment } from 'react';
import { useMount } from 'react-use';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
import TextInput from '../../../components/TextInput/TextInput';
import Currency from '../../../components/Number/Currency';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { getDealershipIncomeById, postDealershipIncomeById, updateDealershipIncomeById } from '../../../services/dealerships.service';
import { getDealersWithCoapplicants } from '../../../services/dealers.service';
import { useFormik } from 'formik';
import { getBusinessTypes } from '../../../services/common.service';
import { compareObject } from '../../../utils/compareObject.util';

const useStyles = makeStyles(theme => ({
  table: {
    padding: 8
  },
  formWrapper: {
    padding: '0 15px'
  },
  row: {
    paddingRight: 4,
    paddingBottom: 14
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  btnEdit: {
    '&.MuiButton-root': { color: "#2196f3" },
    border: "1px #2196f3 solid",
    marginLeft: 2
  },
}));

const IncomeTable = ({ id, editable, currentUser }) => {
  const classes = useStyles();
  const [income, setIncome] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [applicantsList, setApplicantsList] = useState([]);
  const [addNewRow, setAddNewRow] = useState();
  const [apiData, setApiData] = useState({});
  const [editRow, setEditRow] = useState({});

  const [loading, setLoading] = useState(false);
  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };

  const { values, errors, handleChange, handleSubmit, handleReset, setValues } = useFormik({
    initialValues: {},
    onSubmit: values => {
      values.business_name = values.business_name.toUpperCase();
      setLoading(true);
      const objBody = {
        user_id: currentUser.id, ...values
      }
      postDealershipIncomeById(id, objBody)
        .then(res => {
          setIncome(res);
          setLoading(false);
          setAddNewRow(false);
        })
        .catch(err => {
          console.log('Income data save error - ', err);
          setLoading(false);
        })
    }
  })

  useMount(() => {
    getBusinessTypes()
      .then(setBusinessTypes)
      .catch(err => {
        console.log('BusinessTypes fetch error - ', err)
      })
    getDealersWithCoapplicants(id)
      .then(setApplicantsList)
      .catch(err => {
        console.log('DealersWithCoapplicants fetch error - ', err);
      });

    getDealershipIncomeById(id)
      .then(setIncome)
      .catch(err => {
        console.log('Incomes data fetch error - ', err);
      });
  });

  const onTextChange = e => {
    const { name, value } = e.target;
    setApiData({
      ...apiData,
      [name]: value
    })
  }

  const onEditTextChange = e => {
    const { name, value } = e.target;
    setEditRow({
      ...editRow,
      [name]: value
    })
  }

  const editIncomeRow = (rowData, rowIndex) => {
    setEditRow({ ...rowData, rowIndex });
  }

  const saveIncomeRow = (rowData, rowIndex) => {
    // const objBody = {
    //   user_id: currentUser.id, ...rowData
    // }
    const data = { ...rowData, business_name: rowData?.business_name?.toUpperCase() }
    const obj = compareObject(income[rowIndex], data)
    const fields = { ...obj, id: rowData.id }
    updateDealershipIncomeById(id, fields)
      .then(res => {
        setIncome(res);
        setLoading(false);
        setEditRow({});
        setApiData({});
      })
      .catch(err => {
        console.log('Income data update error - ', err);
        setLoading(false);
      })
  }

  const saveNewIncome = () => {
    console.log('Income api body - ', apiData)
    if (Object.keys(apiData).length < 3) return null;
    // const objBody = {
    //   user_id: currentUser.id, ...apiData
    // }
    const data = { ...apiData, business_name: apiData?.business_name?.toUpperCase() }
    postDealershipIncomeById(id, data)
      .then(res => {
        setIncome(res);
        setLoading(false);
        setAddNewRow(false);
        setApiData({});
      })
      .catch(err => {
        console.log('Income data save error - ', err);
        setLoading(false);
      })
  }

  return (
    <Fragment>

      <Table className={classes.table} size="small" aria-label="Income">
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Business Age</TableCell>
            <TableCell align="right">FY Income</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Array.isArray(income) && income.map((item, i) => editRow.rowIndex === i ? (
              <TableRow key={i}>
                <TableCell>
                  <TextInput
                    label="Business Name"
                    name="business_name"
                    value={editRow.business_name?.toUpperCase()}
                    onChange={onEditTextChange}
                  />
                </TableCell>
                <TableCell>
                  <TextInput
                    label="Business Age"
                    name="business_age"
                    type="number"
                    value={editRow.business_age}
                    onChange={onEditTextChange}
                  />
                </TableCell>
                <TableCell align={"right"}>
                  <TextInput
                    money
                    label="FY Income"
                    name="cur_fy_income"
                    type="number"
                    value={editRow.cur_fy_income}
                    onChange={onEditTextChange}
                  />
                </TableCell>
                <TableCell align={"right"}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    className={classes.btnSuccess}
                    onClick={() => saveIncomeRow(editRow, i)}>
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={i}>
                <TableCell>{item.business_name}</TableCell>
                <TableCell>{item.business_age}</TableCell>
                <TableCell align={"right"}>
                  <Currency value={item.cur_fy_income} />
                </TableCell>
                <TableCell align={"right"}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    className={clsx(classes.btnSuccess, classes.btnEdit)}
                    onClick={() => editIncomeRow(item, i)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
          {
            addNewRow && (
              <TableRow key={"new-row"}>
                <TableCell>
                  <TextInput
                    label="Business Name"
                    name="business_name"
                    value={apiData.business_name?.toUpperCase()}
                    onChange={onTextChange}
                  />
                </TableCell>
                <TableCell align={"right"}>
                  <TextInput
                    label="Business Age"
                    name="business_age"
                    type="number"
                    value={apiData.business_age}
                    onChange={onTextChange}
                  />
                </TableCell>
                <TableCell align={"right"}>
                  <TextInput
                    money
                    label="FY Income"
                    name="cur_fy_income"
                    type="number"
                    value={apiData.cur_fy_income}
                    onChange={onTextChange}
                  />
                </TableCell>
                <TableCell align={"right"}></TableCell>
              </TableRow>
            )
          }
          <TableRow key={"add-row"}>
            <TableCell align="right" colSpan={4}>
              {
                addNewRow ? (
                  <Fragment>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setAddNewRow(false);
                      }}>
                      <DeleteForeverRoundedIcon fontSize="small" />
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      className={classes.btnSuccess}
                      onClick={saveNewIncome}>
                      <DoneRoundedIcon fontSize="small" />
                    </Button>
                  </Fragment>
                ) : (editable && (

                  <Button
                    variant="contained"
                    className={clsx(classes.btn, classes.btnSuccess)}
                    onClick={() => setAddNewRow(true)}>Add Income</Button>
                ))
              }
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* <Dialog
        open={addNewRow}
        fullWidth
        maxWidth={'sm'}
        // onClose={() => setAddNewRow(false)}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add Income Detail</DialogTitle>
        <DialogContent dividers>
          <div className={classes.formWrapper}>
            <Grid container>
              <Grid {...gridItem}>
                <TextInput
                  label="Name of the Business"
                  name="business_name"
                  defaultValue={values.business_name}
                  onChange={handleChange}
                  />
              </Grid>
              <Grid {...gridItem}>
                <TextInput
                  select
                  label="Business Type"
                  name="business_type"
                  defaultValue={values.business_type}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                >
                  {
                    businessTypes.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                  }
                  <option value="">Test</option>
                </TextInput>
              </Grid>
              <Grid {...gridItem}>
                <TextInput
                  select
                  label="Business Owner"
                  name="business_owner"
                  defaultValue={values.business_owner}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                >
                  {
                    applicantsList.map((item, i) => <option key={i} value={item.value}>{item.label}</option>)
                  }
                </TextInput>
              </Grid>
              <Grid {...gridItem}>
                <TextInput
                  label="Business Age(Years)"
                  name="business_age"
                  type="number"
                  defaultValue={values.business_age}
                  onChange={handleChange}
                  />
              </Grid>
              <Grid {...gridItem}>
                <TextInput
                  money
                  label="Latest FY Turnover"
                  name="cur_fy_turnover"
                  type="number"
                  defaultValue={values.cur_fy_turnover}
                  onChange={handleChange}
                  />
              </Grid>
              <Grid {...gridItem}>
                <TextInput
                  money
                  label="FY Net Profit/Loss"
                  name="cur_fy_profit_loss"
                  type="number"
                  defaultValue={values.cur_fy_profit_loss}
                  onChange={handleChange}
                  />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        {
          !loading && (
            <DialogActions>
              <Button onClick={() => setAddNewRow(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Save
              </Button>
            </DialogActions>
          )
        }
      </Dialog> */}
    </Fragment>
  )
}

export default IncomeTable;