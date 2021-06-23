import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getFleetOperatorsById, getOwnersById } from '../../services/transports.service';


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


const FleetOperatorsTable = ({ id }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [operatorsData, setOperatorsData] = useState([])
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
    const columns = useMemo(() => {
        return [
            {
                label: 'Operator ID',
                name: 'id',
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: value => {
                        return <div>{value}</div>
                    }
                }
            },
            {
                label: 'Name',
                name: 'name_on_card',
                options: {
                    filter: false,
                    sort: true
                }
            },
            {
                label: 'Mobile',
                name: 'mobile',
                options: {
                    filter: true,
                    filterWidth: "100%",
                    sort: true,
                    customBodyRender: value => {
                        return (
                            <div>
                                {value ? value : '-'}
                            </div>
                        )
                    }
                }
            },
        ]
    }, [operatorsData]);

    const options = {
        selectableRowsHeader: false,
        selectableRows: "none",
        print: false,
        filter: false,
        search: false,
        download: false,
        viewColumns: false,
        rowsPerPage: 10,
        isRowSelectable: () => false,
        selectableRowsHeader: false,

    };

    return (
        <div >
            {
                Array.isArray(operatorsData) && operatorsData.length ? (

                    <MUIDataTable
                        // title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} </Typography> : null}
                        data={operatorsData}
                        columns={columns}
                        options={options}
                    />
                ) : (
                    !loading && <Paper style={{ padding: 10 }}>No Operators found</Paper>
                )
            }
            {
                loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
            }
        </div>
    )
}


export default FleetOperatorsTable;