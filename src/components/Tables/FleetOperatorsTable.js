import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import { makeStyles } from '@material-ui/styles';
import { getFleetOperatorsById, getOwnersById } from '../../services/transports.service';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



const useStyles = makeStyles(theme => ({
    title: {
        fontWeight: 500
    },
    dTitle: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));


const FleetOperatorsTable = ({ id, editable, titleAlign, dealersClickRow }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [operatorsData, setOperatorsData] = useState([])
    const [data, setData] = useState([])
    useMount(() => {
        if (!operatorsData || !operatorsData.length) {
            setLoading(true);
            getFleetOperatorsById(id)
                .then(data => {
                    setOperatorsData(data);
                    setLoading(false);
                })
                .catch(e => {
                    setLoading(false);
                })
        }
    });

    return (
        <div className={classes.wrapper}>
            {/* <div className={classes.header}>
                <Typography style={{ width: '90%' }} variant="h5" align={titleAlign} className={classes.title}>Dealers</Typography>
            </div> */}
            <Table className={classes.table} size="small" aria-label="Dealers">
                <TableHead>
                    <TableRow>
                        <TableCell>Operator ID</TableCell>
                        <TableCell align="center">Transport Name</TableCell>
                        <TableCell align="center">Mobile</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {operatorsData.map(row => (
                        <TableRow className={classes.tableRow} key={row.id} onClick={e => dealersClickRow(e, row)}>
                            <TableCell>{row.id}&nbsp;&nbsp;</TableCell>
                            <TableCell align="center">{row.transport_name ? row.transport_name.toUpperCase() : "-"}</TableCell>
                            <TableCell align="center">{row.mobile ? row.mobile : "-"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


export default FleetOperatorsTable;