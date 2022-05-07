import { makeStyles, IconButton, Typography, Grid, Tooltip, Paper } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { getAllUserRoles } from '../../../services/users.service';
import MapProduct from '../../users/components/MapProduct';

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

const UserGroup = ({data, setAddForm}) => {
  const classes = useStyles()

  return(
    <div className={classes.label}>
      <Typography variant="body1" style={{ paddingLeft: 10 }}>{`${data.role_name} (${data?.name})`}</Typography>
      <Tooltip title='Edit'>
        <IconButton size='small' className={classes.btn} onClick={() => setAddForm({action: 'Edit', name: data.role_name, id: data.id, role: data.name})}>
          <EditIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const AssignProducts = ({ callback, title }) => {
  const classes = useStyles()
  const [addForm, setAddForm] = useState()
  const { data: roles = [] } = useQuery('roles', () => getAllUserRoles(), {refetchOnWindowFocus: false})
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
            roles.map((item, i) => {
              return(<UserGroup data={item} key={i} setAddForm={setAddForm}/>)
            })
          }
        </div>
      </Paper>
      {
        addForm && (
          <div className={classes.addForm}>
            <Grid item md={12} style={{marginTop: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Typography variant='body1'>{addForm?.name}<span style={{color:'rgb(0,0,0,0.3)', marginLeft: 8}}>({addForm?.role})</span></Typography>
              <IconButton onClick={() => setAddForm()} size='small'>
                <CloseIcon />
              </IconButton>
            </Grid>
            {
              addForm?.action === 'Edit' &&
                <MapProduct role_id={addForm?.id} />
            }
          </div>
        )
      }
    </>
  )
}

export default AssignProducts
