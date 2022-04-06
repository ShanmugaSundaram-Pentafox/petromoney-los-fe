import { makeStyles, IconButton, Typography, Divider, Button, Grid, Tooltip, Paper } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TextInput from '../../../components/TextInput/TextInput';
import { updateCollectionRemark } from '../../../services/master.service';
import { getCollectionRemark } from '../../../services/users.service';

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
    padding: '15px 16px',
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

const DataGroup = ({data, setAddForm}) => {
  const classes = useStyles()

  return(
    <div className={classes.label}>
      <Typography variant="body1" style={{ paddingLeft: 10 }}>{data.remarks}</Typography>
      <Tooltip title='Edit'>
        <IconButton size='small' className={classes.btn} onClick={() => setAddForm({action: 'Edit', remarks: data.remarks, id: data.id})}>
          <EditIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const MasterCollectionRemarks = ({ callback, title }) => {
  const classes = useStyles()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [addForm, setAddForm] = useState()
  const [addData, setAddData] = useState()

  const { data: remarks = [] } = useQuery('coll-rem', () => getCollectionRemark(), {refetchOnWindowFocus: false})

  const { mutate: addRemarks } = useMutation(data =>!addForm.id ? updateCollectionRemark(data, 'add') : updateCollectionRemark(data, 'update', addForm?.id), {
    onSuccess: (message) => {
      queryClient.invalidateQueries('coll-rem')
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

  const handleAdd = (event) => {
    const {name, value} = event.target;
    setAddData({...addData, [name]: value});
    setAddForm({...addForm, [name]: value});
  };

  const handleSubmit = () => {
    addData && addRemarks(addData)
  }

  return (
    <>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>{title}</div>
        <IconButton onClick={() => callback(false)} size='small'>
          <CloseIcon fontSize='size' />
        </IconButton>
      </Typography>
      <Paper className={classes.root}>
        <div className={classes.content}>
          {
            remarks.map((item, i) => {
              return(<DataGroup data={item} key={i} setAddForm={setAddForm}/>)
            })
          }
        </div>
      </Paper>
      {
        addForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>{addForm.action} {title}</Typography>
            <Grid container spacing={2}>
              <Grid item md style={{marginTop: 15}}>
                <label style={{marginBottom: 8}}>Remarks</label>
                <TextInput
                  id={addForm.action}
                  name='remarks'
                  fullWidth
                  variant='outlined'
                  value={addForm?.remarks}
                  onChange={handleAdd}
                />
              </Grid>
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

export default MasterCollectionRemarks
