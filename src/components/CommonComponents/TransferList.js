import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import { toInteger } from 'lodash'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

const useStyles = makeStyles(() => ({
    root: {
        marginTop: 10,
        width: '4vw',
        maxHeight: 300,
        overflowY: 'auto',
        border: '1px solid rgb(0,0,0,0.2)',
        boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
        borderRadius: 3
    },
}))

const TransferList = ({ title, unmappedData, mappedData, setSelectedItem, selectedItem, updateMapping }) => {
    const classes = useStyles()
    const [selectedState, setSelectedState] = useState(false)

    const { data: mapped = [] } = useQuery('mapped', () => mappedData(), { refetchOnWindowFocus: false })
    const { data: unmapped = [] } = useQuery('unmapped', () => unmappedData(), { refetchOnWindowFocus: false })

    const handleChange = (e, list) => {
        const { checked, value } = e.target;
        if (checked) {
            setSelectedItem([...selectedItem, toInteger(value)])
        } else {
            let buffer = [...selectedItem]
            buffer.splice(buffer.indexOf(toInteger(value)), 1)
            setSelectedItem(buffer)
        }
    }

    const handleSelectAll = (list, mode) => {
        if (mode) {
            setSelectedItem([])
            setSelectedState(false)
        } else {
            setSelectedItem(list.map(r => r.id))
            setSelectedState(true)
        }
    }


    return (
        <Box mt={2} position={'relative'}>
            <Typography variant="h4" component="h3">{title}</Typography>
            <Grid container spacing={2} style={{ padding: 10 }}>
                <Grid container style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                    <Grid item md={5}>
                        {
                            unmapped.length != 0 &&
                            <Button variant='outlined' size='small'
                                onClick={() => handleSelectAll(unmapped, selectedState)}
                            >{selectedState ? 'Deselect All' : 'Select All'}</Button>
                        }
                    </Grid>
                    <Grid item md={5}>
                        {
                            mapped.length != 0 &&
                            <Button variant='outlined' size='small'
                                onClick={() => handleSelectAll(mapped, selectedState)}
                            >{selectedState ? 'Deselect All' : 'Select All'}</Button>
                        }
                    </Grid>
                </Grid>
                <Grid item xs={5} className={classes.root}>
                    {
                        unmapped.length != 0 ?
                            unmapped.map((item, i) => {
                                return (
                                    <Paper key={i}>
                                        <FormGroup>
                                            <FormControlLabel
                                                key={item.id}
                                                control={<Checkbox key={item.id} checked={selectedItem.includes(item.id)} color="primary" value={item.id} onChange={(e) => handleChange(e, unmapped)} />}
                                                label={item.name}
                                                value={item.id}
                                            />
                                        </FormGroup>
                                    </Paper>
                                );
                            }) : <Typography variant='body1' style={{ color: 'rgb(0,0,0,0.4)' }}>All Items are Mapped!</Typography>
                    }
                </Grid>
                <Grid item xs={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 15 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        aria-label="move selected right"
                        onClick={() => updateMapping('add')}
                        style={{ marginBottom: 15 }}
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        aria-label="move selected left"
                        onClick={() => updateMapping('delete')}
                    >
                        &lt;
                    </Button>
                </Grid>
                <Grid item xs={5} className={classes.root}>
                    {
                        mapped.length != 0 ?
                            mapped.map((item, i) => {
                                return (
                                    <Paper key={i}>
                                        <FormGroup>
                                            <FormControlLabel
                                                key={item.id}
                                                control={<Checkbox key={item.id} color="primary" checked={selectedItem.includes(item.id)} value={item.id} onChange={(e) => handleChange(e, mapped)} />}
                                                label={item.name}
                                                value={item.id}
                                            />
                                        </FormGroup>
                                    </Paper>
                                );
                            }) : <Typography variant='body1' style={{ color: 'rgb(0,0,0,0.4)' }}>No Items are Mapped!</Typography>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}

export default TransferList