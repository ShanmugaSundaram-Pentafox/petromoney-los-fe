import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput, { InputWrapper } from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addReferenceDetails, deleteReferenceDetailsByID, updateReferenceById } from '../../../services/PDReport.services';
import { FormControl } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { useMount } from 'react-use';
import { getOmcList } from '../../../services/common.service';
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import { ViewData } from '../../../components/CommonComponents/FilePreview';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '55vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  actionFoot: {
    marginBottom: 16,
    marginTop: 12,
  },
  btn: {
    margin: 8
  },
  stepperRoot: {
    padding: 16,
    paddingTop: 8
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
  }
}))

const AddReferenceForm = ({ data, dealer_id, isEdit, callback }) => {
  const [addNew, setAddNew] = useState(data ? false : true)
  const [editRow, setEditRow] = useState(false)

  const handleClose = () => {
    callback();
  };

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Please enter dealership name'),
      id: Yup.string().required('Please enter dealership ID'),
      mobile: Yup.string().required('Please enter dealership mobile number'),
    }),
    onSubmit: values => {
      const data = { ...values, name: values.name?.toUpperCase() }
      if (editRow) {
        updateReferenceById(data, dealer_id)
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
            console.log(e);
          })

      }
      else {
        addReferenceDetails(data, dealer_id)
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
            console.log(e);
          })
      }
    }
  });
  const editReferenceRow = (rowData, rowIndex) => {
    setEditRow(true)
    setValues(rowData)
  }
  const deleteReferenceRow = (row, index) => {
    deleteReferenceDetailsByID(row, dealer_id)
      .then(data => {
        console.log(data)
      })
      .catch((e) => {
        console.log(e);
      })

  }
  const inputProps = {
    direction: "column",
    alignTop: true,
    onChange: handleChange,
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Reference Details</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            data.length || addNew ? null :
              <Typography className={classes.typography}>No references found,Click 'Add reference' to add.</Typography>
          }
          {
            addNew || editRow ? (
              <Box>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        labelText="Dealership ID"
                        name="dealership_id"
                        value={values.dealership_id}
                        error={errors.dealership_id}
                        helperText={errors.dealership_id}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        labelText="Dealer name"
                        name="name"
                        value={values.name?.toUpperCase()}
                        error={errors.name}
                        helperText={errors.name}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextInput
                        {...inputProps}
                        labelText="Dealer mobile"
                        name="mobile"
                        value={values.mobile}
                        error={errors.mobile}
                        helperText={errors.mobile}
                      />
                    </Grid>
                    <Grid item md={2}>
                      <div style={{ paddingTop: 24 }}>
                        <label>Remarks</label>
                      </div>
                    </Grid>
                    <Grid item md={4}>
                      <FormControl style={{ paddingTop: 16 }}>
                        <RadioGroup name="remarks" value={values.remarks} onChange={handleChange}>
                          <FormGroup row>
                            <FormControlLabel value="POSITIVE" control={<Radio color="secondary" />} label="Positive" />
                            <FormControlLabel value="NEGATIVE" control={<Radio color="secondary" />} label="Negative" />
                          </FormGroup>
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <div className={classes.actionFoot}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div>
                        <Button
                          variant="outlined"
                          className={classes.btn}
                          onClick={() => { setAddNew(false); setEditRow(false) }}
                        >
                          Cancel
                        </Button>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          type="submit"
                          className={clsx(classes.btn, classes.editButton)}
                          startIcon={<CheckOutlinedIcon />}
                          onClick={handleSubmit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className={classes.actionFoot}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div>
                      <Button
                        variant="outlined"
                        className={classes.btn}
                        onClick={() => { setAddNew(false); setEditRow(false) }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        type="submit"
                        className={clsx(classes.btn, classes.editButton)}
                        startIcon={<CheckOutlinedIcon />}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </Box >
            ) : (
              <Grid container spacing={2}>{
                data.map((item, i) => {
                  return (
                    <Grid item md={6}>
                      <PreviewCard
                        onEdit={() => { editReferenceRow(item, i) }}
                        onDelete={() => deleteReferenceRow(item, i)}
                      >
                        <Grid container spacing={2}>
                          <Grid item md={6}>
                            <ViewData title="Dealership ID" value={item.dealership_id} />
                            <ViewData title="Mobile" value={item.mobile} />
                          </Grid>
                          <Grid item md={6}>
                            <ViewData title="Name" value={item.name} />
                            <ViewData title="Remark" value={item.remarks} />
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
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              // disabled={loading}
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setAddNew(true); setValues({ remarks: 'POSITIVE' }) }}
            >
              Add Reference
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}
export default AddReferenceForm;