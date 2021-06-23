import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getOwnersById } from '../../services/transports.service';


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


const TransportOwnerTable = ({ id }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [ownerData, setOwnerData] = useState([])
    useMount(() => {
        if (!ownerData || !ownerData.length) {
            setLoading(true);
            getOwnersById(id)
                .then(data => {
                    setOwnerData(data);
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
                label: 'Owner Id',
                name: 't_owner_id',
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: value => {
                        return <RouterLink to={`/owners/${value}`}>{value}</RouterLink>
                    }
                }
            },
            {
                label: 'Name',
                name: 'first_name',
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
    }, [ownerData]);

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
                Array.isArray(ownerData) && ownerData.length ? (

                    <MUIDataTable
                        // title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} </Typography> : null}
                        data={ownerData}
                        columns={columns}
                        options={options}
                    />
                ) : (
                    !loading && <Paper style={{ padding: 10 }}>No Owners found</Paper>
                )
            }
            {
                loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
            }
        </div>
    )
}


export default TransportOwnerTable;