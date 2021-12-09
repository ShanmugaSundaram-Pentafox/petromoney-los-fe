import { Button, Divider, Grid, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import CheckCircleTwoTone from '@material-ui/icons/CheckCircleTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';
import TextInput from '../../../components/TextInput/TextInput';


const useStyles = makeStyles(() => ({
  sidePanelTitle: {
    // textAlign: 'center',
    padding: '15px 12px',
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

const Products = ({title, callback}) => {
  const classes = useStyles()
  const [data, setData] = useState([])
  const [addNewProduct, setAddNewProduct] = useState()
  // console.log(data);

  const { values, errors, handleChange, handleSubmit, setValues } = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {},
    validationSchema: Yup.object().shape({
      product_name: Yup.string().nullable().required('Enter Product Name'),
      roi: Yup.string().nullable().required('Enter Rate of Interest'),
      penal_intrest: Yup.string().nullable().required('Enter Penal Interest'),
      processing_fee: Yup.string().nullable().required('Enter Processing Fee'),
      tenure: Yup.string().nullable().required('Enter Tenure'),
    }),
    onSubmit: values => {
      console.log(values);
    }
  });

  // useMount(() => {
  //     fetch('http://localhost:3334/data')
  //     .then(res => res.json())
  //     .then(setData)
  //     .catch(e => console.log(e))
  // })

  const EditItem = (data) => {
    setValues({...data})
    setAddNewProduct(true)
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
                  <label>Rate of Interest</label>
                  <TextInput
                    number
                    name='roi'
                    value={values.roi}
                    onChange={handleChange}
                    error={errors.roi}
                    helperText={errors.roi}
                  />
                </Grid>
                <Grid item md={6}>
                  <label>Penal Interest</label>
                  <TextInput 
                    number
                    name='penal_interest'
                    value={values.penal_intrest}
                    onChange={handleChange}
                    error={errors.penal_intrest}
                    helperText={errors.penal_intrest}
                  />
                </Grid>
                <Grid item md={6}>
                  <label>Processing Fee</label>
                  <TextInput 
                    number
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
                    number
                    name='tenure'
                    value={values.tenure}
                    onChange={handleChange}
                    error={errors.tenure}
                    helperText={errors.tenure}
                  />
                </Grid>
              </Grid>
              <div style={{display: 'flex', justifyContent:'flex-end', marginTop: 15}}>
                <Button variant="outlined" size="medium" onClick={() => {setAddNewProduct(false); setValues({});}}>Back</Button>
                <Button color="secondary" size="medium" variant="contained" style={{marginLeft: 6}} onClick={handleSubmit}>Save</Button>
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
                    <TableCell>Tenure<br/>(days)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                                        data?.map((item,i) => {
                                          return(
                                            <TableRow className={classes.rowItem} key={i}>
                                              <TableCell>{item.product_name}</TableCell>
                                              <TableCell>{`${item.roi}%`}</TableCell>
                                              <TableCell>{`${item.penal_intrest}%`}</TableCell>
                                              <TableCell>{`${item.processing_fee}%`}</TableCell>
                                              <TableCell>{`${item.tenure}`}</TableCell>
                                              <TableCell>
                                                <IconButton size="small" className={classes.btn}>
                                                  <Tooltip title="Edit">
                                                    <EditIcon fontSize="small" style={{color: 'rgb(0,0,0,0.4)'}} onClick={() => EditItem(item)}/>
                                                  </Tooltip>
                                                </IconButton>
                                                {
                                                  item.is_active === 1 && (
                                                    <IconButton size="small" className={classes.btn}>
                                                      <Tooltip title={ item.app_show !== 0 ? 'Disable on App' : 'Show on App'}>
                                                        <PhoneAndroidIcon fontSize="small" style={item.app_show === 0 ? { color: '#C9CCD5'} : {color: '#93D9A3'}}></PhoneAndroidIcon>
                                                      </Tooltip>
                                                    </IconButton>
                                                  )
                                                }
                                                <IconButton size="small" className={classes.btn}>
                                                  <Tooltip title={item.is_active === 0 ? 'Activate' : 'Deactivate'}>
                                                    <CheckCircleTwoTone style={item.is_active === 0 ? { color: '#C9CCD5'} :{ color: '#93D9A3' }}/>
                                                  </Tooltip>
                                                </IconButton>
                                              </TableCell>
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
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setAddNewProduct(true); }}
              style={{ marginBottom: 12 }}
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
