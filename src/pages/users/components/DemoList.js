import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { getAllRegion, getMappedRegion, updateMappedRegion, deleteMappedRegion } from '../../../services/common.service';
import { useMount } from 'react-use';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop:10,
        minWidth: '15vw',
        maxHeight:300,
        overflowY:'auto',
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
const Demolist = (data) => {
    const classes = useStyles();
    const [allRegion, setAllRegion] = useState([])
    const [mappedRegion, setMappedRegion] = useState([])
    const [region, setRegion] = useState([])
    useMount(() => {
        getAllRegion()
            .then(data => {
                setAllRegion(data);
            })
            .catch(e => {
                console.log(e);
            })
    })
    useMount(() => {
        const id = data.data.id
        getMappedRegion(id)
            .then(data => {
                setMappedRegion(data);
            })
            .catch(e => {
                console.log(e);
            })
    })
    const getValue = (e) => {
        var value=parseInt(e.target.value)
        if(region.includes(value)) {
            var n = region.indexOf(value)
            setRegion(d => { d.splice(n, 1); return d; });
        }
        else {
            
            setRegion(d => { return d.concat(value); })
        }
        console.log("number",region)
    }
    const updateValue = async () => {
        const id = data.data.id
        console.log("regions",region)
        updateMappedRegion(region, id)
        console.log("after deletion regions",region)
        await 
        getMappedRegion(id)
            .then(data => {
                setMappedRegion(data);
            })
            .catch(e => {
                console.log(e);
            })

    }
    const deleteValue =  async () => {
        const id = data.data.id
        deleteMappedRegion(region, id)
        await getMappedRegion(id)
            .then(data => {
                setMappedRegion(data);
            })
            .catch(e => {
                console.log(e);
            })
        

    }
    return (
        <Box mt={2} mb={2} bgcolor={"#fafafa"}>
            <Typography variant="h4" component="h3">Regions Mapped</Typography>
            <Grid container spacing={2}  >
                <Grid item xs={5} className={classes.root}>
                    {allRegion.map(item => {
                        return (
                            <Paper>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                            />
                                        }
                                        label={item.name}
                                        value={item.region}
                                        onChange={(e) => getValue(e)}
                                    />
                                </FormGroup>
                            </Paper>
                        )
                    })}
                </Grid>
                <Grid item xs={2} >
                    <Grid container direction="column" alignItems="center">
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
                <Grid item xs={5} className={classes.root} >
                    <Paper direction="column"  >
                        {mappedRegion.map(item => {
                            return (
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                color="primary"
                                            />
                                        }
                                        label={item.region_name}
                                        value={item.region_id}
                                        onChange={(e) => getValue(e)}
                                    />
                                </FormGroup>
                            )
                        })}
                    </Paper>
                </Grid>
            </Grid>
        </Box >
    );
}
export default Demolist;