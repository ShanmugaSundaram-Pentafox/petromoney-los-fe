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
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addAdditionalDetails, deleteOtherDetailsByID, updateAdditionalDetails } from '../../../services/PDReport.services';
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
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  actionFoot: {
    marginBottom: 16,
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
  }

}))

const AddOtherDetailsForm = ({ data, dealer_id, isEdit, callback }) => {
  const [loading, setLoading] = useState(false)
  const [omcs, setOmcs] = useState([])
  const [addNew, setAddNew] = useState(data ? false : true)
  const [editRow, setEditRow] = useState(false);

  const handleClose = () => {
    callback();
  };
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  useMount(() => {
    getOmcList()
      .then((data) => {
        setOmcs(data);
      })
      .catch((e) => {
        console.log(e);
      });

  })

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      // transport_name: Yup.string().required('Please enter transporter name'),
    }),
    onSubmit: values => {
      if (editRow) {
        updateAdditionalDetails(values, dealer_id)
          .then(res => {
            console.log(res)
            enqueueSnackbar(res, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'success',
            }
            )
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
            }
            )
          })
      }
      else {
        addAdditionalDetails(values, dealer_id)
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
  const inputProps = {
    direction: "column",
    alignTop: true,
    onChange: handleChange,
  }
  const editOthersRow = (rowData, rowIndex) => {
    setEditRow(true)
    setValues(rowData)
  }
  const deleteOthersRow = (row, index) => {
    deleteOtherDetailsByID(row, dealer_id)
      .then(data => {
        console.log(data)
      })
      .catch((e) => {
        console.log(e);
      })

  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Other Bunk Details</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            data?.length || addNew ? null :
              <Typography className={classes.typography}>No bunks found,Click 'Add other bunk' to add.</Typography>
          }
          {
            addNew || editRow ? (
              <Box>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {/* <Grid item md={6}>
                                            <div style={{ paddingTop: 12 }}>
                                                <label>Other Bunks owned in family member</label>
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl>
                                                <RadioGroup name="other_bunks_owned" value={values.other_bunks_owned} defaultValue={values.other_bunks_owned} onChange={handleChange}>
                                                    <FormGroup row>
                                                        <FormControlLabel value="yes" control={<Radio color="secondary" />} label="Yes" />
                                                        <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                                                    </FormGroup>
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid> */}
                    {
                      <>
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
                            value={values.name}
                            error={errors.name}
                            helperText={errors.name}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <TextInput
                            select
                            {...inputProps}
                            labelText="OMC name"
                            name="omc"
                            value={values.omc}
                            error={errors.omc}
                            helperText={errors.omc}
                          >
                            {omcs.map((omc) => (<option key={omcs.id} value={omcs.id}>{omc.name}</option>))}
                          </TextInput>
                        </Grid>
                        <Grid item md={6}>
                          <TextInput
                            {...inputProps}
                            labelText="Details"
                            name="details"
                            value={values.details}
                            error={errors.details}
                            helperText={errors.details}
                          />
                        </Grid>
                      </>
                    }
                  </Grid>
                </form>
              </Box >
            ) : (
              <Grid container spacing={2}>{
                data.map((item, i) => {
                  return (
                    <Grid item md={6}>
                      <PreviewCard
                        onEdit={() => { editOthersRow(item, i) }}
                        onDelete={() => deleteOthersRow(item, i)}
                      >
                        <Grid container spacing={2}>
                          <Grid item md={6}>
                            <ViewData title="Dealership ID" value={item.dealership_id} />
                            <ViewData title="OMC" value={item.omc} />
                          </Grid>
                          <Grid item md={6}>
                            <ViewData title="Name" value={item.name} />
                            <ViewData title="Details" value={item.details} />
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
              onClick={() => { setAddNew(true); setValues({}) }}
              style={{ marginBottom: 12 }}
            >
              Add other bunk
            </Button>
          </div>
        </div>
      </div>
    </div >


  )
}

export default AddOtherDetailsForm;