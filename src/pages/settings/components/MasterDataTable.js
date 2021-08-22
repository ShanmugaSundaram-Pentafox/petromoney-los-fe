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
import { Snackbar } from '@material-ui/core';
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
import { useSnackbar } from 'notistack';

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

function Contain({ title, data, label }) {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [openEditForm, setOpenEditForm] = useState(false);
  const [rowData, setRowData] = useState({});
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [status, setStatus] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [AddData, setAddData] = useState({});
  const enqueueSnackbar = useSnackbar();
  // console.log(rowData);
  // console.log(value);
  const handleClose = () => {
    setOpenEditForm(false);
    setOpenDeleteForm(false);
    setOpenAddForm(false);
  };

  const filteredData = data.filter((item) =>
    item.name.toUpperCase().includes(value?.toUpperCase())
  );
  const testing = (item, title) => {
    setRowData(item);
    setStatus(title);
  };

  const testDelete = (item, title) => {
    setRowData(item);
    setStatus(title);
  };

  // const testingAdd = (item, title) => {
    
  // }

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
          console.log(res);
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (status === 'Region') {
      updateRegionById(rowData, rowData.region)
        .then((res) => {
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (status === 'State') {
      updateStateById(rowData, rowData.id)
        .then((res) => {
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const submitAdd = () => {
    if(status === 'OMCs'){
      addOmcs(AddData)
      .then((res) => {
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      })
    }
    if(status === 'Region'){
      addRegion(AddData)
      .then((res) => {
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      })
    }
    if(status === 'State'){
      addState(AddData)
      .then((res) => {
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  const handleDelete = () => {
    if(status === 'OMCs'){
      deleteOmcs(rowData, rowData.id)
      .then((res) => {
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    if(status === 'Region'){
      deleteRegion(rowData, rowData.region)
      .then((res) => {
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    if(status === 'State'){
      deleteState(rowData, rowData.id)
      .then((res) => {
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
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
                              testing(item, title);
                            }}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton className={classes.btn} size='small' onClick={() => {
                            setOpenDeleteForm(true);
                            testDelete(item, title);
                          }}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
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
                            testing(item, title);
                          }}
                        >
                          <EditIcon fontSize='small' className={classes.edt} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton
                          className={classes.btn}
                          size='small'
                          onClick={() => {
                            setOpenDeleteForm(true);
                            testDelete(item, title);
                          }}
                        >
                          <DeleteIcon
                            fontSize='small'
                            className={classes.del}
                          />
                        </IconButton>
                      </Tooltip>
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
        <DialogContent>
          <TextField
            id='edit'
            autoFocus
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
        <DialogContent>
          <Typography variant='h6'>
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
        <DialogContent>
          <TextField 
          id='add'
          autoFocus
          variant='outlined'
          placeholder={title}
          onChange={handleAdd}
          // value={AddData}
          />
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={submitAdd}
            style={{ color: '#50CB93' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Contain;
