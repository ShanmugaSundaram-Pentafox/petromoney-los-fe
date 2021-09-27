import React, { useState } from 'react';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import { useFormik } from 'formik';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from 'notistack';
import { addNewTanker, deleteTanker, getTankersById, updateTankerByID } from '../../../services/PDReport.services';
import { useMount } from 'react-use';

const useStyles = makeStyles((theme) => ({
  table: {
    padding: 8,
    marginTop: 8
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
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  field: {
    '&.MuiTextField-root .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      fontSize: 11
    }
  }
}))


const AddTankerDetails = ({ dealer_id }) => {
  const [tankerData, setTankerData] = useState([])
  const [editable, setEditable] = useState(true)
  const [addNewRow, setAddNewRow] = useState();
  const [editRow, setEditRow] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [opHours, setOpHours] = useState([{ id: 12, name: "12 hours" }, { id: 24, name: "24 hours" }])
  const classes = useStyles()

  useMount(() => {
    getTankersById(dealer_id)
      .then(data => {
        setTankerData(data)
      })
      .catch((e) => {
        console.log(e);
      })
  })
  const editTankerRow = (rowData, rowIndex) => {
    setEditRow({ ...rowData, rowIndex });
  }
  const deleteTankerRow = (row, index) => {
    deleteTanker(row, dealer_id)
      .then(data => {
        enqueueSnackbar(data, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
      })

  }
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      const data = { ...values, vehicle_no: values.vehicle_no?.toUpperCase() }
      addNewTanker(data, dealer_id)
        .then(res => {
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          setTimeout(() => {
            window.location.reload()
          }, 1500);
        })
        .catch(e => {
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    }
  });
  const saveEditRow = (data, i) => {
    updateTankerByID(data, dealer_id)
      .then(res => {
        setTankerData(res);
        setEditRow({});
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
        setTimeout(() => {
          window.location.reload()
        }, 1000);
      })
      .catch(err => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
  }
  const onEditTextChange = e => {
    const { name, value } = e.target;
    setEditRow({
      ...editRow,
      [name]: value
    })
  }
  return (
    <Table className={classes.table} size="small" aria-label="Income">
      <TableHead>
        <TableRow>
          <TableCell>Tanker number</TableCell>
          <TableCell>Tanker  Type</TableCell>
          <TableCell>Tanker Capacity</TableCell>
          <TableCell>Tanker Operation hours</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          tankerData?.map((row, i) => i === editRow?.rowIndex ? (
            <TableRow key={`edit-row-${i}`}>
              <TableCell>
                <TextInput
                  className={classes.field}
                  label="Tanker number"
                  name="vehicle_no"
                  value={editRow.vehicle_no?.toUpperCase()}
                  onChange={onEditTextChange}
                />
              </TableCell>
              <TableCell>
                <TextInput
                  select
                  className={classes.field}
                  labelText="Tanker type"
                  name="tanker_type"
                  value={editRow.tanker_type}
                  onChange={onEditTextChange}
                >
                  <option value=" ">Choose type</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                </TextInput>
              </TableCell>
              <TableCell>
                <TextInput
                  className={classes.field}
                  label="Tanker capacity in liters"
                  name="tanker_capacity"
                  value={editRow.tanker_capacity}
                  onChange={onEditTextChange}
                />
              </TableCell>
              <TableCell>
                <TextInput
                  className={classes.field}
                  label="Operational hours"
                  name="operation_hours"
                  value={editRow.operation_hours}
                  onChange={onEditTextChange}
                >
                  <option value=' '>Choose time</option>
                  {opHours.map((op, i) => (<option key={i} value={op.id}>{op.name}</option>))}
                </TextInput>
              </TableCell>
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
              <TableCell>{row.vehicle_no}</TableCell>
              <TableCell>{row.tanker_type}</TableCell>
              <TableCell>{row.tanker_capacity}</TableCell>
              <TableCell>{row.operation_hours}</TableCell>
              <TableCell align="right">
                {
                  editable ? (
                    <>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        className={classes.btnSuccess}
                        onClick={() => editTankerRow(row, i)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        className={classes.btnSuccess}
                        onClick={() => deleteTankerRow(row, i)}>
                        Delete
                      </Button>
                    </>
                  ) : null
                }

              </TableCell>
            </TableRow>
          ))
        }
        <TableRow key={"new-row"}>
          {
            addNewRow && (
              <>
                <TableCell>
                  <TextInput
                    className={classes.field}
                    label="Tanker number"
                    name="vehicle_no"
                    value={values.vehicle_no}
                    onChange={handleChange}
                  >
                  </TextInput>
                </TableCell>
                <TableCell>
                  <TextInput
                    select
                    className={classes.field}
                    label="Tanker Type"
                    name="tanker_type"
                    value={values.tanker_type}
                    onChange={handleChange}
                  >
                    <option value=" ">Choose type</option>
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                  </TextInput>
                </TableCell>
                <TableCell align={"right"}>
                  <TextInput
                    className={classes.field}
                    label="Tanker capacity (in liters)"
                    name="tanker_capacity"
                    value={values.tanker_capacity}
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell >
                  <TextInput
                    select
                    className={classes.field}
                    label="Operation hours"
                    name="operation_hours"
                    value={values.operation_hours}
                    onChange={handleChange}
                  >
                    <option value=' '>Choose time</option>
                    {opHours.map((op, i) => (<option key={i} value={op.id}>{op.name}</option>))}
                  </TextInput>
                </TableCell>
                <TableCell align={"right"}></TableCell>
              </>
            )
          }
        </TableRow>
        <TableRow key={"new-row2"}>

          {
            addNewRow ? (
              <TableCell colSpan={12} align="right">
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setAddNewRow(false);
                  }}>
                  Cancel
                </Button>
                &nbsp;&nbsp;
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  className={classes.btnSuccess}
                  onClick={handleSubmit}>
                  Save
                </Button>
              </TableCell>
            ) : (editable && (
              <TableCell align="right" colSpan={12}>
                <Button
                  variant="contained"
                  className={clsx(classes.btn, classes.btnSuccess)}
                  onClick={() => setAddNewRow(true)}>
                  Add Tanker
                </Button>
              </TableCell>
            ))
          }
        </TableRow>
      </TableBody>
    </Table >
  )
}
export default AddTankerDetails;