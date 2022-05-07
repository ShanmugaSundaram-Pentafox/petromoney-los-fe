import { makeStyles, IconButton, Typography, Divider, Button, Grid, TextField, Tooltip, Paper } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TransferList from '../../../components/CommonComponents/TransferList';
import { logger } from '../../../config/logger';
import { addZones, editZones, getZones } from '../../../services/common.service';
import { getUnmappedStates, getZonesMapById, updateZoneMapById } from '../../../services/master.service';

const useStyles = makeStyles(() => ({
  sidePanelFormWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '40vw'
  },
  root: {
    minWidth: '36vw',
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
    height: '100%',
    borderRadius: 5,
    overflow: 'auto'
  },
  sidePanelTitle: {
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 0,
    boxShadow: '0 1px 4px -3px #333'
  },
  sidePanelFormContentWrapper: {
    flex: 1,
    overflow: 'auto',
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
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  addForm: {
    margin: 10,
    padding: 17,
    position: 'relative',
    borderRadius: 6,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
  },
  formFooter :{
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  btn: {
    visibility: 'hidden',
    color: '#687980',
  },
}))

const ZoneGroup = ({data, setAddForm}) => {
  const classes = useStyles()

  return(
    <div className={classes.label}>
      <Typography variant="body1" style={{ paddingLeft: 10 }}>{data.label}</Typography>
      <Tooltip title='Edit'>
        <IconButton size='small' className={classes.btn} onClick={() => setAddForm({action: 'Edit', name: data.label, id: data.value})}>
          <EditIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const Zones = ({ callback, title }) => {
  const classes = useStyles()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [addForm, setAddForm] = useState()
  const [addData, setAddData] = useState()
  const [selectedItem, setSelectedItem] = useState([])

  const { data: zones = [] } = useQuery('zones', () => getZones(), {refetchOnWindowFocus: false})

  const { mutate: addZone } = useMutation(data =>!addForm.id ? addZones(data) : editZones(addForm.id, data), {
    onSuccess: (message) => {
      queryClient.invalidateQueries('zones')
      setAddForm()
      setAddData()
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

  const updateMapping = (action) => {
    let body = {state_id: selectedItem}

    updateZoneMapById(addForm?.id, body, action)
      .then(res => {
        setSelectedItem([])
        queryClient.invalidateQueries('mapped')
        queryClient.invalidateQueries('unmapped')
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
      })
      .catch(e => logger(e))
  }

  const handleAdd = (event) => {
    setAddData({...addData, name: event.target.value.toUpperCase()});
    setAddForm({...addForm, name: event.target.value.toUpperCase()})
  };

  const handleSubmit = () => {
    addData && addZone(addData)
  }

  return (
    <>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>{title}</div>
        <IconButton onClick={() => callback(false)} size='small'>
          <CloseIcon />
        </IconButton>
      </Typography>
      <Paper className={classes.root}>
        <div className={classes.content}>
          {
            zones.map((item, i) => {
              return(<ZoneGroup data={item} key={i} setAddForm={setAddForm}/>)
            })
          }
        </div>
      </Paper>
      {
        addForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>{addForm.action} {title}</Typography>
            <Grid item md={12} style={{marginTop: 15}}>
              <label style={{marginBottom: 8}}>{title}</label>
              <TextField
                id={addForm.action}
                fullWidth
                variant='outlined'
                value={addForm?.name}
                onChange={handleAdd}
              />
            </Grid>
            {
              addForm?.action === 'Edit' &&
                <TransferList title='States Map' mappedData={() => getZonesMapById(addForm?.id)} unmappedData={getUnmappedStates} selectedItem={selectedItem} setSelectedItem={setSelectedItem} updateMapping={updateMapping} />
            }
            <div className={classes.formFooter}>
              <Button
                onClick={() => setAddForm()}
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
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button variant='outlined' onClick={() => callback(false)}>
              Back
            </Button>
          </div>
          <div>
            <Button
              variant='contained'
              type='submit'
              startIcon={<AddIcon  />}
              onClick={() => {
                setAddForm({action:'Add'})
              }}
              color='primary'
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Zones
