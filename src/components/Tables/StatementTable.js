import React, {useState} from 'react'
import { Button, Drawer, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { ViewData } from '../CommonComponents/FilePreview'
import ListIcon from '@material-ui/icons/List';
import StatementForm from '../../pages/dealershipDetails/components/StatementForm'
import { useQuery, useMutation } from 'react-query';
import { deleteBankStatementById, getAllBankStatementByDealershipId, updateBankStatementById } from '../../services/dealerships.service'
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    content: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    card: {
        margin: 5,
        padding: 8,
        border: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        width: 500,
        borderRadius: 3,
        cursor: 'pointer',
        transition: '.3s',
        '&:hover': {
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px'
        }
    },
    action: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 8
    },
    btns: {
        marginLeft: 5
    },
}))

const StatementTable = ({ addStatement, callback, id }) => {
    const classes = useStyles()
    const [testData, setTestData] = useState([])
    const [testRowData, setTestRowData] = useState()
    const { enqueueSnackbar } = useSnackbar();


    const bankStatement = useQuery(`bank_statement-${id}`, () => {return getAllBankStatementByDealershipId(id)}, {
        onError: (error) => {
            console.log(error);
        }
    })
    // console.log(bankStatement.data.length);

    const { mutate: updateStatement } = useMutation(data => updateBankStatementById(id, data) , {
        onSuccess: (message) => {
            bankStatement.refetch()
            enqueueSnackbar(message.message, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'success',
            });
        },
        onError: (message) => {
            console.log(message);
        }
    })

    const { mutate: deleteStatement } = useMutation(data => deleteBankStatementById(id, data) , {
        onSuccess: (message) => {
            bankStatement.refetch()
            enqueueSnackbar(message.message, {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                variant: 'success',
            });
        },
        onError: (message) => {
            console.log(message);
        }
    })

    return (
        <>
            <div className={classes.root}>
                {
                    bankStatement.data?.map((item, i) => {
                        return (
                            <div className={classes.card}>
                                <div className={classes.content}>
                                    <ViewData title="Account Holder Name" value={item.account_holder_name} />
                                    <ViewData title="Account No" value={item.account_no} />
                                    <ViewData title="Bank Name" value={item.bank_name} />
                                    <ViewData title="Type of Account" value={item.account_type} />
                                </div>
                                <div className={classes.action}>
                                    <Button variant="outlined" size='small' className={classes.btns} onClick={() => {callback({open: true, action: 'view'}); setTestRowData(item);}} startIcon={<ListIcon color='primary' />}>View</Button>
                                </div>
                            </div>
                        )
                    })
                }
                { bankStatement.isLoading && (<CircularProgress size={30}/>)}
            </div>
            <Drawer
            anchor="right"
            open={addStatement?.open}
            onClose={() => {callback({open: false}); setTestRowData()}}
            variant="temporary"
            >
                <StatementForm callback={() => {callback(); setTestRowData()}} rowData={testRowData} addStatement={addStatement} updateStatement={updateStatement} deleteStatement={deleteStatement} id={id} />
            </Drawer>   
      </>
    )
}

export default StatementTable;