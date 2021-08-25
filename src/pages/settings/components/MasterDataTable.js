import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, Drawer, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Tooltip } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSnackbar } from 'notistack';

import {
  addOmcs,
  addRegion,
  addState,
  deleteOmcs,
  deleteRegion,
  deleteState,
  updateOmcsById,
  updateRegionById,
  updateStateById,
} from '../../../services/common.service';
import CheckCircleTwoTone from '@material-ui/icons/CheckCircleTwoTone';

const useStyles = makeStyles({
  root: {
    width: '31%',
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    margin: 10,
    maxHeight: 500,
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
    // padding: 15,
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

function Contain({ title, data, label, loading, setStateBtn }) {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [rowData, setRowData] = useState({});
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [status, setStatus] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [AddData, setAddData] = useState({});
  const [openActiveForm, setOpenActiveForm] = useState(false);
  const [openDeactiveForm, setOpenDeactiveForm] = useState(false);
  const [deactivateId, setDeactivateId] = useState();
  const {enqueueSnackbar} = useSnackbar();

  const handleClose = () => {
    setOpenEditForm(false);
    setOpenDeleteForm(false);
    setOpenAddForm(false);
    setOpenActiveForm(false);
    setOpenDeactiveForm(false);
  };

  const filteredData = data.filter((item) =>
    item.name.toUpperCase().includes(value?.toUpperCase())
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
    setAddData({name: event.target.value.toUpperCase()})
  }

  const handleSubmit = () => {
    if (status === 'OMCs') {
      updateOmcsById(rowData, rowData.id)
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
          enqueueSnackbar(err, {
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
          enqueueSnackbar(err, {
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
          enqueueSnackbar(err, {
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
    if(status === 'OMCs'){
      addOmcs(AddData)
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
        enqueueSnackbar(err, {
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
        enqueueSnackbar(err, {
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
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
    }
  }

  const handleDelete = () => {
    if(status === 'OMCs'){
      deleteOmcs(rowData, rowData.id)
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
        enqueueSnackbar(err, {
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
        enqueueSnackbar(err, {
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
        enqueueSnackbar(err, {
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
              setOpenAddForm(true);
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
                        setOpenAddForm(true);
                        setStatus(title)
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
              // console.log(item);
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
            Are you sure want to delete {rowData.name}?
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
          <TextField 
          id='add'
          autoFocus
          variant='outlined'
          placeholder={title}
          fullWidth
          onChange={handleAdd}
          />
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


      {/* <Dialog
      open={openActiveForm}
      onClose={handleClose}
      aria-labelledby='activate'
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent style={{width: 400}}>
          <Typography variant='h7'>
            Activate Form
          </Typography>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={submitAdd}
          >
            BTN
          </Button>
        </DialogActions>
      </Dialog> */}
      
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
