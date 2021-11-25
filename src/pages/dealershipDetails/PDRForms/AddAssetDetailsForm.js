import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import { format } from 'date-fns'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addAssetDetailsById, deleteAssetDetailsById, getAssetDataById, getAssetDetailsById, getAssetList } from '../../../services/PDReport.services';
import Select from 'react-select';
import { useMount } from 'react-use';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import AssetsEditForm, { AssetCard } from './Components/AssetsEditForm';

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
    overflow: 'auto',
    backgroundColor: '#f6f6f6',
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    marginTop: 20,
  },
  btn: {
    margin: 8
  },
  actionFoot: {
    marginBottom: 16,
    marginTop: 12,
  },
  typeField: {
    marginBottom: 20,
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
}))

const AddAssetDetailsForm = ({ data, dealer_id, callback, currentUser }) => {

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [type, setType] = useState("")
  const [loading, setLoading] = useState(false)
  const [editRowData, setEditRowData] = useState({})
  const [editRow, setEditRow] = useState(false);
  const [asset, setAsset] = useState([])
  const [addNewAsset, setAddNewAsset] = useState(false)
  const [assetData, setAssetData] = useState([])
  const [assetList, setAssetList] = useState([])

  useMount(() => {
    getAssetList()
      .then(result => {
        let list = [], d = [];
        result.forEach((item, i) => {
          list.push({
            label: item.name,
            value: item.asset_id
          })
          d.push({
            ...item,
            details: typeof (item.details) === "string" ? JSON.parse(item.details) : (item.details || [])
          })
        })
        setAssetList(list);
        setAssetData(d);
      })
      .catch((e) => {
        console.log(e);
      })
    getAssetDetailsById(dealer_id)
      .then(data => {
        let d = [];
        data.forEach((item, i) => {
          d.push({
            ...item,
            details: typeof (item.details) === "string" ? JSON.parse(item.details) : (item.details || [])
          })
        })
        setAsset(d)
      })
      .catch((e) => {
        console.log(e);
      })

  })

  const handleClose = () => {
    callback();
  };

  let CustomValidation = {};
  if (type.label === 'Car') {
    CustomValidation = {
      address: Yup.string().nullable('Please enter your address').required('Please enter your address'),
      yom: Yup.number().nullable('Please enter year of manufacture').required('Please enter year of manufacture').test('year', 'Invalid Manufacture Year', value => value >= 1900 && value <= format(new Date(), 'yyyy')),
    };
  } else if (type.label === 'Gold') {
    CustomValidation = {
      quantity: Yup.number().nullable('Please enter quantity').required('Please enter quantity'),
    }
  } else if (type.label === 'CV') {
    CustomValidation = {
      model: Yup.number().nullable('Please enter model').required('Please enter model'),
      yom: Yup.number().nullable('Please enter year of manufacture').required('Please enter year of manufacture').test('year', 'Invalid Manufacture Year', value => value >= 1900 && value <= format(new Date(), 'yyyy')),
    }
  } else if (type.label === 'Land') {
    CustomValidation = {
      address: Yup.string().nullable('Please enter your address').required('Please enter your address'),
    }
  } else if (type.label === 'Building') {
    CustomValidation = {
      address: Yup.string().nullable('Please enter your address').required('Please enter your address'),
    }
  }

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      // type: Yup.string().nullable('Please choose type').required('Please choose type'),
      asset_value: Yup.number().nullable('Please enter value').required('Please enter value'),
      market_value: Yup.number().nullable('Please enter value').required('Please enter value'),
      ...CustomValidation
    }),
    onSubmit: values => {
      const { asset_value, market_value, ownership, ownership_proof, relationship } = values
      delete values.asset_value; delete values.market_value; delete values.ownership_proof; delete values.relationship;
      const data = { asset_id: type.value, asset_value, market_value, ownership, ownership_proof, relationship, details: { ...values } }
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      addAssetDetailsById(data, dealer_id)
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
          console.log(e);
        })
    }
  });
  const inputProps = {
    direction: "column",
    alignTop: true,
    onChange: handleChange,
  }
  const editAssetRow = (item, i) => {
    setEditRow(true)
    setEditRowData(item)
  }
  const deleteAssetRow = (item, i) => {
    deleteAssetDetailsById(item, dealer_id)
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
        console.log(e);
      })

  }
  const handleCancel = () => {
    setEditRow(false)
    setAddNewAsset(false)

  }
  return (
    <div className={classes.sidePanelFormWrapper}>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>Add Asset Details</div>
        <CloseIcon onClick={handleClose} />
      </Typography>
      <div className={classes.sidePanelFormContentWrapper}>
        <div className={classes.stepperRoot}>
          <Box>
            <>
              <div>
                {
                  asset.length || addNewAsset ? null :
                    <Typography className={classes.typography}>No asset found,Click 'Add asset' to add new asset.</Typography>
                }
                <div className={classes.typeField}>
                  {
                    addNewAsset && (
                      <Grid container spacing={2}>
                        <Grid item md={6}>
                          <label style={{ marginBottom: 8 }}>Choose asset type to add</label>
                          <Select
                            isClearable
                            name='type'
                            onChange={setType}
                            options={assetList} />
                        </Grid>
                      </Grid>
                    )
                  }
                </div>
                <div>
                  <>
                    {
                      addNewAsset && assetData?.map((data) => {
                        return (
                          <>
                            {
                              data.asset_id === type?.value ? (
                                <Grid container spacing={2}>
                                  {
                                    Array.isArray(data.details) && data.details.map((item, i) => {
                                      return (
                                        <Grid item md={6}>
                                          <TextInput
                                            {...inputProps}
                                            className={classes.number}
                                            inputProps={{ className: classes.input }}
                                            labelText={item.label}
                                            name={item.key}
                                            // value={values.key}
                                            error={errors[item.key]}
                                            helperText={errors[item.key]}
                                            type={item.type}
                                          >
                                          </TextInput>
                                        </Grid>
                                      )
                                    })
                                  }
                                  <Grid item md={6}>
                                    <TextInput
                                      {...inputProps}
                                      number
                                      labelText="Asset Value"
                                      name="asset_value"
                                      value={values.asset_value}
                                      error={errors.asset_value}
                                      helperText={errors.asset_value}
                                    />
                                  </Grid>
                                  <Grid item md={6}>
                                    <TextInput
                                      {...inputProps}
                                      number
                                      labelText="Market value"
                                      name="market_value"
                                      value={values.market_value}
                                      error={errors.market_value}
                                      helperText={errors.market_value}
                                    />
                                  </Grid>
                                  <Grid item md={6}>
                                    <TextInput
                                      {...inputProps}
                                      select
                                      labelText="Ownership"
                                      name="ownership"
                                      value={values.ownership}
                                      error={errors.ownership}
                                      helperText={errors.ownership}
                                    >
                                      <option value="">Choose ownership</option>
                                      <option value="Self owned">Self owned</option>
                                      <option value="Family owned">Family owned</option>
                                      <option value="Partnership">Partnership</option>
                                      {type.label !== "Gold" && <option value="Leased">Leased</option>}
                                    </TextInput>
                                  </Grid>
                                  {/* <Grid item md={6}>
                                    <TextInput
                                      {...inputProps}
                                      labelText="Ownership Proof"
                                      name="ownership_proof"
                                      value={values.ownership_proof}
                                      error={errors.ownership_proof}
                                      helperText={errors.ownership_proof}
                                    />
                                  </Grid> */}
                                </Grid>
                              ) : null
                            }
                          </>
                        )
                      })
                    }
                    {
                      addNewAsset && (
                        <div className={classes.actionFoot}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div>
                              <Button
                                variant="outlined"
                                className={classes.btn}
                                onClick={() => { setAddNewAsset(false); setEditRow(false); setEditRowData({}); setType('') }}
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
                      )
                    }
                  </>
                  <Grid container spacing={2}>
                    {
                      editRow ? (
                        <AssetsEditForm dealer_id={dealer_id} assetData={assetData.find(item => item.asset_id === editRowData.asset_id)} data={editRowData} handleClose={handleCancel} />
                      ) : (
                        !addNewAsset && asset.map((item, i) => {
                          return (
                            <Grid item md={6}>
                              <PreviewCard
                                onEdit={() => { editAssetRow(item, i) }}
                                onDelete={() => deleteAssetRow(item, i)}
                              >
                                <Grid container spacing={2} >
                                  <Grid item md={6}>
                                    <ViewData title="Asset Type" value={item.name} />
                                    <ViewData title="Ownership" value={item.ownership} />
                                    <ViewData title="Market value" value={item.market_value} />
                                    {/* <ViewData title="Relationship" value={item.relationship} /> */}
                                  </Grid>
                                  <Grid item md={6}>
                                    <ViewData title="Asset value" value={item.asset_value} />
                                    <AssetCard id={dealer_id} assetData={assetData.find(d => d.asset_id === item.asset_id)} data={item} />
                                  </Grid>
                                </Grid>
                              </PreviewCard>
                            </Grid>
                          )
                        })
                      )
                    }
                  </Grid>
                </div>
              </div>
            </>
          </Box >
        </div >
      </div >
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
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { setAddNewAsset(true); }}
              style={{ marginBottom: 12 }}
            >
              Add asset
            </Button>
          </div>
        </div>
      </div>
    </div >


  )
}

export default AddAssetDetailsForm;