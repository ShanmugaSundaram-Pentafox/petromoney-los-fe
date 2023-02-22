import { Dialog, DialogActions, DialogContent, DialogContentText, Grid, IconButton } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import DealerEditForm from './DealerEditForm';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { API } from '../../../config/api';
import { logger } from '../../../config/logger';
import { getKycAgents, getKycStatus, initiateKYC } from '../../../services/dealers.service';
import { validateId } from '../../../services/dealerships.service';
import { addApplicants } from '../../../services/fileUpload.service';
import { isAllowed } from '../../../utils/cerbos';
import CheckAllowed from '../../rbac/CheckAllowed';



const useStyles = makeStyles((theme) => ({
  sidePanelTitle: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: 16,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  button: {
    color: green[800],
    marginLeft: 12
  }
}));

const DealerEditSideWrapper = ({
  modelType,
  dealersList,
  isAdd,
  dealershipId,
  data,
  currentUser,
  onClose,
  id,
}) => {
  const classes = useStyles();
  const queryClient = useQueryClient()
  const [readOnly, setReadOnly] = useState(isAdd === 'Add' ? false : true);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedState, setSelectedState] = useState();
  const [panValidateData, setPanValidateData] = useState({ icon: false })
  const [aadharValidateData, setAadharValidateData] = useState({ icon: false })
  const [kycStatus, setKycStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState();
  const [agentIdList, setAgentIdList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();


  const handleEdit = () => {
    setReadOnly(!readOnly);
  };

  useEffect(() => {
    if (isAllowed(currentUser?.permissions, resources_id.dealer, action_id.dealer.Vkyc)) {
      getKycStatus(modelType.toLowerCase(), values.dealership_id, values.id)
        .then((data) => {
          if (data?.is_initiated === 1)
            setKycStatus(true);
        })
        .catch((e) => {
          console.log(e)
        })
      if (open) {
        getKycAgents()
          .then((data) => {
            setAgentIdList(data)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }, [modelType, data.dealership_id, data.id, open])


  let coApplicantFields = {};
  if (modelType === 'COAPPLICANT') {
    coApplicantFields = {
      dealer_id: Yup.number().nullable('Enter Relation').required('Enter Relation'),
      relationship: Yup.string().min(2).nullable('Enter Relationship type').required('Enter Relationship Type'),
    };
  }

  let adminFields = {};
  if (currentUser?.role_id != 1) {
    adminFields = {
      pan: Yup.string()
        .required('Enter PAN')
        .nullable('Enter PAN')
        .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
        .uppercase(),
    }
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().nullable('Enter first name').required('Enter first name'),
    last_name: Yup.string().nullable('Enter last name').required('Enter last name'),
    father_name: Yup.string().nullable('Enter your father\'s name').required('Enter your father\'s name'),
    gender: Yup.string().nullable('Choose gender').required('Enter gender'),
    email: Yup.string().nullable('Enter email').email('Invalid email').required('Enter email'),
    city: Yup.string().nullable('Enter City').required('Enter City'),
    state: Yup.string().nullable('Enter State').required('Enter State'),
    address: Yup.string()
      .required('Enter address')
      .nullable('Enter address')
      .min(6, 'address must be atleast 6 characters')
      .test('Invalid characters', 'Please don\'t use _ # $ % ^ & * @ ( ) < > ! ~ { } = : ; " ? ', value => !/[_#$%^&*@()<>!~{}=:;"?]/.test(value)),
    mobile: Yup.string()
      .nullable('Enter mobile number')
      .matches(/^\d{10}$/, 'Invalid mobile number')
      .required('Enter valid mobile number'),
    residing_since: Yup.number().nullable('Enter the year').required('Enter the year'),
    marital_status: Yup.string().nullable('Enter your Marital status').required('Enter your Marital status'),
    pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
    aadhar: Yup.string()
      .nullable('Enter Aadhar')
      .matches(/^(\d{12})$|^(\d{16})$/, 'Invalid aadhar')
      .required('Enter valid aadhar'),
    pan: Yup.string()
      .nullable('Enter PAN')
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
      .uppercase(),
    ...coApplicantFields,
    ...adminFields,
  });

  const handleIdChange = (e) => {
    const { value } = e.target;
    setAgentId({ ...agentId, value: value })
  }

  const deleteFile = (type) => {
    const allTypes = {
      PAN: 'pan_file_url',
      AADHAR_FRONT: 'aadhar_f_file_url',
      AADHAR_BACK: 'aadhar_b_file_url',
    };
    const urlType = allTypes[type];
    let file = '';
    let fileData = data[urlType];
    if (typeof fileData === 'string') {
      file = fileData;
    }
    let url = `dealers/${data.dealership_id}`;
    if (data.id) {
      url += `/${data.id}`;
    }
    API.delete(url, { type, file })
      .then((res) => {
        onClose();
        queryClient.invalidateQueries(['dealers-coapplicant', id])
      })
      .catch((err) => {
        setReadOnly(true);
        logger(err);
      });
  };
  const handleSave = (value, fileType) => {
    if (fileType === 'PAN') {
      setFieldValue('pan_file_url', value[0]);
    } else if (fileType === 'AADHAR') {
      setFieldValue('aadhar_file_url', value[0]);
    } else {
      setFieldValue('profile_image_url', value[0]);
    }
  };
  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
    validateField
  } = useFormik({
    initialValues: {
      ...data, state: data?.state_code, state_name: data?.state, city_name: data?.city, city: data?.city_name
    },
    onReset: (values, e) => {
      setReadOnly(true);
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      // setLoading(true);
      if (isAdd === 'Add') {
        validateId('pan', values?.pan)
          .then((res) => {
            setPanValidateData({ icon: true, loading: false, idType: 'PAN', details: res?.details || {} })
            !values?.first_name && setFieldValue('first_name', res?.details?.firstName)
            !values?.last_name && setFieldValue('last_name', res?.details?.lastName)
            res?.details?.dob && setSelectedDate(parse(res?.details?.dob, 'yyyy-MM-dd', new Date()))
            !values?.gender && setFieldValue('gender', res?.details?.gender?.toUpperCase())
            !values?.pincode && setFieldValue('pincode', res?.details?.address?.pinCode)
            !values?.address && setFieldValue('address', `${res?.details?.address?.buildingName}, ${res?.details?.address?.streetName}, ${res?.details?.address?.city}, ${res?.details?.address?.state} - ${res?.details?.address?.pinCode}`)
          })
          .catch(e => {
            console.log(e);
            setPanValidateData({ icon: true, idType: 'PAN' })
          })
      }
      const dob = selectedDate ? format(new Date(selectedDate), 'dd-MM-yyyy') : values.dob ? values.dob : null
      const date_values = { ...values, relationship_id: 3, dob: dob, pan: values.pan.toUpperCase(), is_whatsapp: selectedState.checkedA === true ? 1 : 0, is_aadhar_linked: selectedState.checkedB === true ? 1 : 0, category:  modelType};

      addApplicants(date_values, dealershipId, modelType, currentUser)
        .then((message) => {
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          onClose()
          queryClient.invalidateQueries(['co-applicants', id])
          queryClient.invalidateQueries(['dealers-coapplicant', id])
          queryClient.invalidateQueries(['guarantors', id])
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    },
  });
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleStateChange = (state) => {
    setSelectedState(state);
  };

  const handleClose = () => {
    setOpen(!open);
    setAgentId({})
  };

  const handleInitiateKYC = () => {
    if (agentId?.value) {
      initiateKYC(modelType.toLowerCase(), values.dealership_id, values.id, agentId?.value)
        .then((message) => {
          setKycStatus(true);
          handleClose();
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        })
        .catch((err) => {
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
          logger(err);
        })
    }
    else {
      setAgentId({ ...agentId, error: 'Please choose agent to initiate VKYC' })
    }
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>
          {modelType === 'DEALER'
            ? 'Dealer Edit Form'
            : modelType === 'GUARANTOR'
              ? 'Guarantor Edit Form'
              : 'CoApplicant Edit Form'}
        </div>
        <IconButton onClick={onClose} size='small'>
          <CloseIcon />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <DealerEditForm
          dealersList={dealersList}
          deleteFile={deleteFile}
          readOnlyProps={readOnly}
          modelType={modelType}
          data={data}
          handleDate={handleDateChange}
          handleState={handleStateChange}
          values={values}
          errors={errors}
          onChange={handleChange}
          handleSave={handleSave}
          setFieldValue={setFieldValue}
          setPanValidateData={setPanValidateData}
          panValidateData={panValidateData}
          setAadharValidateData={setAadharValidateData}
          aadharValidateData={aadharValidateData}
          validateField={validateField}
          currentUser={currentUser}
          id={id}
          onClose={onClose}
        />
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          {!readOnly ? (
            !loading ? (
              <>
                <Button
                  variant='outlined'
                  startIcon={<NavigateBeforeRoundedIcon />}
                  disabled={loading}
                  onClick={onClose}
                >
                  Back
                </Button>

                <Button
                  variant='contained'
                  className={clsx(classes.btn, classes.editButton)}
                  startIcon={
                    !readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />
                  }
                  disabled={loading}
                  onClick={
                    loading ? () => null : readOnly ? handleEdit : handleSubmit
                  }
                >
                  Save
                </Button>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '90%',
                  margin: '0 auto',
                }}
              >
                <CircularProgress size={30} />
              </div>
            )
          ) : (
            <>
              <div>
                <Button
                  variant='outlined'
                  startIcon={<NavigateBeforeRoundedIcon />}
                  disabled={loading}
                  onClick={onClose}
                >
                  Back
                </Button>
              </div>
              {
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {
                    kycStatus ? (
                      <div style={{ display: 'flex', alignItems: 'center', marginRight: 12, backgroundColor: green[100], padding: 4, paddingRight: 12, borderRadius: 14 }}>
                        <CheckRoundedIcon style={{ color: green[400], marginRight: 8 }} />
                        <Typography style={{ color: green[800] }}>VKYC already initiated</Typography>
                      </div>
                    ) : (
                      <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.Vkyc}>
                        <Button
                          variant='outlined'
                          className={clsx(classes.btn, classes.editButton)}
                          disabled={loading}
                          onClick={handleClose}
                        >
                          Initiate VKYC
                        </Button>
                      </CheckAllowed>
                    )
                  }
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerEdit}>
                    <Button
                      variant='contained'
                      className={clsx(classes.btn, classes.editButton)}
                      startIcon={
                        !readOnly ? <NavigateNextRoundedIcon /> : <EditIcon />
                      }
                      disabled={loading}
                      onClick={
                        loading ? () => null : readOnly ? handleEdit : handleSubmit
                      }
                    >
                      Edit
                    </Button>
                  </CheckAllowed>
                </div>
              }
            </>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText className={classes.text}>Initiate VKYC</DialogContentText>
          <div style={{ width: '25vw', marginTop: 20, marginBottom: 20 }}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <TextInput
                  select
                  label='Choose Agent'
                  value={agentId?.value}
                  onChange={handleIdChange}
                  InputLabelProps={{ shrink: true }}
                >
                  {
                    <option value={' '}>choose agent</option>
                  }
                  {
                    agentIdList.length && agentIdList?.map((item, i) => {
                      return (
                        <option key={i} value={item?.id}>{item?.name}</option>
                      )
                    })
                  }
                </TextInput>
              </Grid>
            </Grid>
            {
              agentId?.error &&
                <Alert severity="error" style={{ padding: '0px 16px', marginTop: 12 }}>{agentId?.error}</Alert>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <div>
            <Button onClick={handleClose} variant="contained" >Cancel</Button>
            <Button onClick={kycStatus ? () => null : handleInitiateKYC} className={classes.button} >Initiate Video KYC</Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DealerEditSideWrapper;
