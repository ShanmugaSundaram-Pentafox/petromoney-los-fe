import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { grey } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
// import CardHeader from '@material-ui/core/CardHeader';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import AccountStatement from './AccountStatement';
import Button from '../../../components/CommonComponents/Button/Button';
import { AvatarCard, ViewData } from '../../../components/CommonComponents/FilePreview';
import FileUpload from '../../../components/FileUpload';
import TextInput from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { logger } from '../../../config/logger';
import { URL } from '../../../config/serverUrls';
import { rulesList } from '../../../config/userRules';
import { getBusinessTypes, getRegionById, getActiveStates } from '../../../services/common.service';
import { cryptoEncrypt } from '../../../services/crypto.service';
import { deleteDealershipDocument } from '../../../services/dealerships.service';
import { compareObject } from '../../../utils/compareObject.util';


const useStyles = makeStyles(theme => ({
  root: {},
  gridItemStyle: {
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    justifyContent: 'flex-start',
    padding: 0,
    marginTop: 20,
  },
  readOnlyWrapper: {
    margin: '8px 4px',
    maxWidth: '100%',
  },
  icon: {
    marginRight: 4,
    marginTop: 12,
  },
  fileStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  icons: {
    marginRight: 16,
  },
}));




const DealershipInfo = ({ data, className, currentUser }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState();
  const [showUpload, setShowUpload] = useState(false);
  const [fileType, setFileType] = useState('');
  const businessTypes = useQuery('business-types', getBusinessTypes, { cacheTime: 300000 })
  const states = useQuery('state', getActiveStates, { cacheTime: 300000 })
  const { enqueueSnackbar } = useSnackbar();
  const view = permissionCheck(currentUser.role_name, rulesList.dealer_view)

  useEffect(() => {
    setValues(data)
  }, [data])
  const { values, errors, handleChange: onChange, handleSubmit, setFieldValue, setValues } = useFormik({
    initialValues: { ...data },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      name: Yup.string().nullable('Please enter dealership name').required('Please enter Dealership name').matches(/^[aA-zZ.,&/-\s]+$/, 'Only alphabets are allowed for this field ').max(50),
      address: Yup.string().nullable('Please enter address').required('Please enter address'),
      state: Yup.string().nullable('Please choose state').required('Please choose state'),
      district: Yup.string().nullable('Please enter district').required('Please enter district'),
      pincode: Yup.string().nullable('Enter pincode').matches(/^[1-9][0-9]{5}$/, 'Invalid pincode').required('Enter pincode'),
      pan: Yup.string()
        .nullable('Enter PAN')
        .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN')
        .required('Enter PAN')
        .uppercase(),
      gst: Yup.string().nullable('Enter GST').matches(/^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/, 'Invalid GST').required('Enter GST').uppercase(),

    }),
    onSubmit: values => {
      values.name = values.name.toUpperCase();
      values.gst = values.gst.toUpperCase();
      values.pan = values.pan.toUpperCase();
      const date_values = {
        ...values,
        name: values.name.toUpperCase(),
        gst: values.gst?.toUpperCase(),
        pan: values.pan?.toUpperCase()
      };
      let obj = {};
      if (date_values.id) {
        let commonObj = { id: data.id }
        obj = compareObject(data, date_values, commonObj)
      }
      const formData = new FormData();
      Object.keys(obj).forEach(key => {
        if (key === 'pan') {
          let pan = values?.pan ? cryptoEncrypt(values.pan) : values?.pan;
          formData.append(key, pan)
        } else {
          formData.append(key, obj[key]);
        }
      })
      setLoading(true);
      fetch(`${URL.base}${URL.dealership}/${values.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${currentUser.token} `
        }
      })
        .then(res => {
          return res.json()
        })
        .then(({ status, message, data }) => {
          if (status == 'SUCCESS') {
            enqueueSnackbar(message, {
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
            setLoading(false);
            // setReadOnly(true);
          }
          else {
            enqueueSnackbar(message, {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              variant: 'error',
            }
            )
            setLoading(false);
            setReadOnly(true);
          }
        })
        .catch(e => {
          enqueueSnackbar(e.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          }
          )
          setLoading(false);
          setReadOnly(true);
          logger(e);
        })
    }
  });
  const getRegion = useQuery(['region', values?.state], () => getRegionById(parseInt(values?.state || 1)))
  // useEffect(() => {
  //   if (values.state) {
  //     fetchRegions(parseInt(values.state));
  //   }
  // }, [values.state])
  // useMount(() => {
  //   getBusinessTypes()
  //     .then(setBusinessTypes)
  //     .catch(err => {
  //       console.log('BusinessTypes fetch error - ', err)
  //     })
  //   getActiveStates()
  //     .then(d => {
  //       setStates([{ id: '', name: 'Choose State' }, ...d])
  //       return d;
  //     })
  //     .then(d => {
  //       let res = d.find(({ id }) => id === parseInt(values.state));
  //       if (res) {
  //         fetchRegions(parseInt(res.id));
  //       }
  //     })
  //     .catch(err => {
  //       console.log('BusinessTypes fetch error - ', err)
  //     })
  // });

  const docUpload = (val) => {
    setShowUpload(true);
    setFileType(val);
  };
  const onCloseUploader = () => {
    setShowUpload(false);
  };
  const handleSave = (value) => {
    fileType === 'PAN'
      ? setFieldValue('pan_file_url', value[0])
      : setFieldValue('gst_file_url', value[0]);
    // handleSubmit(values);
    onCloseUploader();
  };
  const onDocDelete = (value) => {
    deleteDealershipDocument(value, data.id)
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
      .catch(err => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }
  // const fetchRegions = (res) => {
  //   getRegionById(res)
  //     .then(res => {
  //       setRegionList(res)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }
  const classes = useStyles();
  const gridProps = {
    item: true,
    className: classes.gridItemStyle
  }

  const fieldProps = {
    direction: 'column',
    alignTop: true,
    readOnly,
    onChange
  }
  const gstAttachment = () => {
    return (
      <div className={classes.fileStyle}>
        <Tooltip title={'Click to edit'}>
          <CloudUploadOutlinedIcon
            padding={2}
            style={{ color: grey[800] }}
            className={classes.icons}
            onClick={() => docUpload('GST')}
          />
        </Tooltip>
        <Tooltip title={'Click to delete'}>
          <DeleteIcon
            onClick={() => onDocDelete({ gst_file_url: '' })}
            style={{ color: grey[800] }}
            padding={2}
            className={classes.icons}
          />
        </Tooltip>
      </div>
    );
  };
  const panAttachment = () => {
    return (
      <div className={classes.fileStyle}>
        <Tooltip title={'Click to edit'}>
          <CloudUploadOutlinedIcon
            padding={2}
            className={classes.icons}
            onClick={() => docUpload('PAN')}
          />
        </Tooltip>
        <Tooltip title={'Click to delete'}>
          <DeleteIcon
            onClick={() => onDocDelete({ pan_file_url: '' })}
            style={{ color: grey[800] }}
            padding={2}
          />
        </Tooltip>
      </div>
    );
  };
  return (
    <Card className={clsx(classes.root, className)}>
      <div style={{ marginBottom: 20 }}>
        {
          readOnly ? (
            <>
              <Grid container spacing={2} className={classes.readOnlyWrapper}>
                <Grid md={4}>
                  <ViewData title='Name' value={values?.name} />
                  <ViewData title='Address' value={values?.address ? values.address + '' : '' + (values.pincode ? values.pincode : '')} />
                  <ViewData title='PAN' value={values?.pan} />
                </Grid>
                <Grid md={4}>
                  <ViewData title='State' value={(states.data?.find(function (state, index) {
                    if (state.id == values.state)
                      return true;
                  }))?.name} />
                  <ViewData title='GST' value={values.gst} />
                </Grid>
                <Grid md={4}>
                  <ViewData title='Business type' value={businessTypes.data?.find(function (type, index) {
                    if (type.id == values.business_type)
                      return true;
                  })?.name} />
                  <ViewData title='Region' value={values.region_name} />
                </Grid>
              </Grid>
              {
                values?.pan_file_url ||
                  values?.gst_file_url ? (
                    <div className={classes.readOnlyWrapper}>
                      <Typography variant='h4'>Attachments</Typography>
                      <div style={{ marginTop: 16, display: 'flex' }}>
                        {values.pan_file_url && (
                          <AvatarCard
                            tooltip='View PAN'
                            file={values?.pan_file_url}
                            title='PAN'
                          />
                        )}
                        {values.gst_file_url && (
                          <AvatarCard
                            tooltip='View GST'
                            file={values?.gst_file_url}
                            title='GST'
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={classes.readOnlyWrapper}>
                      <Typography variant='h4'>Attachments</Typography>
                      <div
                        style={{
                          marginTop: '20px',
                        }}
                      >
                        <Typography variant='h7'>No Attachments Found</Typography>
                      </div>
                    </div>
                  )}
            </>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid {...gridProps} md={12}>
                  <TextInput
                    labelText="Name"
                    name="name"
                    readOnly={readOnly}
                    value={values.name?.toUpperCase()}
                    error={errors.name}
                    helperText={errors.name}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    multiline
                    labelText="Address"
                    name="address"
                    readOnly={readOnly}
                    disabled={readOnly}
                    value={values?.address}
                    error={errors.address}
                    helperText={errors.address}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    select
                    labelText="Business Type"
                    name="business_type"
                    readOnly={readOnly}
                    disabled={readOnly}
                    defaultValue={values?.business_type}
                    error={errors.business_type}
                    helperText={errors.business_typeF}
                    {...fieldProps}
                  >
                    {/* <option value="">{businessTypes[values.business_type]?.name}</option> */}
                    {
                      businessTypes.data?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                    }
                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={4}>
                  <TextInput
                    labelText="GST"
                    name="gst"
                    readOnly={readOnly}
                    // disabled={readOnly}
                    // defaultValue={values?.gst?.toUpperCase()}
                    value={values?.gst?.toUpperCase()}
                    error={errors.gst}
                    helperText={errors.gst}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={2}>
                  {values.gst ? (
                    <Grid item md={6}>
                      <>
                        {data.gst_file_url ? (
                          gstAttachment()
                        ) : (
                          <div
                            className={classes.fileStyle}
                            onClick={() => docUpload('GST')}
                          >
                            <Tooltip title={'Click and attach'}>
                              <>
                                <CloudUploadOutlinedIcon
                                  padding={2}
                                  className={classes.icons}
                                  disabled={readOnly}
                                />
                                {/* <Typography className={classes.typography}>Attach GST</Typography> */}
                              </>
                            </Tooltip>
                          </div>
                        )}
                      </>
                    </Grid>
                  ) : null}

                </Grid>
                <Grid {...gridProps} md={4}>
                  <TextInput
                    labelText="PAN"
                    name="pan"
                    readOnly={readOnly}
                    // disabled={readOnly}
                    // defaultValue={values.pan?.toUpperCase()}
                    value={values?.pan?.toUpperCase()}
                    error={errors.pan}
                    helperText={errors.pan}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={2}>
                  {values.pan ? (
                    <Grid item md={2}>
                      <>
                        {
                          data.pan_file_url ? (
                            panAttachment()
                          ) : (
                            <div
                              className={classes.fileStyle}
                              onClick={() => docUpload('PAN')}
                            >
                              <Tooltip title={'Click and attach'}>
                                <>
                                  <CloudUploadOutlinedIcon
                                    padding={2}
                                    style={{ color: grey[800] }}
                                    className={classes.icons}
                                    disabled={readOnly}
                                  />
                                </>
                              </Tooltip>
                            </div>
                          )
                        }
                      </>
                    </Grid>
                  ) : null}
                </Grid>
                {/* <Divider /> */}
                <Grid {...gridProps} sm={6} md={6}>
                  <TextInput
                    select
                    labelText="State"
                    name="state"
                    readOnly={readOnly}
                    disabled={readOnly}
                    value={values?.state}
                    error={errors.state}
                    helperText={errors.state}
                    {...fieldProps}
                  >
                    {
                      states.data?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                    }
                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={6}>
                  {
                    <TextInput
                      select
                      labelText="Region"
                      name="region"
                      value={values?.region}
                      readOnly={readOnly}
                      disabled={readOnly}
                      error={errors.region}
                      helperText={errors.region}
                      {...fieldProps}
                    >
                      {
                        getRegion?.data?.map((item, i) => (<option key={i} value={item.id}>{item.name}</option>))
                      }
                    </TextInput>
                  }

                </Grid>
                <Grid {...gridProps} xs={6}>
                  <TextInput
                    name="district"
                    labelText="District"
                    labelWidth={40}
                    value={values?.district}
                    readOnly={readOnly}
                    disabled={readOnly}
                    error={errors.district}
                    helperText={errors.district}
                    // select
                    alignTop
                    direction="column"
                    {...fieldProps}
                  >

                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    number
                    labelText="Pincode"
                    name="pincode"
                    readOnly={readOnly}
                    value={values?.pincode}
                    error={errors.pincode}
                    helperText={errors.pincode}
                    {...fieldProps}
                  />
                </Grid>
              </Grid>
            </>
          )
        }
        {/* <Divider /> */}

        {showUpload && (
          <FileUpload
            handleSave={(value) => handleSave(value)}
            id={values.id}
            title='Upload Dealership Documents'
            open={showUpload}
            onCloseUploader={onCloseUploader}
          />
        )}
        <CardActions className={classes.actionFooter}>
          {/* <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={toggleCreditReport}
          >
            View/Edit Financial Report
          </Button> */}
          {!readOnly ? (
            !loading ? (
              <>
                <Button variant="contained" size="small" onClick={() => { setReadOnly(true); }}>Cancel</Button>
                <Button type="submit" color="primary" onClick={handleSubmit} variant="contained" size="small">Save</Button>
              </>
            ) : <CircularProgress size={20} />
          ) : (
            <Button
              disabled={!permissionCheck(currentUser.role_name, rulesList.dealership_edit)}
              color="primary"
              variant="contained"
              size="small"
              onClick={() => { setReadOnly(false); }}>Edit Details</Button>
          )}
        </CardActions>
      </div >
      {
        !view && 
          <AccountStatement id={values.id} currentUser={currentUser} />
      }
    </Card >
  );
};

export default DealershipInfo;
