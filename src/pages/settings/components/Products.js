import { Button, Divider, Grid, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import CheckCircleTwoTone from '@material-ui/icons/CheckCircleTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import * as Yup from 'yup';
import TextInput from '../../../components/TextInput/TextInput';
import { action_id, resources_id } from '../../../config/accessControl';
import { getProductsMaster, updateProductbyId, insertNewProduct, getEntities } from '../../../services/common.service';
import { isAllowed } from '../../../utils/cerbos';
import CheckAllowed from '../../rbac/CheckAllowed';


const useStyles = makeStyles(() => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '10px 12px',
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
    width: '45vw'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
    //   backgroundColor: '#f6f6f6',
  },
  stepperRoot: {
    padding: 11,
    paddingTop: 15
  },
  card: {
    borderRadius: 4,
    // margin: 8,
    padding: 15,
    cursor: 'pointer',
    border: '1px solid #ccc',
    transition: '.2s',
    '&:hover': {
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px'
    }
  },
  actionFoot: {
    // marginBottom: 16,
    marginTop: 12,
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  rowItem: {
    '&:hover': {
      backgroundColor: '#EEEEEE',
      '& $btn': {
        visibility: 'visible',
      },
    },
  },
  btn: {
    visibility: 'hidden',
    color: '#687980',
  },
}))

const Products = ({ title, callback, currentUser }) => {
  const classes = useStyles()
  const queryClient = useQueryClient()
  const [addNewProduct, setAddNewProduct] = useState()
  const [action, setAction] = useState()
  const { enqueueSnackbar } = useSnackbar();

  const { data: products = [] } = useQuery(['products'], () => getProductsMaster())
  const { data: entities = [] } = useQuery(['entities'], () => getEntities(),
    {
      select: (data) => {
        const result = data?.map((i) => ({
          value: i?.id,
          label: i?.entity_name,
          ...i,
        }));
        return result;
      }
    })

  const { mutate: updateProduct, mutate: addProduct } = useMutation(data => action === 'update' ? updateProductbyId(data.product_id, data) : insertNewProduct(data), {
    onSuccess: (message) => {
      queryClient.invalidateQueries(['products'])
      setAddNewProduct(false);
      setValues({});
      setAction()
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    },
    onError: (message) => {
      console.log(message);
      setAction()
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
  })

  const activate = (id, data) => {
    updateProductbyId(id, data)
      .then(res => {
        queryClient.invalidateQueries(['products'])
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch(e => {
        console.log(e)
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })
  }

  const { values, errors, handleChange, handleSubmit, setValues, setFieldValue } = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {},
    validationSchema: Yup.object().shape({
      product_name: Yup.string().nullable().required('Enter Product Name'),
      interest: Yup.number().nullable().required('Enter Rate of Interest').max(100, 'ROI Should be less than 100%'),
      penal_interest: Yup.number().nullable().required('Enter Penal Interest').max(100, 'Penal Interest Should be less than 100%'),
      product_type_id: Yup.number().nullable().required('Select Entity'),
      processing_fee: Yup.number().nullable().required('Enter Processing Fee').max(50, 'Processing Fee Should be less than 50%'),
      tenure: Yup.number().nullable().required('Enter Tenure').max(365, 'Tenure Should be less than 365 days'),
    }),
    onSubmit: values => {
      let data = { ...values, roi: values.interest }
      delete data['interest']
      if (action === 'update') {
        updateProduct(data)
      } else {
        addProduct(data)
      }
    }
  });

  const EditItem = (data) => {
    setValues({ ...data })
    setAction('update')
    setAddNewProduct(true)
  }

  const handleActive = (i, id) => {
    const activeData = i === 0 ? '1' : '0';
    if (activeData === '0') {
      const data = { is_active: activeData, is_show: '0' }
      activate(id, data)
    } else {
      const data = { is_active: activeData }
      activate(id, data)
    }
  }

  const handleShow = (i, id) => {
    const data = { is_show: i === 0 ? '1' : '0' }
    activate(id, data)
  }

  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>{title}</div>
        <IconButton size="small">
          <CloseIcon onClick={() => callback(false)} />
        </IconButton>
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        {
          addNewProduct ? (
            <div className={classes.stepperRoot}>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <label>Product Name</label>
                  <TextInput
                    name='product_name'
                    value={values.product_name}
                    onChange={handleChange}
                    error={errors.product_name}
                    helperText={errors.product_name}
                  />
                </Grid>
                <Grid item md={6}>
                  <div>
                    <label>Entity Type</label>
                    <Select
                      name='product_type_id'
                      styles={{ control: (provider) => ({ ...provider, height: '20px' }) }}
                      value={entities?.find((i => i?.id == values?.product_type_id))}
                      options={entities}
                      onChange={(e) => setFieldValue('product_type_id', e?.id)}
                      error={errors.product_type_id}
                    />
                    {errors.product_type_id ? <div style={{ fontSize: 12, color: 'red' }}>{errors.product_type_id}</div> : null}
                  </div>
                </Grid>
                <Grid item md={6}>
                  <label>Rate of Interest</label>
                  <TextInput
                    type="number"
                    name='interest'
                    value={values.interest}
                    onChange={handleChange}
                    error={errors.interest}
                    helperText={errors.interest}
                  />
                </Grid>
                <Grid item md={6}>
                  <label>Penal Interest</label>
                  <TextInput
                    type="number"
                    name='penal_interest'
                    value={values.penal_interest}
                    onChange={handleChange}
                    error={errors.penal_interest}
                    helperText={errors.penal_interest}
                  />
                </Grid>
                <Grid item md={6}>
                  <label>Processing Fee</label>
                  <TextInput
                    type="number"
                    name='processing_fee'
                    value={values.processing_fee}
                    onChange={handleChange}
                    error={errors.processing_fee}
                    helperText={errors.processing_fee}
                  />
                </Grid>
                <Grid item md={6}>
                  <label>Tenure</label>
                  <TextInput
                    type="number"
                    name='tenure'
                    value={values.tenure}
                    onChange={handleChange}
                    error={errors.tenure}
                    helperText={errors.tenure}
                  />
                </Grid>
              </Grid>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button variant="outlined" size="medium" onClick={() => { setAddNewProduct(false); setValues({}); }}>Back</Button>
                <Button color="secondary" size="medium" variant="contained" style={{ marginLeft: 6 }} onClick={handleSubmit}>Save</Button>
              </div>
            </div>
          ) : (
            <div className={classes.stepperRoot}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Rate of Interest</TableCell>
                    <TableCell>Penal Interest</TableCell>
                    <TableCell>Processing Fee</TableCell>
                    <TableCell>Tenure<br />(days)</TableCell>
                    {
                      isAllowed(currentUser?.permissions, resources_id.settings, action_id.settings.productsUpdate) &&
                      <TableCell align="center">Actions</TableCell>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    products?.map((item, i) => {
                      return (
                        <TableRow className={classes.rowItem} key={i}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{`${item.interest}%`}</TableCell>
                          <TableCell>{`${item.penal_interest}%`}</TableCell>
                          <TableCell>{`${item.processing_fee}%`}</TableCell>
                          <TableCell>{`${item.tenure}`}</TableCell>
                          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.productsUpdate}>
                            <TableCell>
                              <IconButton size="small" className={classes.btn}>
                                <Tooltip title="Edit">
                                  <EditIcon fontSize="small" style={{ color: 'rgb(0,0,0,0.4)' }} onClick={() => EditItem(item)} />
                                </Tooltip>
                              </IconButton>
                              {
                                item.is_active === 1 && (
                                  <IconButton size="small" className={classes.btn} onClick={() => handleShow(item.is_show, item.product_id)} >
                                    <Tooltip title={item.is_show !== 0 ? 'Disable on App' : 'Show on App'}>
                                      <PhoneAndroidIcon fontSize="small" style={item.is_show === 0 ? { color: '#C9CCD5' } : { color: '#93D9A3' }}></PhoneAndroidIcon>
                                    </Tooltip>
                                  </IconButton>
                                )
                              }
                              <IconButton size="small" className={classes.btn} onClick={() => {
                                handleActive(item.is_active, item.product_id);
                              }}>
                                <Tooltip title={item.is_active === 0 ? 'Activate' : 'Deactivate'}>
                                  <CheckCircleTwoTone style={item.is_active === 0 ? { color: '#C9CCD5' } : { color: '#93D9A3' }} />
                                </Tooltip>
                              </IconButton>
                            </TableCell>
                          </CheckAllowed>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </div>
          )
        }
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRoundedIcon />}
              onClick={() => callback(false)}
            >
              Back
            </Button>
          </div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.productsAdd}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => { setAddNewProduct(true); }}
              style={{ marginBottom: 12 }}
            >
              Add Product
            </Button>
          </CheckAllowed>
        </div>
      </div>
    </div >
  )
}

export default Products
