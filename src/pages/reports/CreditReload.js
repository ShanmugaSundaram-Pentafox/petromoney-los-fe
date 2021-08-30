import React from 'react';
import { makeStyles } from '@material-ui/styles';
import usePageTitle from '../../hooks/usePageTitle';
import { useMemo } from 'react';
import { classes } from 'istanbul-lib-coverage';
import MUIDataTable from 'mui-datatables';
import { useState } from 'react';
import { useMount } from 'react-use';
import { getReport } from '../../services/users.service';
import Currency from '../../components/Number/Currency';
import { Paper } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { borderRadius, display } from '@material-ui/system';
import CachedIcon from '@material-ui/icons/Cached';
import { Dialog } from '@material-ui/core';
import { DialogTitle } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { DialogActions } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import ReplayIcon from '@material-ui/icons/Replay';
import { Tooltip } from '@material-ui/core';

const useStyes = makeStyles((theme) => ({
    root: {
    },
    
}))

const CreditReload = () => {
    const [loans, setLoans] = useState([])
    const [loading, setLoading] = useState(false)
    const [reloadDialog, setReloadDialog] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    useMount(async () => {
        setLoading(true)
        getReport()
          .then((data) => {
            setLoading(false);
            setLoans(data.overdue)
          })
          .catch((e) => {
            setLoading(false);
            console.log(e);
          });
      })

    const handleCreditReload = () => {
        setReloadDialog(true)
    }

    const handleClose = () => {
        setReloadDialog(false)
    }

    const handleSubmit = () => {
        setSubmitLoading(true)
        setTimeout(() => {
            window.location.reload();
        }, 3000)
    }


    usePageTitle('Credit Report')
    const columns = useMemo(() => {
        return[
            { name: 'applicant_name', label: 'Applicant Name' },
            { name: 'cust_code', label: 'Customer Code' },
            { name: 'cust_region', label: 'Customer Region' },
            { name: 'credit', label: 'Credit Reload', options: { 
                filter: false,
                customBodyRender: () => {
                    return (
                        <Tooltip title='credit reload'>
                            <Button variant='outlined' color='primary' className={classes.btn} startIcon={<CachedIcon fontSize='small'/>} size='small' onClick={handleCreditReload}>Reload Credit</Button>
                        </Tooltip>
                    )
                }
            }}
        ]
    }, [])

    const options = {
        selectableRowsHeader: false,
        selectableRows: 'none',
        rowsPerPage: 15,
        rowsPerPageOptions: [15, 20, 30],
    };

    return(
        <div className={classes.root}>
            {
                loading ? (
                <Grid item xs={12}>
                    <Skeleton variant="rect" width="100%" height={400} />
                </Grid>
                ) : (
                    <MUIDataTable
                        title={"Credit Reload Moderation"}
                        columns={columns}
                        options={options}
                        data={loans}
                    />
                )
            }
            <Dialog
            open={reloadDialog}
            onClose={handleClose}
            >
                <DialogTitle>Credit Reload Request</DialogTitle>
                <DialogContent style={{width: 450}}>
                    <Typography variant='h7'>Do you want to reload your credit?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose} disabled={submitLoading}>Cancel</Button>
                    {
                        submitLoading ? (
                            <CircularProgress size={30} />
                        ) : (
                            <Button variant='contained' style={{backgroundColor: '#50CB93', color: 'white'}} onClick={handleSubmit}>Submit</Button>
                        )
                    }
                </DialogActions>

            </Dialog>
        </div>
    )

}

export default CreditReload