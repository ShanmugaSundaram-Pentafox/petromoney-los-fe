import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import TextInput from '../../../components/TextInput/TextInput';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Tooltip } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import {
  addAssetType,
  addBusinessType,
  addLoanType,
  addOmcs,
  addRegion,
  addState,
  deleteAsset,
  deleteBusiness,
  deleteLoan,
  deleteOmcs,
  deleteRegion,
  deleteState,
  getActiveStates,
  getAllRegion,
  getAssetType,
  getBusinessTypes,
  getLoanTypes,
  getOmcList,
  getStates,
  updateAssetById,
  updateBusinessById,
  updateLoanById,
  updateOmcsById,
  updateRegionById,
  updateStateById,
} from '../../../services/common.service';
import CheckCircleTwoTone from '@material-ui/icons/CheckCircleTwoTone';
import { useMount } from 'react-use';

const useStyles = makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      backgroundColor: '#fff',
      width: '16px',
    },
    '*::-webkit-scrollbar-track': {
      backgroundColor: '#fff'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#babac0',
      borderRadius: '16px',
      border: '4px solid #fff'
    }
  },
  sidePanelTitle: {
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333',
  },
  root: {
    minWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    margin: 10,
    height: '80%',
    borderRadius: 5,
    overflow: 'hidden'

  },
  rooting: {
    position: 'absolute',
  },
  backdrop: {
    position: 'absolute',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    position: 'sticky',
  },
  section: {
    marginTop: 10,
    overflowY: 'auto',
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 6,
    alignItems: 'center',
    '&:hover': {
      backgroundColor: '#EEEEEE',
      '& $btn': {
        visibility: 'visible',
      },
    },
  },
  divider: {
    backgroundColor: '#EEEEEE',
  },
  drawer: {
    position: 'absolute',
  },
  btn: {
    visibility: 'hidden',
    color: '#687980',
  },
  nodata: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 380,
    alignItems: 'center',
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
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  addForm: {
    margin: 10,
    padding: 25,
    borderRadius: 6,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
  formFooter :{
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  listBtn: {
    marginTop: 18,
  },

  btns: {
    width: 25,
    marginLeft: 10,
    backgroundColor: 'white',
    border: '1px solid #C8C6C6',
    borderRadius: 2,
    cursor: 'pointer',
    fontSize: '1rem',
    '&:hover': {
      border: '1px solid #212121'
    }
  },

  deleteBtn: {
    width: 25,
    marginLeft: 10,
    backgroundColor: 'white',
    border: '1px solid #FF7878',
    borderRadius: 2,
    cursor: 'pointer',
    color: '#FF5C58',
    fontSize: '1rem',
    '&:hover': {
      border: '1px solid #FF5C58'
    }
  },

}));

function Contain({ title, setStateBtn, regionForm, assetForm, callback }) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [value, setValue] = useState();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [rowData, setRowData] = useState();
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [status, setStatus] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [AddData, setAddData] = useState();
  const [openDeactiveForm, setOpenDeactiveForm] = useState(false);
  const [deactivateId, setDeactivateId] = useState();
  const [openRegionForm, setOpenRegionForm] = useState(false);
  const [openAssetForm, setOpenAssetForm] = useState(false);
  const [assetValue, setAssetValue] = useState([{label: "", type: ""}]);
  const [states, setStates] = useState();
  const {enqueueSnackbar} = useSnackbar();

  useMount(() => {  
    if(title === 'OMCs'){
        getOmcList()
        .then(setData)
        .catch((e) => {
          console.log(e)
        });
      } else if(title === 'Region'){
        getAllRegion()
        .then(setData)
        .catch((e) => {
          console.log(e)
        });
        getActiveStates()
        .then(setStates)
        .catch((e) => {
          console.log(e)
        })
      } else if(title === 'State'){
        getStates()
        .then(setData)
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
      } else if(title === 'Business Type'){
        getBusinessTypes()
        .then(setData) 
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
      } else if(title === 'Loan Type'){
        getLoanTypes()
        .then(setData) 
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
      } else if(title === 'Asset Type'){
        getAssetType()
        .then(setData) 
        .catch((e) => {
          console.log(e)
          // setLoading(false)
        });
      }
  })


  const handleClose = () => {
    setOpenEditForm(false);
    setOpenDeleteForm(false);
    setOpenAddForm(false);
    setOpenDeactiveForm(false);
    setOpenRegionForm(false);
    setOpenAssetForm(false);
  };

  const handleStateDeactivate = () => {
    const test = {is_active: 0}
    updateStateById(test, deactivateId)
      .then((res) => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
    }

  const filteredData = data?.filter((item) =>
    item.name?.toUpperCase().includes(value?.toUpperCase())
  );
  const editItem = (item, title) => {
      setRowData(item);
      setStatus(title);
      title === 'Asset Type' && setAssetValue(JSON.parse(item.details))
  };

  const deleteItem = (item, title) => {
    setRowData(item);
    setStatus(title);
  };

  const DeactivateItem = (id) => {
    setDeactivateId(id);
  }

  const handleChange = (event) => {
    setRowData({
      ...rowData,
      name: event.target.value.toUpperCase(),
    });
  };

  const handleInputChange = (e, index) => {
    const {id, value} = e.target;
    const list = [...assetValue];
    list[index][id] = value;
    setAssetValue(list)
  }

  const handleRemoveClick = index => {
    // console.log(index);
    const list = [...assetValue]
    list.splice(index, 1)
    setAssetValue(list)
  }

  const handleAddClick = () => {
    setAssetValue([...assetValue, { label: "", type: "" }]);
  }

  const handleAdd = (event) => {
    setAddData({...AddData, name: event.target.value.toUpperCase()})
  }

  const handleStateAdd = (event) => {
    setAddData({...AddData, state_id: parseInt(event.target.value)})
  }

  const handleSubmit = () => {
    console.log('updating...');
    if (status === 'OMCs') {
      updateOmcsById(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'Region') {
      updateRegionById(rowData, rowData.region)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    if (status === 'State') {
      updateStateById(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    
    if (status === 'Business Type') {
      updateBusinessById(rowData, rowData.id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }

    if (status === 'Asset Type') {
      const AssetUpdateData = {name: rowData?.name , details: assetValue}
      updateAssetById(AssetUpdateData, rowData.asset_id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
    
    if (status === 'Loan Type') {
      updateLoanById(rowData, rowData.loan_id)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        });
    }
  };

  const submitAdd = () => {
    console.log('adding...');
    if(AddData){
      if(status === 'OMCs'){
        addOmcs(AddData)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {  
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
      }
      if(status === 'Region'){
        addRegion(AddData)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
      }
      if(status === 'State'){
        addState(AddData)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
      }
      if(status === 'Business Type'){
        addBusinessType(AddData)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
      }

      if(status === 'Loan Type'){
        addLoanType(AddData)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
      }
      
      if(status === 'Asset Type'){
        const assetData = {name: AddData.name, details: assetValue}
        addAssetType(assetData)
        .then((res) => {
          handleClose()
          enqueueSnackbar(res, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Something went wrong, Please try Again!', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
      }
    }
  }

  const handleDelete = () => {
    if(status === 'OMCs'){
      deleteOmcs(rowData, rowData.id)
      .then((res) => {
        handleClose()
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      });
    }
    if(status === 'Region'){
      deleteRegion(rowData, rowData.region)
      .then((res) => {
        handleClose()
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      });
    }
    if(status === 'State'){
      deleteState(rowData, rowData.id)
      .then((res) => {
        handleClose()
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      });
    }
    if(status === 'Asset Type'){
      deleteAsset(rowData, rowData.asset_id)
      .then((res) => {
        handleClose()
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      });
    }
    if(status === 'Loan Type'){
      deleteLoan(rowData, rowData.loan_id)
      .then((res) => {
        handleClose()
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      });
    }
    if(status === 'Business Type'){
      deleteBusiness(rowData, rowData.id)
      .then((res) => {
        handleClose()
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      });
    }
  }

  return (
    <>
      <Typography className={classes.sidePanelTitle} variant='h4'>
        <div>{title}</div>
        <CloseIcon onClick={callback} />
      </Typography>
      <Paper className={classes.root}>
        <form className={classes.search} noValidate autoComplete='off'>
          <TextField
            id='search'
            variant='outlined'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
            margin='normal'
            fullWidth
            style={{ marginTop: 10 }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </form>
        <div className={classes.section}>
          {value ? (
            filteredData.length > 0 ? (
              filteredData.map((item, i) => {
                return (
                  <>
                    <div className={classes.label}>
                      <Typography variant='h7' style={{ paddingLeft: 18 }}>
                        {item.name}
                      </Typography>
                      <div>
                        {
                        setStateBtn ? (
                          item.is_active ? (
                            <>
                            <Tooltip title='Delete'>
                          <IconButton className={classes.btn} size='small' onClick={() => {
                            handleClose()
                            setOpenDeleteForm(true);
                            deleteItem(item, title);
                          }}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                            <Tooltip title='Deactivate'>
                              <IconButton
                                className={classes.btn}
                                size='small'
                                onClick={() => {
                                  handleClose()
                                  setOpenDeactiveForm(true);
                                  DeactivateItem(item.id)
                                }}
                              >
                                <CheckCircleTwoTone style={{ color: '#93D9A3' }}/>
                              </IconButton>
                            </Tooltip>
                            </>
                          ) : (
                            <>
                            <Tooltip title='Delete'>
                          <IconButton className={classes.btn} size='small' onClick={() => {
                            handleClose()
                            setOpenDeleteForm(true);
                            deleteItem(item, title);
                          }}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                            <Tooltip title='Activate'>
                              <IconButton
                                className={classes.btn}
                                size='small'
                                onClick={() => {
                                  const test = {is_active: 1}
                                  updateStateById(test, item.id)
                                    .then((res) => {
                                      enqueueSnackbar(res, {
                                        anchorOrigin: {
                                          vertical: 'top',
                                          horizontal: 'right',
                                        },
                                        variant: 'success',
                                      })
                                      setTimeout(() => {
                                        window.location.reload(false);
                                      }, 1500);
                                    })
                                    .catch((err) => {
                                      console.log(err);
                                    });
                                }}
                              >
                                <CheckCircleTwoTone style={{ color: '#C9CCD5' }}/>
                              </IconButton>
                            </Tooltip>
                            </>
                          )
                        ) : (
                          <Tooltip title='Delete'>
                        <IconButton
                          className={classes.btn}
                          size='small'
                          onClick={() => {
                            handleClose()
                            setOpenDeleteForm(true);
                            deleteItem(item, title);
                          }}
                        >
                          <DeleteIcon
                            fontSize='small'
                            className={classes.del}
                          />
                        </IconButton>
                      </Tooltip>
                        )
                      }
                      </div>
                    </div>
                    <Divider className={classes.divider} />
                  </>
                );
              })
            ) : (
              <>
                <div className={classes.nodata}>
                  <Typography variant='h6'>No Data Found</Typography>
                  <div>
                    <Button
                      variant='outlined'
                      size='small'
                      color='primary'
                      style={{ marginTop: 15 }}
                      onClick={() => {
                        if(title === 'Region'){
                          handleClose()
                          setOpenRegionForm(true)
                          setStatus(title)
                        } else {
                          handleClose()
                          setOpenAddForm(true);
                          setStatus(title)
                        }
                      }}
                    >
                      ADD
                    </Button>
                  </div>
                </div>
              </>
            )
          ) : (
            data.map((item) => {
              return (
                <>
                  <div className={classes.label}>
                    <Typography
                      variant='h7'
                      style={{ paddingLeft: 18 }}
                      key={item.id ? item.id : item.region}
                    >
                      {item.name}
                    </Typography>
                    <div>
                      <Tooltip title='Edit'>
                        <IconButton
                          className={classes.btn}
                          size='small'
                          onClick={() => {
                            handleClose()
                            {
                              title === 'Asset Type' ? setOpenAssetForm(true) : setOpenEditForm(true)
                            }
                            editItem(item, title);
                          }}
                        >
                          <EditIcon fontSize='small' className={classes.edt} />
                        </IconButton>
                      </Tooltip>
                      {
                        setStateBtn ? (
                          item.is_active ? (
                            <>
                            <Tooltip title='Delete'>
                          <IconButton className={classes.btn} size='small' onClick={() => {
                            handleClose()
                            setOpenDeleteForm(true);
                            deleteItem(item, title);
                          }}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                            <Tooltip title='Deactivate'>
                              <IconButton
                                className={classes.btn}
                                size='small'
                                onClick={() => {
                                  handleClose()
                                  setOpenDeactiveForm(true);
                                  DeactivateItem(item.id)
                                }}
                              >
                                <CheckCircleTwoTone style={{ color: '#93D9A3' }}/>
                              </IconButton>
                            </Tooltip>
                            </>
                          ) : (
                            <>
                            <Tooltip title='Delete'>
                          <IconButton className={classes.btn} size='small' onClick={() => {
                            handleClose()
                            setOpenDeleteForm(true);
                            deleteItem(item, title);
                          }}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                            <Tooltip title='Activate'>
                              <IconButton
                                className={classes.btn}
                                size='small'
                                onClick={() => {
                                  const test = {is_active: 1}
                                  updateStateById(test, item.id)
                                    .then((res) => {
                                      enqueueSnackbar(res, {
                                        anchorOrigin: {
                                          vertical: 'top',
                                          horizontal: 'right',
                                        },
                                        variant: 'success',
                                      })
                                      setTimeout(() => {
                                        window.location.reload(false);
                                      }, 1500);
                                    })
                                    .catch((err) => {
                                      console.log(err);
                                    });
                                }}
                              >
                                <CheckCircleTwoTone style={{ color: '#C9CCD5' }}/>
                              </IconButton>
                            </Tooltip>
                            </>
                          )
                        ) : (
                          <Tooltip title='Delete'>
                        <IconButton
                          className={classes.btn}
                          size='small'
                          onClick={() => {
                            handleClose()
                            setOpenDeleteForm(true);
                            deleteItem(item, title);
                          }}
                        >
                          <DeleteIcon
                            fontSize='small'
                            className={classes.del}
                          />
                        </IconButton>
                      </Tooltip>
                        )
                      }   
                    </div>
                  </div>
                  <Divider className={classes.divider} />
                </>
              );
            })
          )}
        </div>
      </Paper>
      {
        openAddForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Add {title}</Typography>
            <Grid item md={12} style={{marginTop: 15}}>
              <label>{title}</label>
              <TextField 
                id='add'
                autoFocus
                style={{ marginTop: 8 }}
                variant='outlined'
                fullWidth
                value={AddData?.name}
                onChange={handleAdd}
              />
            </Grid>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 10}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={submitAdd}
                style={{ color: '#1EAE98', borderColor: '#1EAE98'}}
                variant='outlined'
                size='small'
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
      {
        openEditForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Edit {title}</Typography>
            <Grid item md={12} style={{marginTop: 15}}>
              <label style={{marginBottom: 8}}>{title}</label>
              <TextField
                id='edit'
                autoFocus
                fullWidth
                variant='outlined'
                value={rowData.name}
                onChange={handleChange}
              />
            </Grid>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                style={{ color: '#1EAE98', borderColor: '#1EAE98'}}
                variant='outlined'
                size='small'
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
      {
        openDeleteForm && (
          <div className={classes.addForm}>
            <Typography variant='h7'>Are you sure want to delete <strong>{rowData?.name}</strong> ?</Typography>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                style={{ color: '#FF4848', borderColor: '#FF4848'}}
                variant='outlined'
                size='small'
              >
                Delete
              </Button>
            </div>
          </div>
        )
      }
      {
        openDeactiveForm && (
          <div className={classes.addForm}>
            <Typography variant='h7'>Do you want to disable this state ?</Typography>            
          <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={handleStateDeactivate}
                style={{ color: '#FF4848', borderColor: '#FF4848'}}
                variant='outlined'
                size='small'
              >
                Deactivate
              </Button>
            </div>
          </div>
        )
      }
      {
        openRegionForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Add New {title}</Typography>
            <Grid container spacing={2} style={{marginTop: 15}}>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>State</label>
                <TextInput
                select
                name='states'
                variant='outlined'
                onChange={handleStateAdd}
                >
                  {
                    states?.map((item, i) => <option key={i} value={item.id}>{item.name}</option>)
                  }
                </TextInput>
              </Grid>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>{title}</label>
                <TextField 
                id='add'
                style={{width: '100%', marginTop: 4}}
                autoFocus
                variant='outlined'
                onChange={handleAdd}
                />
              </Grid>
            </Grid>
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={submitAdd}
                style={{ color: '#1EAE98', borderColor: '#1EAE98'}}
                variant='outlined'
                size='small'
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
      {
        openAssetForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>Add New {title}</Typography>
            <Grid container spacing={2} style={{marginTop: 15}}>
              <Grid item md={6}>
                <label style={{ marginBottom: 8 }}>Asset Type</label>
                <TextField
                  id='edit'
                  autoFocus
                  fullWidth
                  variant='outlined'
                  value={rowData ? rowData?.name : AddData?.name}
                  onChange={rowData ? handleChange : handleAdd}
                />
              </Grid>
            </Grid>
            {
              assetValue.map((x, i) => {
                return(
                  <Grid container spacing={2} style={{marginTop: 15, display: 'flex', alignItems: 'center'}}>
                    <Grid item md={5}>
                      <label style={{ marginBottom: 8 }}>Label</label>
                      <TextField
                        id='label'
                        fullWidth
                        variant='outlined'
                        value={x?.label}
                        onChange={e => handleInputChange(e, i)}
                      />
                    </Grid>
                    <Grid item md={5}>
                      <label style={{ marginBottom: 8 }}>Type</label>
                      <TextInput
                        select
                        id='type'
                        fullWidth
                        variant='outlined'
                        style={{margin: 0}}
                        value={x?.type}
                        onChange={e => handleInputChange(e, i)}
                      >
                        <option key={0} value=''>Choose Type...</option>
                        <option key={1} value='string'>String</option>
                        <option key={2} value='number'>Number</option>
                      </TextInput>
                    </Grid>
                    <div className={classes.listBtn}>
                      {assetValue.length !== 1 && <button className={classes.deleteBtn} variant='outlined' size='small' onClick={() => handleRemoveClick(i)}><DeleteOutlineIcon style={{fontSize: 'small', marginTop: 5}} /></button>}
                      {assetValue.length - 1 === i && <button className={classes.btns} variant='outlined' size='small' onClick={handleAddClick}>+</button>}
                    </div>
                  </Grid>
                )
              })
            }
            <div className={classes.formFooter}>
              <Button
                onClick={handleClose}
                // style={{marginTop: 15}}
                size='small'
              >
                Cancel
              </Button>
              <Button
                onClick={rowData ? handleSubmit : submitAdd}
                style={{ color: '#1EAE98', borderColor: '#1EAE98'}}
                variant='outlined'
                size='small'
              >
                Save
              </Button>
            </div>
          </div>
        )
      }
      <div className={classes.actionFooter}>
          <Divider />
          <div className={classes.actionButtonsWrapper}>
            <div>
              <Button variant='outlined' onClick={callback}>
                Back
              </Button>
            </div>
            <div>
              <Button
                variant='contained'
                type='submit'
                onClick={() => {
                  handleClose()
                  !regionForm && !assetForm? setOpenAddForm(true) : !assetForm? setOpenRegionForm(true) : setOpenAssetForm(true)
                  setStatus(title)
                }}
                color='primary'
              >
                Add
              </Button>
            </div>
          </div>
        </div>
    </>
  );
}

export default Contain;
