import { Button, Divider, Grid, IconButton, makeStyles, TextField, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addApiRoute, updateApiRoute } from '../../services/rbac.service';

const useStyles = makeStyles(() => ({
  sidePanelWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'auto',
  },
  addForm: {
    margin: 10,
    padding: 17,
    position: 'relative',
    borderRadius: 6,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 9,
    margin: '0px 10px',
    borderBottom: '1px solid hsl(0,0%,90%)',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'hsl(0,0%,96%)',
      '& $btn': {
        visibility: 'visible',
      },
    },
  },
  listWrapper: {
    overflow: 'auto'
  },
  btn: {
    visibility: 'hidden',
    color: '#687980',
  },
  titleWrapper: {
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  }
}))

const RouteGroup = ({ data, setAddForm }) => {
  const classes = useStyles()

  return (
    <div className={classes.label}>
      <Typography variant="body1" style={{ paddingLeft: 10 }}>{data?.route}</Typography>
      <Tooltip title='Edit'>
        <IconButton size='small' className={classes.btn} onClick={() => setAddForm({ action: 'Edit', route: data.route, resource_id: data?.resource_id, route_id: data.id })}>
          <EditIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </div>
  )
}


const AddRouteForm = ({ data, callback }) => {
  const [addForm, setAddForm] = useState()
  const classes = useStyles()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: addRoute } = useMutation(data => addForm.route_id ? updateApiRoute(addForm.resource_id, addForm.route_id, data) : addApiRoute(addForm.resource_id, data), {
    onSuccess: (message) => {
      queryClient.invalidateQueries('api-route-list')
      setAddForm()
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
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    },
  })


  const handleAdd = (e) => {
    setAddForm({ ...addForm, route: e?.target?.value })
  }

  const handleSubmit = () => {
    if (addForm?.route) {
      addRoute({ route: addForm?.route })
    }
  }

  return (
    <div className={classes.sidePanelWrapper}>
      <div className={classes.titleWrapper}>
        <Typography variant='h4'>Add API route</Typography>
        <IconButton size='small' onClick={callback}><CloseIcon /></IconButton>
      </div>
      <div className={classes.contentWrapper}>
        <div className={classes.listWrapper}>
          {
            data?.map((item, i) => <RouteGroup data={item} key={i} setAddForm={setAddForm} />)
          }
        </div>
        <div>
          {
            addForm && (
              <div className={classes.addForm}>
                <Typography variant='h5'>{addForm.action} {'Route'}</Typography>
                <Grid item md={12} style={{ marginTop: 15 }}>
                  <label style={{ marginBottom: 8 }}>Route</label>
                  <TextField
                    id={addForm.action}
                    fullWidth
                    variant='outlined'
                    value={addForm?.route}
                    onChange={handleAdd}
                  />
                </Grid>
                <div className={classes.formFooter}>
                  <Button
                    onClick={() => setAddForm()}
                    size='small'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    style={{ color: '#1EAE98', borderColor: '#1EAE98' }}
                    variant='outlined'
                    size='small'
                  >
                    Save
                  </Button>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <div>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button variant='outlined' onClick={callback}>
              Back
            </Button>
          </div>
          <Button
            variant='contained'
            type='submit'
            startIcon={<AddIcon />}
            onClick={() => {
              setAddForm({ action: 'Add', resource_id: data[0]?.resource_id })
            }}
            color='primary'
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddRouteForm;