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
import * as Yup from 'yup';
import Button from '../../../components/CommonComponents/Button/Button';
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import TextInput from '../../../components/TextInput/TextInput';
import { addReferenceDetails, deleteReferenceDetailsByID, updateReferenceById } from '../../../services/PDReport.services';

const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
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
    overflow: 'auto',
    backgroundColor: '#f6f6f6',
  },
  sidePanelWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw',
    padding: 14,
  },
  tableRow: {
    cursor: 'pointer'
  },
  document: {
    display: 'inline-block',
    borderRadius: 2,
    lineHeight: 1,
  },
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
  stepperRoot: {
    padding: 16,
    paddingTop: 8
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  subTitle: {
    marginTop: 8,
    marginBottom: 8
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
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    }
  }
}))

const AddReferenceForm = ({ data, dealer_id, isEdit, callback, editable }) => {
  const [addNew, setAddNew] = useState(data ? false : true)
  const [editRow, setEditRow] = useState(false);

  const handleClose = () => {
    callback();
  };
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().nullable('Please enter dealership name').required('Please enter dealership name'),
      mobile: Yup.string().nullable('Please enter dealership mobile number').required('Please enter dealership mobile number'),
    }),
    onSubmit: values => {
      const data = { ...values, name: values.name.toUpperCase() }
      if (editRow) {
        updateReferenceById(data, dealer_id)
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
        addReferenceDetails(data, dealer_id)
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
    }
  });
  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }
  const editRefRow = (rowData, rowIndex) => {
    setEditRow(true)
    setValues(rowData)
  }
  const deleteRefRow = (row, index) => {
    deleteReferenceDetailsByID(row, dealer_id)
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
        }
        )
      })
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
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <TextInput
                      select
                      {...inputProps}
                      labelText="Reference Type"
                      name="reference_type"
                      value={values.reference_type}
                      error={errors.reference_type}
                      helperText={errors.reference_type}
                    >
                      <option value="Dealer">Dealer</option>
                      <option value="Transporter">Transporter</option>
                      <option value="Client">Client</option>
                      <option value="Friend">Friend</option>
                    </TextInput>
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Name"
                      name="name"
                      value={values.name?.toUpperCase()}
                      error={errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText="Mobile"
                      name="mobile"
                      type='number'
                      value={values.mobile}
                      error={errors.mobile}
                      helperText={errors.mobile}
                      inputProps={{ className: classes.input }}
                    />
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
              </Box >
            ) : (
              <Grid container spacing={2}>{
                data.map((item, i) => {
                  return (
                    <Grid item md={6}>
                      <PreviewCard
                        onEdit={() => { editRefRow(item, i) }}
                        onDelete={() => deleteRefRow(item, i)}
                        action={!editable}
                      >
                        <Grid container spacing={2}>
                          <Grid item md={6}>
                            <ViewData title="Reference Type" value={item.reference_type} />
                            <ViewData title="Mobile" value={item.mobile} />
                          </Grid>
                          <Grid item md={6}>
                            <ViewData title="Name" value={item.name} />
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
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
          {
            !editable &&
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setAddNew(true); setValues({}) }}
              style={{ marginBottom: 12 }}
            >
              Add Reference
            </Button>
          }
        </div>
      </div>
    </div >
  )
}
export default AddReferenceForm;