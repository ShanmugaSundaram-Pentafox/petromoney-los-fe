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
    alignItems: 'center'
    
  }
});

function Contain({ title, data, label }) {
  const classes = useStyles();
  const [value, setValue] = useState();
  const [openEditForm, setOpenEditForm] = useState(false);
  // console.log(value);

  const filteredData = data.filter((item) => item.name.toUpperCase().includes(value?.toUpperCase()))

  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.title}>
          <Typography variant='h5' style={{ marginLeft: 5 }}>
            {title}
          </Typography>
          <Tooltip title={'Add '+title}>
          <Button variant='contained' color='primary'>
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
          {value
            ? filteredData.length > 0?

                filteredData.map((item, i) => {
                  return (
                    <>
                      <div className={classes.label}>
                        <Typography variant='h7' style={{ paddingLeft: 18 }}>
                          {item.name}
                        </Typography>
                        <div>
                          <Tooltip title='Edit'>
                            <IconButton className={classes.btn} size='small'>
                              <EditIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton className={classes.btn} size='small'>
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                      <Divider className={classes.divider} />
                    </>
                  );
                }) : 
                <>
                <div className={classes.nodata}>
                  <Typography variant='h6'>No Data Found</Typography>
                  <div>
                  <Button variant='outlined' size='small' color='primary' style={{marginTop: 15}}>
                    ADD
                  </Button>
                  </div>
                </div>
                </>
            : data.map((item, i) => {
                return (
                  <>
                    <div className={classes.label}>
                      <Typography variant='h7' style={{ paddingLeft: 18 }}>
                        {item.name ? item.name : item.region}
                      </Typography>
                      <div>
                        <Tooltip title='Edit'>
                          <IconButton className={classes.btn} size='small'>
                            <EditIcon
                              fontSize='small'
                              className={classes.edt}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton className={classes.btn} size='small'>
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
              })}
        </div>
        <Drawer
          anchor='bottom'
          className={classes.drawer}
          variant='temporary'
          open={openEditForm}
        >
          Hello
        </Drawer>
      </Paper>
    </>
  );
}

export default Contain;
