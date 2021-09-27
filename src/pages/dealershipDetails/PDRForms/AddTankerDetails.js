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
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import { Grid, Paper } from '@material-ui/core';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import * as Yup from 'yup';

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
  },
  actionFoot: {
    marginTop: 12,
  },
  btn: {
    margin: 8
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
}))


const AddTankerDetails = ({ dealer_id, tankerAdd, setTankerAdd }) => {
  const [tankerData, setTankerData] = useState([])
  const [editable, setEditable] = useState(true)
  const [edit, setEdit] = useState(false)
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
    validationSchema: Yup.object().shape({
      vehicle_no: Yup.string().required('Enter Tanker No'),
      tanker_type: Yup.string().required('Choose Tanker Type'),
      tanker_capacity: Yup.number().required('Enter Tanker Capacity'),
      operation_hours: Yup.number().required('Choose Operational hours'),
    }),
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
    <div>
      {
        tankerAdd ? (
          <>
          <Paper style={{padding: 25, borderRadius: 5 }} elevation={2}>
          <Grid container spacing={2} style={{display: 'flex', justifyContent: 'center'}}>
            <Grid item md={6}>
              <label><strong>Tanker number</strong></label>
              <TextInput
                className={classes.field}
                name="vehicle_no"
                value={editRow.vehicle_no?.toUpperCase()}
                onChange={handleChange}
                disabled={edit}
                error={errors.vehicle_no}
                helperText={edit ? "Cannot edit vehicle number" : errors.vehicle_no}
              />
            </Grid>
            <Grid item md={6}>
              <label><strong>Tanker type</strong></label>
              <TextInput
                select
                className={classes.field}
                name="tanker_type"
                error={errors.tanker_type}
                helperText={errors.tanker_type}
                value={editRow.tanker_type}
                onChange={ !edit ? handleChange : onEditTextChange}
              >
                <option value=" ">Choose type</option>
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
              </TextInput>
            </Grid>
            <Grid item md={6}>
              <label><strong>Tanker capacity in liters</strong></label>
              <TextInput
                className={classes.field}
                name="tanker_capacity"
                error={errors.tanker_capacity}
                helperText={errors.tanker_capacity}
                value={editRow.tanker_capacity}
                onChange={ !edit ? handleChange : onEditTextChange}
              />
            </Grid>
            <Grid item md={6}>
              <label><strong>Operational hours</strong></label>
              <TextInput
                select
                className={classes.field}
                name="operation_hours"
                value={editRow.operation_hours}
                error={errors.operation_hours}
                helperText={errors.operation_hours}
                onChange={ !edit ? handleChange : onEditTextChange}
              >
                <option value=" ">Choose time</option>
                {opHours.map((op, i) => (<option key={i} value={op.id}>{op.name}</option>))}
              </TextInput>
            </Grid>
          </Grid>

            <div className={classes.actionFoot}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div>
                  <Button
                    variant="outlined"
                    className={classes.btn}
                    onClick={() => { 
                      setTankerAdd(false) 
                      setEditRow({})
                      setEdit(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    // type="submit"
                    className={clsx(classes.btn, classes.editButton)}
                    startIcon={<CheckOutlinedIcon />}
                    onClick={!edit ? handleSubmit : () => saveEditRow(editRow)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
          </>

        ) : (
          <Grid container spacing={2}>
            {
              tankerData && tankerData.map((item, i) => {
                return (
                  <Grid item md={6}>
                  <PreviewCard
                    onEdit = {() => {
                      editTankerRow(item, i)
                      setEdit(true)
                      setTankerAdd(true)
                    }}
                    onDelete = {() => deleteTankerRow(item, i)}
                  >
                    <Grid container spacing={2} >
                      <Grid item md={6}>
                        <ViewData title="Tanker No" value={item.vehicle_no} />
                        <ViewData title="Tanker Type" value={item.tanker_type} />
                      </Grid>
                      <Grid item md={6}>
                        <ViewData title="Capacity" value={item.tanker_capacity} />
                        <ViewData title="Operational Time" value={item.operation_hours} />
                      </Grid>
                    </Grid>
                  </PreviewCard>
                  </Grid>
                )
              })
            }
          </Grid>
        )
      }
    </div>
  )
}
export default AddTankerDetails;