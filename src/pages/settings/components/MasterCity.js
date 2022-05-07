import { makeStyles, IconButton, Typography, Divider, Button, Grid, TextField, Tooltip, Paper, InputAdornment, CircularProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import TextInput from '../../../components/TextInput/TextInput';
import { getActiveStates } from '../../../services/common.service';
import { getCity, updateCity} from '../../../services/master.service';

const useStyles = makeStyles(() => ({
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
      <Typography variant="body1" style={{ paddingLeft: 10 }}>{data.name}</Typography>
      <Tooltip title='Edit'>
        <IconButton size='small' className={classes.btn} onClick={() => setAddForm({action: 'Edit', name: data.name, id: data.id, state_code: data?.state_code})}>
          <EditIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const MasterCity = ({ callback, title }) => {
  const classes = useStyles()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [addForm, setAddForm] = useState()
  const [addData, setAddData] = useState()
  const [filteredData, setFilteredData] = useState([])
  const { data: city = [], isLoading } = useQuery('city', () => getCity(), {refetchOnWindowFocus: false})
  const { data: states = [] } = useQuery('state', getActiveStates, {refetchOnWindowFocus: false})

  useEffect(() => {
    setFilteredData(city)
  },[city])

  const { mutate: addCity } = useMutation(data =>!addForm.id ? updateCity(data) : updateCity(data, addForm.id), {
    onSuccess: (message) => {
      queryClient.invalidateQueries('city')
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
    const { name, value } = event.target;
    if(name === 'state'){
      setAddData({...addData, state_code: value.toUpperCase()});
      setAddForm({...addForm, state_code: value.toUpperCase()});
    } else {
      setAddData({...addData, name: value.toUpperCase()});
      setAddForm({...addForm, name: value.toUpperCase()});
    }
  };

  const handleSubmit = () => {
    addData && addCity(addData)
  }

  const handleSearch = (event) => {
    const { name, value } = event.target;
    setFilteredData(city.filter(item => item?.name?.toUpperCase()?.includes(value?.toUpperCase())))
  }

  return (
    <>
      <Typography className={classes.sidePanelTitle} variant="h4">
        <div>{title}</div>
        <IconButton onClick={() => callback(false)} size='small'>
          <CloseIcon />
        </IconButton>
      </Typography>
      <TextField 
        name='search'
        variant='outlined'
        style={{margin: 10}}
        placeholder='Search...'
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchOutlinedIcon />
            </InputAdornment>
          )
        }}
      />
      <Paper className={classes.root}>
        {
          isLoading ?
            <div style={{display: 'grid', justifyContent: 'center', alignContent: 'center'}}>
              <CircularProgress size={30} />
            </div> :
            <div className={classes.content}>
              {
                filteredData.map((item, i) => {
                  return(<DataGroup data={item} key={i} setAddForm={setAddForm}/>)
                })
              }
            </div>
        }
      </Paper>
      {
        addForm && (
          <div className={classes.addForm}>
            <Typography variant='h5'>{addForm.action} {title}</Typography>
            <Grid container spacing={2}>
              <Grid item md={6} style={{marginTop: 15}}>
                <label style={{marginBottom: 8}}>State</label>
                <TextInput
                  select
                  name='state'
                  fullWidth
                  variant='outlined'
                  value={addForm?.state_code}
                  onChange={handleAdd}
                >
                  <option value={null}>Choose State...</option>
                  {
                    states.map((item, i) => {
                      return(
                        <option key={i} value={item?.id}>{item?.name}</option>
                      )
                    })
                  }
                </TextInput>
              </Grid>
              <Grid item md={6} style={{marginTop: 15}}>
                <label style={{marginBottom: 8}}>{title}</label>
                <TextInput
                  id={addForm.action}
                  fullWidth
                  variant='outlined'
                  value={addForm?.name}
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

export default MasterCity
