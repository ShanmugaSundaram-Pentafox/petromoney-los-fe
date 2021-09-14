import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextInput from '../../../components/TextInput/TextInput';
import { useFormik } from 'formik';
import { URL } from '../../../config/serverUrls';
import { logger } from '../../../config/logger';
import CircularProgress from '@material-ui/core/CircularProgress';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
// import apiCall from '../../../utils/api.util';
import Button from '../../../components/CommonComponents/Button/Button';
import UploadIcon from '@material-ui/icons/Backup';
import { encrypt } from '../../../services/crypto.service';
import { getBusinessTypes, getRegionById, getStates, getActiveStates } from '../../../services/common.service';
import { useSnackbar } from 'notistack';
import { AvatarCard, ViewData } from '../../../components/CommonComponents/FilePreview';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import FileUpload from '../../../components/FileUpload';
import moment from 'moment';
import { format } from 'date-fns';
// import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  gridItemStyle: {
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    justifyContent: 'flex-end'
  },
  readOnlyWrapper: {
    margin: '8px 4px',
    maxWidth: '100%',
  },
  fileAttachement: {
    display: 'flex',
    // justifyContent:'center',
    marginTop: 8,
  },
  icon: {
    marginRight: 4,
    marginTop: 12,
  },
}));




const DealershipInfo = ({ data, className, currentUser, toggleCreditReport }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState();
  const [apiStatus, setApiStatus] = useState({});
  const [showUpload, setShowUpload] = useState(false);
  const [fileType, setFileType] = useState('');
  const [businessTypes, setBusinessTypes] = useState([{}, {}, {}, {}, {}]);
  const [states, setStates] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { values, handleChange: onChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: { ...data },
    onSubmit: values => {
      let eDate = format(new Date(values.agreement_executed_on), 'yyyy-MM-dd')
      let vDate = format(new Date(values.agreement_valid_till), 'yyyy-MM-dd')
      const date_values = {
        ...values,
        agreement_valid_till: vDate,
        agreement_executed_on: eDate
      };
      const data = new FormData();
      Object.keys(date_values).forEach(key => {
        data.append(key, date_values[key]);
      })
      setLoading(true);
      fetch(`${URL.base}${URL.dealership}/${values.id}`, {
        method: 'POST',
        body: data,
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
            setLoading(false);
            setReadOnly(true);
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
          enqueueSnackbar(e, {
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
  useMount(() => {
    getBusinessTypes()
      .then(setBusinessTypes)
      .catch(err => {
        console.log('BusinessTypes fetch error - ', err)
      })
    getActiveStates()
      .then(d => {
        setStates([{ id: '', name: 'Choose State' }, ...d])
        return d;
      })
      .then(d => {
        let res = d.find(({ id }) => id === parseInt(values.state));

        if (res) {
          fetchRegions(parseInt(res.id));
        }
      })
      .catch(err => {
        console.log('BusinessTypes fetch error - ', err)
      })

  });
  useEffect(() => {
    if (values.state) {
      fetchRegions(parseInt(values.state));
    }
  }, [values.state])

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
    handleSubmit(values);
    onCloseUploader();
  };

  const fetchRegions = (res) => {
    getRegionById(res)
      .then(res => {
        setRegionList(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const classes = useStyles();
  const gridProps = {
    item: true,
    className: classes.gridItemStyle
  }


  const fieldProps = {
    direction: "column",
    alignTop: true,
    readOnly,
    onChange
  }

  return (
    <Card className={clsx(classes.root, className)}>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        {
          readOnly ? (
            <>
              <Grid container spacing={2} className={classes.readOnlyWrapper}>
                <Grid md={4}>
                  <ViewData title='Name' value={values.name} />
                  <ViewData title='Address' value={values.address + ' - ' + values.pincode} />
                  <ViewData title='PAN' value={values.pan} />
                </Grid>
                <Grid md={4}>
                  <ViewData title='Mobile' value={values.mobile} />
                  <ViewData title='State' value={values.state} />
                  <ViewData title='GST' value={values.gst} />
                </Grid>
                <Grid md={4}>
                  <ViewData title='Business type' value={values.business_type} />
                  <ViewData title='Region' value={values.region} />
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
                    value={values.address?.toUpperCase()}
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
                    defaultValue={businessTypes[values.business_type - 1]?.name}
                    {...fieldProps}
                  >
                    <option value="">{businessTypes[values.business_type]?.name}</option>
                    {
                      businessTypes?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                    }
                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={4}>
                  <TextInput
                    labelText="GST"
                    name="gst"
                    readOnly={readOnly}
                    // disabled={readOnly}
                    defaultValue={values.gst}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={2}>
                  {
                    values.gst && (
                      <div
                        className={classes.fileAttachement}
                        onClick={() => docUpload('PAN')}
                      >
                        <Tooltip title={'Click and attach'}>
                          <>
                            <UploadIcon
                              className={classes.icon}
                              disabled={readOnly}
                            />
                          </>
                        </Tooltip>
                      </div>
                    )
                  }
                </Grid>
                <Grid {...gridProps} md={4}>
                  <TextInput
                    labelText="PAN"
                    name="pan"
                    readOnly={readOnly}
                    // disabled={readOnly}
                    defaultValue={values.pan}
                    {...fieldProps}
                  />
                </Grid>
                <Grid {...gridProps} md={2}>
                  {
                    values.pan && (
                      <div
                        className={classes.fileAttachement}
                        onClick={() => docUpload('PAN')}
                      >
                        <Tooltip title={'Click and attach'}>
                          <>
                            <UploadIcon
                              className={classes.icon}
                              disabled={readOnly}
                            />
                          </>
                        </Tooltip>
                      </div>
                    )
                  }
                </Grid>
                <Divider />
                <Grid {...gridProps} sm={6} md={6}>
                  <TextInput
                    select
                    labelText="State"
                    name="state"
                    readOnly={readOnly}
                    disabled={readOnly}
                    value={values.state}
                    {...fieldProps}
                  >
                    {
                      states.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                    }
                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={6}>
                  {
                    <TextInput
                      select
                      labelText="Region"
                      name="region"
                      value={values.region}
                      readOnly={readOnly}
                      disabled={readOnly}
                      {...fieldProps}
                    >
                      {
                        regionList?.map((item, i) => (<option key={i} value={item.id}>{item.name}</option>))
                      }
                    </TextInput>
                  }

                </Grid>
                <Grid {...gridProps} xs={6}>
                  <TextInput
                    name="district"
                    labelText="District"
                    labelWidth={40}
                    value={values.district}
                    readOnly={readOnly}
                    disabled={readOnly}
                    // select
                    alignTop
                    direction="column"
                    {...fieldProps}
                  >

                  </TextInput>
                </Grid>
                <Grid {...gridProps} md={6}>
                  <TextInput
                    labelText="Pincode"
                    name="pincode"
                    readOnly={readOnly}
                    defaultValue={values.pincode}
                    {...fieldProps}
                  />
                </Grid>
              </Grid>
            </>
          )
        }
        <Divider />

        {showUpload && (
          <FileUpload
            handleSave={(value) => handleSave(value)}
            id={values.id}
            title='Upload Transport Documents'
            open={showUpload}
            onCloseUploader={onCloseUploader}
          />
        )}
        <CardActions className={classes.actionFooter}>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={toggleCreditReport}
          >
            View/Edit Financial Report
          </Button>
          {!readOnly ? (
            !loading ? (
              <>
                <Button variant="contained" size="small" onClick={() => { setReadOnly(true); }}>Cancel</Button>
                <Button type="submit" color="primary" variant="contained" size="small">Save</Button>
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
      </form >
    </Card >
  );
};

export default DealershipInfo;
