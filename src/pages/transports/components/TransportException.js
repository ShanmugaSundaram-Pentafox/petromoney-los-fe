import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useMount } from "react-use";
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import usePageTitle from '../../../hooks/usePageTitle';
import { getAllExceptions } from '../../../services/loans.service';

const useStyles = makeStyles({
    table: {
        minWidth: 500,
    },
});
const TransportException = () => {
    usePageTitle('Transport Exceptions')
    const classes = useStyles();
    const [exceptions, setExceptions] = useState([]);

    useMount(() => {
        getAllExceptions()
            .then((data) => {
                setExceptions(data)
            })
            .catch((e) => {
                console.log(e);
            });
    });

    return (
        <Grid item xs={6}>
            {
             Array.isArray(exceptions) && exceptions.length ? (
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Applicant Code</TableCell>
                                    <TableCell align="center">Applicant Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {exceptions.map((item) => (
                                    <TableRow key={item.applicant_code}>
                                        <TableCell align="center" component="th" scope="row">
                                            {item.applicant_code}
                                        </TableCell>
                                        <TableCell align="center">{item.applicant_name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                ) : <Paper style={{ padding: 10 }}>No Transports Exceptions Found</Paper>
            }

        </Grid>
    );
}
export default TransportException;