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
  useMount(() => {
    const id = data.data.id;
    setLoading(true);
    getMappedRegion(id)
      .then((d) => {
        setMappedRegion(d);
        return getAllRegion()
      })
      .then((d) => {
        setLoading(false);
        setAllRegion(d);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  });
  const getValue = (e, list) => {
    console.log(e);
    const val = parseInt(e?.target?.value);
    // if (!val) return;
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
    // console.log(mappedRegion, r.region, await !mappedRegion.find(rg => rg.region_id === r.region))
    if (!mappedRegion.find(rg => rg.region_id === r.region))
      return true
    else return false;
    // return !mappedRegion.find(rg => rg.region_id === r.region);
  })
  return (
    <Box mt={2} mb={2} bgcolor={'#fafafa'} position={'relative'}>
      {
        loading && (
          <Box p={2} pt={10} mx={'auto'} bgcolor={'rgba(207, 216, 220, .25)'} textAlign={'center'} position={'absolute'} zIndex={10} top={0} bottom={0} width={'100%'}>
            <CircularProgress color="secondary" />
          </Box>
        )
      }
      <Typography variant="h4" component="h3">
        Regions Mapped
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={5} className={classes.root}>
          {regionList.map((item) => {
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
          })}
        </Grid>
        <Grid item xs={2}>
          <Grid container direction="column" alignItems="center" justify={'center'}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              aria-label="move selected right"
              onClick={() => updateValue()}
              style={{ marginTop: 60, marginBottom: 20 }}
            >
              &gt;
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              aria-label="move selected left"
              onClick={() => deleteValue()}
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={5} className={classes.root}>
          <Paper direction="column">
            {mappedRegion.map((item) => {
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
            })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default MapRegion;
