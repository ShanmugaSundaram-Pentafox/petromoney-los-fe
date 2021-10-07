import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, Drawer, TableCell, TableRow, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import TextInput from '../../../components/TextInput/TextInput';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Tooltip } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
  updateAssetById,
  updateBusinessById,
  updateLoanById,
  updateOmcsById,
  updateRegionById,
  updateStateById,
} from '../../../services/common.service';
import CheckCircleTwoTone from '@material-ui/icons/CheckCircleTwoTone';
import { useMount } from 'react-use';

const useStyles = makeStyles({
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

  root: {
    // width: '99%',
    minWidth: 500,
    // width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    margin: 10,
    maxHeight: '94%',
    borderRadius: 5,

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
});

function Contain({ title, data, label, loading, setStateBtn, regionForm, assetForm }) {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [rowData, setRowData] = useState({});
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [status, setStatus] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [AddData, setAddData] = useState();
  const [openActiveForm, setOpenActiveForm] = useState(false);
  const [openDeactiveForm, setOpenDeactiveForm] = useState(false);
  const [deactivateId, setDeactivateId] = useState();
  const [openRegionForm, setOpenRegionForm] = useState();
  const [openAssetForm, setOpenAssetForm] = useState();
  const [addNewRow, setAddNewRow] = useState();
  const [states, setStates] = useState();
  const {enqueueSnackbar} = useSnackbar();

  useMount(() => {
    getActiveStates()
      .then(setStates)
      .catch((e) => {
        console.log(e)
      })
  })

  const handleClose = () => {
    setOpenEditForm(false);
    setOpenDeleteForm(false);
    setOpenAddForm(false);
    setOpenActiveForm(false);
    setOpenDeactiveForm(false);
    setOpenRegionForm(false);
    setOpenAssetForm(false);
  };

  const filteredData = data?.filter((item) =>
    item.name?.toUpperCase().includes(value?.toUpperCase())
  );
  const editItem = (item, title) => {
    setRowData(item);
    setStatus(title);
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

  const handleAdd = (event) => {
    setAddData({...AddData, name: event.target.value.toUpperCase()})
  }

  const handleStateAdd = (event) => {
    setAddData({...AddData, state_id: parseInt(event.target.value)})
  }

  const handleSubmit = () => {
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
      updateAssetById(rowData, rowData.asset_id)
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
        addAssetType(AddData)
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
      deleteLoan(rowData, rowData.id)
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
      <Paper className={classes.root}>
        <div className={classes.title}>
          <Typography variant='h5' style={{ marginLeft: 5 }}>
            {title}
          </Typography>
          <Tooltip title={'Add ' + title}>
            <Button variant='contained' color='primary' onClick={() => {
              !regionForm && !assetForm? setOpenAddForm(true) : !assetForm? setOpenRegionForm(true) : setOpenAssetForm(true)
              setStatus(title)
            }}>
              ADD
            </Button>
          </Tooltip>
        </div>
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
                        <Tooltip title='Edit'>
                          <IconButton
                            className={classes.btn}
                            size='small'
                            onClick={() => {
                              setOpenEditForm(true);
                              editItem(item, title);
                            }}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        {
                        setStateBtn ? (
                          item.is_active ? (
                            <>
                            <Tooltip title='Delete'>
                          <IconButton className={classes.btn} size='small' onClick={() => {
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
                          setOpenRegionForm(true)
                          setStatus(title)
                        } else {
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
                            setOpenEditForm(true);
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
      <Dialog open={openEditForm} onClose={handleClose} aria-labelledby='edit'>
        <DialogTitle>Edit {title} Form</DialogTitle>
        <DialogContent style={{width: 400}}>
          <TextField
            id='edit'
            autoFocus
            fullWidth
            variant='outlined'
            label={title}
            value={rowData.name}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Edit</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteForm}
        onClose={handleClose}
        aria-labelledby='delete'
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent style={{width: 400}}>
          <Typography variant='h7'>
            Are you sure want to delete <strong>{rowData.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleDelete}
            style={{ color: '#FF4848' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
      open={openAddForm}
      onClose={handleClose}
      aria-labelledby='add'
      >
        <DialogTitle>Add {title}</DialogTitle>
        <DialogContent style={{width: 400}}>
          <Grid item md={12}>
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
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={submitAdd}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAssetForm}
        onClose={handleClose}
      >
        <DialogTitle>New {title}</DialogTitle>
        <DialogContent style={{width: 400}}>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <label>{title}</label>
              <TextField 
                id='add'
                autoFocus
                // style={{ marginTop: 8 }}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item md={5}>
              <label>Label</label>
              <TextField 
                // id='add'
                autoFocus
                // style={{ marginTop: 8 }}
                variant='outlined'
              />
            </Grid>
            <Grid item md={5}>
              <label>Type</label>
              <TextInput
                select
                // id='add'
                autoFocus
                // style={{ marginTop: 8 }}
                variant='outlined'
              >
                <option key={1} value='string'>String</option>
                <option key={2} value='number'>Number</option>
              </TextInput>
            </Grid>
            <Grid item md={2} style={{display: 'flex', alignItems: 'center'}}>
              <Button variant='outlined' size='small' onClick={() => setAddNewRow(true)}>+</Button>
            </Grid>
            {
              addNewRow && (
                <TableRow key={"new-row"}>
                  <TableCell scope="row" component="th">
                  </TableCell>
                </TableRow>
              )
            }
          </Grid>
        </DialogContent>
      </Dialog>
      
      <Dialog
      open={openRegionForm}
      onClose={handleClose}
      aria-labelledby='add'
      >
        <DialogTitle>Add {title}</DialogTitle>
        <DialogContent style={{width: 400, display: 'flex', alignItems: 'center' ,justifyContent: 'space-around'}}>
          <Grid container spacing={2}>
            <Grid item md={6}>
            <label style={{ marginBottom: 8 }}>States</label>
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
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={submitAdd}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
      open={openDeactiveForm}
      onClose={handleClose}
      aria-labelledby='activate'
      >
        <DialogTitle>Deactivate {title}</DialogTitle>
        <DialogContent style={{width: 400}}>
          <Typography variant='h7'>
            Do you want to disable this state
          </Typography>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
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

            }}
            style={{ color: '#FF4848' }}
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Contain;
