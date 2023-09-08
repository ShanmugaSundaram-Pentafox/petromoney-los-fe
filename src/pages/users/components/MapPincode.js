import { InputAdornment, TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { useSnackbar } from 'notistack';
import React, { useState,useEffect } from 'react';
import { mapPincode } from '../../../services/users.service';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 10,
    minWidth: '15vw',
    maxHeight: 300,
    overflowY: 'auto',
    border: '1px solid rgb(0,0,0,0.2)',
    boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
    borderRadius: 3
  },
  paper: {
    width: 'auto',
    height: 20,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

const MapPincode = ({ mappedData, masterData, callBack, userId, selectedRegion }) => {
  const classes = useStyles();
  const [mappedPincode, setMappedPincode] = useState(mappedData);
  const [unmappedPincode, setUnmappedPincode] = useState(masterData)
  const [pincode, setPincode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allReg, setAllReg] = useState(false);
  const [mapReg, setMapReg] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState()

  useEffect(() => {
    setUnmappedPincode(masterData)
  }, [masterData])


  useEffect(() => {
    setMappedPincode(mappedData)
  }, [mappedData])

  const handleSelectAllRegion = (list, action, func) => {
    if (func) {
      if (action === 'allPincode') {
        setPincode(list.map(r => r?.label))
        setAllReg(true)
      } else {
        setPincode(list.map(r => r.value))
        setMapReg(true)
      }
    } else {
      setPincode([])
      setAllReg(false)
      setMapReg(false)
    }
  }

  const getValue = (e, list) => {
    const val = parseInt(e?.target?.value);
    if (pincode.includes(val)) {
      var n = pincode.indexOf(val);

      setPincode((d) => {
        let re = [...d];
        re.splice(n, 1)
        if (re.includes(0)) {
          re.splice(re.indexOf(0), 1);
        }
        return re;
      });
    } else {
      setPincode((d) => {
        if ([...d, val].length === list.length - 1) {
          d.unshift(0);
        }
        return d.concat(val);
      });
    }
  };
  const updateValue = async () => {
    let filteredObjects = unmappedPincode.filter(item => pincode.includes(item.label));
    if (pincode.length !== 0) {
      setLoading(true);
      let resultArray = filteredObjects?.map((item) => ({
        city: item?.city,
        pincode: item.value,
      }));
      let reqBody = {
        user_id: userId,
        regions:selectedRegion?.map(item => item?.value),
        mapping: resultArray,
        method: 'POST'
      }
      handleSave(reqBody);
    }
  };
  const deleteValue = async () => {
    if (pincode.length !== 0) {
      setLoading(true);
      let reqBody = {}
      reqBody = {
        id: pincode,
        method: 'DELETE'
      }
      handleSave(reqBody)
    }
  };

  const handleSave = (reqBody) => {
    mapPincode(reqBody)
      .then((res) => {
        callBack();
        if(reqBody?.method == 'DELETE') {
          window.location.reload();
        }
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setLoading(false)
      })
      .catch((err) => {
        window.location.reload();
        setLoading(false)
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'red',
        })
      })
  }
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearch(value)
  }

  useEffect(() => {
    if (search) {
      setMappedPincode(mappedData?.filter(item => (item?.label)?.toString()?.includes(search)))
      setUnmappedPincode(masterData?.filter(item => (item?.label)?.toString()?.includes(search)))
    } else {
      setMappedPincode(mappedData);
      setUnmappedPincode(masterData);

    }
  }, [search])

  return (
    <Box mt={2} mb={2} position={'relative'}>
      <div style={{ minWidth: '70%' }}>
        <TextField
          name='search'
          variant='outlined'
          style={{ margin: 10 }}
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
      </div>
      {
        loading && (
          <Box p={2} pt={10} mx={'auto'} bgcolor={'rgba(207, 216, 220, .25)'} textAlign={'center'} position={'absolute'} zIndex={10} top={0} bottom={0} width={'100%'}>
            <CircularProgress color="secondary" />
          </Box>
        )
      }
      <Grid container spacing={2} style={{ padding: 10 }}>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <Grid item md={5}>
            {
              unmappedPincode.length != 0 &&
                <Button variant='outlined' size='small' onClick={() => handleSelectAllRegion(unmappedPincode, 'allPincode', !allReg)}>{allReg ? 'Deselect All' : 'Select All'}</Button>
            }
          </Grid>
          <Grid item md={5}>
            {
              mappedPincode.length != 0 &&
                <Button variant='outlined' size='small' onClick={() => handleSelectAllRegion(mappedPincode, 'mappedPincode', !mapReg)}>{mapReg ? 'Deselect All' : 'Select All'}</Button>
            }
          </Grid>
        </Grid>
        <Grid item xs={5} className={classes.root}>
          {/* <div style={{ minWidth: '70%' }}>
            <TextField
              name='search'
              variant='outlined'
              style={{ margin: 10, marginLeft: 0 }}
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
          </div> */}
          {
            unmappedPincode.length != 0 ?
              unmappedPincode.map((item) => {
                return (
                  <Paper key={item.label}>
                    <FormGroup>
                      <FormControlLabel
                        key={item.label}
                        control={<Checkbox key={item.region} checked={pincode.includes(item.label)} color="primary" value={item.label} onChange={(e) => getValue(e, unmappedPincode)} />}
                        label={item.label}
                        value={item.label}
                      />
                    </FormGroup>
                  </Paper>
                );
              }) : <Typography variant='body1' style={{ color: 'rgb(0,0,0,0.4)' }}>All Pincodes are Mapped!</Typography>
          }
        </Grid>
        <Grid item xs={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 15 }}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => updateValue()}
            style={{ marginBottom: 15 }}
          >
            Map
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => deleteValue()}
          >
            Un map
          </Button>
        </Grid>
        <Grid item xs={5} className={classes.root} >
          <Paper direction="column">
            {/* <div style={{ minWidth: '70%' }}>
              <TextField
                name='search'
                variant='outlined'
                style={{ margin: 10 }}
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
            </div> */}
            {
              mappedPincode.length != 0 ?
                mappedPincode.map((item) => {
                  return (
                    <FormGroup key={item.label}>
                      <FormControlLabel
                        key={item.label}
                        control={<Checkbox color="primary" key={item.label} checked={pincode.includes(item.value)} value={item.value} onChange={(e) => getValue(e, mappedPincode)} />}
                        label={item.label}
                        value={item.value}
                      />
                    </FormGroup>
                  );
                }) : <Typography variant='body1' style={{ color: 'rgb(0,0,0,0.4)' }}>No Pincode are Mapped!</Typography>
            }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default MapPincode;
