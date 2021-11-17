import React, {useState} from 'react'
import { Button, Drawer, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import PreviewCard from '../CommonComponents/Cards/PreviewCard'
import { ViewData } from '../CommonComponents/FilePreview'
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/List';
import StatementForm from '../../pages/dealershipDetails/components/StatementForm'
import { useMount } from 'react-use'


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
    }
}))

const StatementTable = ({ addStatement, callback }) => {
    const classes = useStyles()
    const [testData, setTestData] = useState([])
    const [testRowData, setTestRowData] = useState()

    // useMount(() => {
    //     fetch("http://localhost:3333/data")
    //     .then(res => {
    //         return res.json()
    //     })
    //     .then(data => {
    //         setTestData(data)
    //     })
    // });

    return (
        <>
            <div className={classes.root}>
                {
                    testData?.map((item, i) => {
                        return (
                            <div className={classes.card}>
                                <div className={classes.content}>
                                    <ViewData title="Account Holder Name" value={item.account_holder} />
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
            </div>
            <Drawer
            anchor="right"
            open={addStatement?.open}
            onClose={() => {callback({open: false}); setTestRowData()}}
            variant="temporary"
            >
                <StatementForm callback={() => {callback(); setTestRowData()}} rowData={testRowData} addStatement={addStatement}/>
            </Drawer>   
      </>
    )
}

export default StatementTable;