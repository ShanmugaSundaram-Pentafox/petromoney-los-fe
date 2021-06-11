import React, { useMemo, useState } from 'react';
import { useMount } from 'react-use';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Paper from '@material-ui/core/Paper';
import { setLoansByStatus } from '../../store/loans/loans.actions';
import CircularProgress from '@material-ui/core/CircularProgress';


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


const TransportOwnerTable = ({ }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [loans, setLoans] = useState([
        {
            owner_id: 102211,
            name: "M C K Vinoj",
            mobile: 9876543210
        }
    ])
    // useMount(() => {
    //     if (!loans || !loans.length) {
    //         setLoading(true);
    //         getLoansByStatus('submitted')
    //             .then(data => {
    //                 setLoansData('submitted', data);
    //                 setLoading(false);
    //             })
    //             .catch(e => {
    //                 setLoading(false);
    //             })
    //     }
    // });
    const columns = useMemo(() => {
        return [
            {
                label: 'Owner Id',
                name: 'owner_id',
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
                name: 'name',
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
                    // setCellProps: () => ({
                    //     align: 'center',
                    // }),
                    customBodyRender: value => {
                        return <div>
                            {value ? value : '-'}
                        </div>
                    }
                }
            },
        ]
    }, [loans]);

    const options = {
        selectableRowsHeader: false,
        selectableRows: "none",
        print: false,
        filter: false,
        search: false,
        download: false,
        viewColumns: false,
        rowsPerPage: 3,
        isRowSelectable: () => false,
        selectableRowsHeader: false,
        
    };

    return (
        <div >
            {
                Array.isArray(loans) && loans.length ? (

                    <MUIDataTable
                        // title={title ? <Typography className={classes.title} variant="h4" component="h4">{title} </Typography> : null}
                        data={loans}
                        columns={columns}
                        options={options}
                    />
                ) : (
                    !loading && <Paper style={{ padding: 10 }}>No Submitted Records</Paper>
                )
            }
            {
                loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
            }
        </div>
    )
}

const mapStateToProps = ({ loans }) => ({
    loans: loans.submitted
});

const mapDispatchToProps = dispatch => ({
    setLoansData: (status, data) => dispatch(setLoansByStatus(status, data))
})


export default TransportOwnerTable;