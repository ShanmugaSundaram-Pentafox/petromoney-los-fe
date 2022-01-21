import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@material-ui/core'
import React from 'react'
import { useQuery } from 'react-query';
import { getAllRegion } from '../../../services/common.service';

export const RegionStateMap = () => {
    const { data: regions = [] } = useQuery('regions-map', () => getAllRegion(), {refetchOnWindowFocus: false})
    console.log(regions);

    return (
        <div style={{paddingTop: 14}}>
            <Typography variant='h6'>Regions Map</Typography>
            <Grid container>
                <Grid item md={5} style={{height: '20vh', overflowY: 'auto'}}>
                    {
                        regions?.map((item, i) => {
                            return(
                                <FormGroup>
                                    <FormControlLabel
                                        key={item.region}
                                        control={<Checkbox key={item.region} color="primary" value={item.region} />}
                                        label={item.name}
                                        value={item.region}
                                    />
                                </FormGroup>
                            )
                        })
                    }
                </Grid>
                <Grid item md={2} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 9}}>
                    <Button variant='outlined' size='small' color='secondary'>&gt;</Button>
                    <Button variant='outlined' size='small' color='secondary' style={{marginTop: 8}}>&lt;</Button>
                </Grid>
                <Grid item md={5} style={{height: '20vh', overflowY: 'auto'}}>

                </Grid>
            </Grid>
        </div>
    )
}