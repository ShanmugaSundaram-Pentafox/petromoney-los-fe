import { IconButton } from '@material-ui/core'
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseIcon from '@material-ui/icons/Close';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { getOmcList } from '../../../services/common.service';
import { addAdditionalDetails, deleteOtherDetailsByID, updateAdditionalDetails } from '../../../services/PDReport.services';
import { isAllowed } from '../../../utils/cerbos';
import { compareObject } from '../../../utils/compareObject.util';
import CheckAllowed from '../../rbac/CheckAllowed';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: '#f6f6f6',
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
  },
  typography: {
    marginTop: 12,
    textAlign: 'center'
  },
  number: {
    backgroundColor: 'white',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  }

}))

const AddOtherDetailsForm = ({ data, dealer_id, isEdit, callback, editable, currentUser }) => {
  const [omcs, setOmcs] = useState([])
  const [addNew, setAddNew] = useState(data ? false : true)
  const [editRow, setEditRow] = useState(false);
  const [initData, setInitData] = useState({})

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
      });
  })

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().nullable('Enter dealership name').required('Enter dealership name'),
      omc: Yup.string().nullable('Choose OMC').required('Choose OMC'),
      details: Yup.string().nullable('Enter details').required('Enter details'),
      mobile: Yup.string().nullable('Enter sales officer name').matches(/^\d{10}$/, 'Invalid mobile number').required('Enter valid mobile number'),
    }),
    onSubmit: values => {
      let obj = {};
      if (editRow) {
        obj = compareObject(initData, values)
      }
      else {
        obj = { ...values }
      } 
      const edit_value = { ...obj, id: values.id}
      if (editRow) {
        updateAdditionalDetails(edit_value, dealer_id)
          .then(res => {
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
          })
      }
    }
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }
  const editOthersRow = (rowData, rowIndex) => {
    setEditRow(true)
    setValues(rowData)
    setInitData(rowData)
  }
  const deleteOthersRow = (row, index) => {
    deleteOtherDetailsByID(row, dealer_id)
      .then(data => {
        enqueueSnackbar(data, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Other Bunk Details</div>
        <IconButton onClick={handleClose}  size='small'>
          <CloseIcon />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          {
            data?.length || addNew ? null :
              <Typography className={classes.typography}>No bunks found,Click &apos Add other bunk &apos to add.</Typography>
          }
          {
            addNew || editRow ? (
              <Box>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {
                      <>
                        <Grid item md={6}>
                          <TextInput
                            {...inputProps}
                            className={classes.number}
                            inputProps={{ className: classes.input }}
                            labelText="Dealership ID"
                            name="other_dealership_id"
                            value={values.other_dealership_id}
                            error={errors.other_dealership_id}
                            helperText={errors.other_dealership_id}
                            type='number'
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
                            {...inputProps}
                            className={classes.number}
                            inputProps={{ className: classes.input }}
                            labelText="Dealer mobile"
                            name="mobile"
                            type='number'
                            value={values.mobile}
                            error={errors.mobile}
                            helperText={errors.mobile}
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
                            <option value=" ">Choose OMC</option>
                            {
                              omcs?.map((item, i) => (<option key={i} value={item.id}>{item.name}</option>))
                            }
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
              </Box >
            ) : (
              <Grid container spacing={2}>{
                data.map((item, i) => {
                  return (
                    <Grid key={i} item md={6}>
                      <PreviewCard
                        onEdit={() => { editOthersRow(item, i) }}
                        onDelete={() => deleteOthersRow(item, i)}
                        action={isAllowed(currentUser?.permissions, resources_id?.personalDiscussion, action_id?.personalDiscussion?.bunkEdit)}
                      >
                        <Grid container spacing={2}>
                          <Grid item md={6}>
                            <ViewData title="Dealership ID" value={item.other_dealership_id} />
                            <ViewData title="OMC" value={(omcs.find(function (omc, index) {
                              if (omc?.id == item?.omc)
                                return true;
                            }))?.name} />
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
          <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bunkAdd}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setAddNew(true); setValues({}) }}
              style={{ marginBottom: 12 }}
            >
              Add other bunk
            </Button>
          </CheckAllowed>
        </div>
      </div>
    </div >
  )
}

export default AddOtherDetailsForm;