import { Table, TableBody, TableHead, TableRow, TableCell, TextareaAutosize, Typography, makeStyles, TextField, Button } from '@material-ui/core';
import React, {useState} from 'react'
import { useMount } from 'react-use';
import { getDeviations } from '../../../services/dealerships.service';
import TextInput from '../../../components/TextInput/TextInput';

const useStyles = makeStyles(theme => ({
    title: {
        marginTop:15
    },
    tableContainer: {
        marginTop: 10,
    },
    topicBtn: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 20,
        alignItems: 'center'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 20
    },
    field: {
        margin: 0
    }
}))

const Deviations = () => {
    const classes = useStyles()
    const [data, setData] = useState([])
    const [deviation, setDeviation] = useState([])
    // console.log(deviation);

    const handleRemove = (index) => {
        const test = [...deviation]
        test.splice(index,1)
        setDeviation(test)
    }

    // useMount(() => {
    //     fetch("http://localhost:3333/deviations")
    //     .then(res => res.json())
    //     .then(setData)
    // })
    return (
        <>
            <div className={classes.title}>
                <Typography variant="h5">Deviations</Typography>
            </div>
            <div className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Particulars</TableCell>
                            <TableCell>Policy</TableCell>
                            <TableCell>Actual</TableCell>
                            <TableCell>Deviation</TableCell>
                            <TableCell>Deviation Review</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data?.map(item => {
                                // console.log(item)
                                return(
                                    <TableRow>
                                        <TableCell>{item.particulars}</TableCell>
                                        <TableCell>{item.policy}</TableCell>
                                        <TableCell>
                                            <TextInput
                                                className={classes.field}
                                                name="actual"
                                                value={item.actual}
                                                disabled={item.particulars === 'Max FOIR %' || item.particulars === 'Min Credit Bureau Score' || item.particulars === 'Min Business Vintage with OMC (Yrs)' ? true : false}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                className={classes.field}
                                                select
                                                name="deviations"
                                            >
                                                <option value="">Select Deviation</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </TextInput>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                className={classes.field}
                                                // multiline
                                                placeholder="Remarks"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
            <div className={classes.topicBtn}>
                <Typography variant="h5">Manual Deviation</Typography>
                <Button variant="outlined" color="secondary" size="medium" onClick={() => setDeviation([...deviation, {description: '', review: ''}])}>Add Deviation</Button>
            </div>
            <div style={{marginTop: 10}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Deviation Description</TableCell>
                            <TableCell>Deviation Review</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            deviation?.map((item, i) => {
                                return(
                                    <TableRow>
                                        <TableCell>
                                            <TextInput
                                                name="description"
                                                placeholder="Description..."
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="review"
                                                variant="outlined"
                                                placeholder="Review..."
                                                fullWidth
                                                // multiline
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant='outlined' size="small" style={{color: '#FF5C58', borderColor: '#FF5C58'}} onClick={() => handleRemove(i)}>Remove</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
            <div className={classes.footer}>
                <Button variant="contained" color="primary">Save</Button>
            </div>

        </>
    )
}

export default Deviations;

export const DeviationsTable = () => {
    const classes = useStyles()
    const [data, setData] = useState([])

    // useMount(() => {
    //     fetch("http://localhost:3333/deviations")
    //     .then(res => res.json())
    //     .then(setData)
    // })

    return(
        <>
            <div className={classes.title}>
                <Typography variant="h5">Deviations</Typography>
            </div>
            <div className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Particulars</TableCell>
                            <TableCell>Policy</TableCell>
                            <TableCell>Actual</TableCell>
                            <TableCell>Deviation</TableCell>
                            <TableCell>Deviation Review</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data?.map(item => {
                                return(
                                    <TableRow>
                                        <TableCell>{item.particulars}</TableCell>
                                        <TableCell>{item.policy}</TableCell>
                                        <TableCell>{item.actual}</TableCell>
                                        <TableCell>{item?.deviations}</TableCell>
                                        <TableCell>{item?.deviationReview}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableHead>
                        <TableRow>
                            <TableCell>Deviation Description</TableCell>
                            <TableCell>Deviation Review</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </div>
        </>
    )
}