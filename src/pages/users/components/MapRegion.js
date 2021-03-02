import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {
  getAllRegion,
  getMappedRegion,
  updateMappedRegion,
  deleteMappedRegion,
} from "../../../services/common.service";
import { useMount } from "react-use";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 10,
    minWidth: "15vw",
    maxHeight: 300,
    overflowY: "auto",
  },
  paper: {
    width: "auto",
    height: 20,
    overflow: "auto",
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
    setLoading(true);
    getAllRegion()
    .then((data) => {
        setLoading(false);
        setAllRegion(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  });
  useMount(() => {
    const id = data.data.id;
    setLoading(true);
    getMappedRegion(id)
      .then((data) => {
        setMappedRegion(data);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  const getValue = (e) => {
    console.log(e);
    const val = parseInt(e?.target?.value);
    if (!val) return;
    if (region.includes(val)) {
      var n = region.indexOf(val);
      setRegion((d) => {
        d.splice(n, 1);
        return d;
      });
    } else {
      setRegion((d) => {
        return d.concat(val);
      });
    }
  };
  const updateValue = async () => {
    const id = data.data.id;
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
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const deleteValue = async () => {
    const id = data.data.id;
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
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  return (
    <Box mt={2} mb={2} bgcolor={"#fafafa"} position={"relative"}>
      {
        loading && (
          <Box p={2} pt={10} mx={'auto'} bgcolor={"rgba(207, 216, 220, .25)"} textAlign={"center"} position={"absolute"} top={0} bottom={0} width={'100%'}>
            <CircularProgress />
          </Box>
        )
      }
      <Typography variant="h4" component="h3">
        Regions Mapped
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={5} className={classes.root}>
          {allRegion.map((item) => {
            return (
              <Paper>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox color="primary" value={item.region} onChange={(e) => getValue(e)} />}
                    label={item.name}
                    value={item.region}
                  />
                </FormGroup>
              </Paper>
            );
          })}
        </Grid>
        <Grid item xs={2}>
          <Grid container direction="column" alignItems="center" justify={"space-around"}>
            <Button
              variant="outlined"
              size="small"
              aria-label="move selected right"
              onClick={() => updateValue()}
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
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
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox color="primary" value={item.region_id} onChange={(e) => getValue(e)} />}
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
