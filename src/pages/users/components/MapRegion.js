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
import React, { useState } from 'react';
import { useMount } from 'react-use';
import {
  getAllRegion,
  getMappedRegion,
  updateMappedRegion,
  deleteMappedRegion,
} from '../../../services/common.service';

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

const MapRegion = (data) => {
  const classes = useStyles();
  const [allRegion, setAllRegion] = useState([]);
  const [mappedRegion, setMappedRegion] = useState([]);
  const [region, setRegion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allReg, setAllReg] = useState(false);
  const [mapReg, setMapReg] = useState(false)

  useMount(() => {
    const id = data.data.id;
    setLoading(true);
    getMappedRegion(id)
      .then((d) => {
        setMappedRegion(d);
        return getAllRegion()
      })
      .then((d) => {
        // removed region_name: all from the Database so no need to use this condition
        // if(d.filter(item => item.region_name === 'All' || item.region_id === 0)) {
        //   let reg = d
        //   reg.splice(0,1)
        //   setAllRegion(reg)
        // } else {
        setAllRegion(d);
        // }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  });

  const handleSelectAllRegion = (list, action, func) => {
    if(func){
      if(action === 'allRegion'){
        setRegion(list.map(r => r.region_name ? r.region_id : r.region))
        setAllReg(true)
      } else {
        setRegion(list.map(r => r.region_name ? r.region_id : r.region))
        setMapReg(true)
      }
    } else {
      setRegion([])
      setAllReg(false)
      setMapReg(false)
    }
  }

  const getValue = (e, list) => {
    const val = parseInt(e?.target?.value);
    if(val === 0) {
      if(region.includes(val)) {
        setRegion([])
      } else {
        setRegion(list.map(r => r.region_name ? r.region_id : r.region))
      }
      return;
    }
    if (region.includes(val)) {
      var n = region.indexOf(val);
      
      setRegion((d) => {
        let re = [...d];
        re.splice(n, 1)
        if(re.includes(0)) {
          re.splice(re.indexOf(0), 1);
        }
        return re;
      });
    } else {
      setRegion((d) => {
        if([...d, val].length === list.length - 1) {
          d.unshift(0);
        }
        return d.concat(val);
      });
    }
  };
  const updateValue = async () => {
    const id = data.data.id;
    if (region.length !== 0) {
      setLoading(true);
      updateMappedRegion(region, id)
        .then((res) => {
          getMappedRegion(id)
            .then((data) => {
              setLoading(false);
              setMappedRegion(data);
            })
            .catch((e) => {
              console.log(e);
              setLoading(false);
            });
          setRegion([])
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };
  const deleteValue = async () => {
    const id = data.data.id;
    if (region.length !== 0) {
      setLoading(true);
      deleteMappedRegion(region, id)
        .then((res) => {
          getMappedRegion(id)
            .then((data) => {
              setLoading(false);
              setMappedRegion(data);
            })
            .catch((e) => {
              setLoading(false);
              console.log(e);
            });
          setRegion([]);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const regionList = (allRegion || []).filter((r) => {
    if (!mappedRegion.find(rg => rg.region_id === r.region))
      return true
    else return false;
  })
  return (
    <Box mt={2} mb={2} position={'relative'}>
      {
        loading && (
          <Box p={2} pt={10} mx={'auto'} bgcolor={'rgba(207, 216, 220, .25)'} textAlign={'center'} position={'absolute'} zIndex={10} top={0} bottom={0} width={'100%'}>
            <CircularProgress color="secondary" />
          </Box>
        )
      }
      <Typography variant="h4" component="h3">
        Regions Map
      </Typography>
      <Grid container spacing={2} style={{padding: 10}}>
        <Grid container style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
          <Grid item md={5}>
            {
              regionList.length != 0 &&
                <Button variant='outlined' size='small' onClick={() => handleSelectAllRegion(regionList, 'allRegion' , !allReg)}>{allReg ? 'Deselect All' : 'Select All'}</Button>
            }
          </Grid>
          <Grid item md={5}>
            {
              mappedRegion.length != 0 &&
                <Button variant='outlined' size='small' onClick={() => handleSelectAllRegion(mappedRegion, 'mappedRegion', !mapReg)}>{mapReg ? 'Deselect All' : 'Select All'}</Button>
            }
          </Grid>
        </Grid>
        <Grid item xs={5} className={classes.root}>
          {
            regionList.length != 0 ?
              regionList.map((item) => {
                return (
                  <Paper key={item.region}>
                    <FormGroup>
                      <FormControlLabel
                        key={item.region}
                        control={<Checkbox key={item.region} checked={region.includes(item.region)} color="primary" value={item.region} onChange={(e) => getValue(e, regionList)} />}
                        label={item.name}
                        value={item.region}
                      />
                    </FormGroup>
                  </Paper>
                );
              }) : <Typography variant='body1' style={{color: 'rgb(0,0,0,0.4)'}}>All Regions are Mapped!</Typography>
          }
        </Grid>
        <Grid item xs={2} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 15}}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            aria-label="move selected right"
            onClick={() => updateValue()}
            style={{ marginBottom: 15 }}
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            aria-label="move selected left"
            onClick={() => deleteValue()}
          >
            &lt;
          </Button>
        </Grid>
        <Grid item xs={5} className={classes.root}>
          <Paper direction="column">
            {
              mappedRegion.length != 0 ?
                mappedRegion.map((item) => {
                  return (
                    <FormGroup key={item.region_id}>
                      <FormControlLabel
                        key={item.region_id}
                        control={<Checkbox color="primary" key={item.region_id} checked={region.includes(item.region_id)} value={item.region_id} onChange={(e) => getValue(e, mappedRegion)} />}
                        label={item.region_name}
                        value={item.region_id}
                      />
                    </FormGroup>
                  );
                }) : <Typography variant='body1' style={{color: 'rgb(0,0,0,0.4)'}}>No Regions are Mapped!</Typography>
            }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default MapRegion;
