import React, {useState} from 'react'
import { Box, Button, Divider, Drawer, Grid, IconButton, TableCell, makeStyles, Table, TableBody, TableFooter, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import TextInput from '../../../components/TextInput/TextInput';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import Currency from '../../../components/Number/Currency';
import { getPastYears, getMonth as month } from '../../../utils/commonFunctions.util';
import { compareObject } from '../../../utils/compareObject.util';

const useStyles = makeStyles((theme) => ({
    sidePanelFormWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '80vw'
    },
    sidePanelTitle: {
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 0,
        boxShadow: '0 1px 4px -3px #333'
    },
    sidePanelFormContentWrapper: {
        flex: 1,
        overflow: 'auto',
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8,
    },
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
    },
    btnDelete: {
        '&.MuiButton-root': { color: "#ef5350" },
        border: "1px #ef5350 solid",
        margin: 2
    },
    btnEdit: {
        '&.MuiButton-root': { color: "#2196f3" },
        border: "1px #2196f3 solid",
        margin: 2
    },
    sidePanelWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '40vw'
    },
}))

const StatementForm = ({callback, rowData, addStatement, updateStatement, deleteStatement, id}) => {
    const classes = useStyles()
    const [openEdit, setOpenEdit] = useState(false)
    const [disabled, setDisabled] = useState(addStatement?.action === 'view')
    const [editRow, setEditRow] = useState({})
    const [addData, setAddData] = useState(rowData)
    const [statementRow, setStatementRow] = useState([{month:"",year:"",in_bound:"",out_bound:"",credits_total:"",no_of_credits:"",debits_total:"",no_of_debits:"",omc_transaction:""}])
    const LastThreeYear = getPastYears(3)
    
    const handleInputChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...statementRow];
        list[index][name] = value;
        setStatementRow(list)
    }

    const handleAddClick = () => {
        setStatementRow([...statementRow, {month:"",year:"",in_bound:"",out_bound:"",credits_total:"",no_of_credits:"",debits_total:"",no_of_debits:"",omc_transaction:""}])
    }

    const handleRemoveClick = (i) => {
        const list = [...statementRow]
        list.splice(i, 1)
        setStatementRow(list)
    }

    const onTextChange = (e) => {
        const {name, value} = e.target;
        setEditRow({...editRow, [name]: value})
    }

    const handleEdit = () => {
        const updateData = { id: rowData?.id, statement: [editRow]}
        updateStatement(updateData)
        setOpenEdit(false)
        setEditRow({})
        callback(false)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setAddData({...addData, [name]: value})
    }

    const handleSave = () => {
        const postData = {...addData, statement: statementRow}
        if(rowData){
            let obj = compareObject(rowData, postData)
            if(obj.statement[0]?.month != "" || obj.account_holder_name || obj.account_no || obj.account_type || obj.bank_name){
                updateStatement({id:rowData.id, ...obj})
                callback(false)
            }
        } else {
            if(addData){
                updateStatement(postData)
                callback(false)
            }
        }
    }

    const handleDelete = (id) => {
        deleteStatement({statement: [id]})
        callback(false)
    }

    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add Bank Statement</div>
                <CloseIcon fontSize='size' onClick={() => callback({open: false})}/>
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <label>Account Holder Name</label>
                            <TextInput
                                name="account_holder_name"
                                value={addData?.account_holder_name}
                                disabled={disabled}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <label>Account No</label>
                            <TextInput
                                type="number"
                                name="account_no"
                                value={addData?.account_no}
                                disabled={disabled}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <label>Bank Name</label>
                            <TextInput
                                name="bank_name"
                                value={addData?.bank_name}
                                disabled={disabled}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <label>Account Type</label>
                            <TextInput
                                select
                                name="account_type"
                                value={addData?.account_type}
                                disabled={disabled}
                                onChange={handleChange}
                            >
                                <option value="">Choose Account Type</option>
                                <option value="current">Current</option>
                                <option value="cash_credit">Cash Credit</option>
                                <option value="overdraft">Overdraft</option>
                                <option value="edfs">EDFS</option>
                            </TextInput>
                        </Grid>
                    </Grid>
                    <div style={{marginTop: 20}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography variant="h6">Statement</Typography>
                        </div>
                        <div style={{marginTop: 10}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Month</TableCell>
                                        <TableCell>No of I/W Bounce</TableCell>
                                        <TableCell>No of O/W Bounce</TableCell>
                                        <TableCell>Credits</TableCell>
                                        <TableCell>No of Credits</TableCell>
                                        <TableCell>Debits</TableCell>
                                        <TableCell>No of Debits</TableCell>
                                        <TableCell>OMC Transaction</TableCell>
                                        {!disabled && (<TableCell>Action</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        rowData?.statement?.map((item, i) =>  (
                                                <TableRow key={item.statement_id}>
                                                    <TableCell scope="row" component="th">{month?.find(type => {return type.value === item.month})?.label} - {item.year}</TableCell>
                                                    <TableCell align="center">{item.in_bound}</TableCell>
                                                    <TableCell align="center">{item.out_bound}</TableCell>
                                                    <TableCell align="center"><Currency value={item.credits_total}/></TableCell>
                                                    <TableCell align="center">{item.no_of_credits}</TableCell>
                                                    <TableCell align="center"><Currency value={item.debits_total}/></TableCell>
                                                    <TableCell align="center">{item.no_of_debits}</TableCell>
                                                    <TableCell align="center"><Currency value={item.omc_transaction}/></TableCell>
                                                    {
                                                        !disabled && (
                                                            <TableCell align="right">
                                                                <Button size="small" variant="outlined" className={classes.btnEdit} onClick={()=>{setEditRow({...item}); setOpenEdit(true)}}>Edit</Button>
                                                                <Button size="small" variant="outlined" className={classes.btnDelete} onClick={() => handleDelete(item.statement_id)}>Delete</Button>
                                                            </TableCell>
                                                        )
                                                    }
                                                </TableRow>
                                            )
                                        )
                                    }
                                    {
                                        !disabled && (
                                            statementRow?.map((x, i) => (
                                                <TableRow key={'new_row'}>
                                                <TableCell scope="row" component="th">
                                                    <TextInput
                                                        select
                                                        fullWidth={true}
                                                        label="Month"
                                                        name="month"
                                                        type="number"
                                                        value={x?.month}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    >
                                                        <option value=" ">Choose month</option>
                                                        {
                                                            month.map((item, i) => {
                                                                return (
                                                                <option value={item?.value}>{item?.label}</option>
                                                                )
                                                            })
                                                        }
                                                    </TextInput>
                                                    -
                                                    <TextInput
                                                        select
                                                        fullWidth={true}
                                                        label="Year"
                                                        name="year"
                                                        type="number"
                                                        value={x?.year}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    >
                                                        <option value=" ">Choose year</option>
                                                        {
                                                            LastThreeYear.map(item => {
                                                                return <option value={item}>{item}</option>
                                                            })
                                                        }
                                                    </TextInput>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="I/W Bounce"
                                                        name="in_bound"
                                                        type="number"
                                                        value={x?.in_bound}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="O/W Bounce"
                                                        name="out_bound"
                                                        type="number"
                                                        value={x?.out_bound}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="Credits"
                                                        name="credits_total"
                                                        type="number"
                                                        value={x?.credits_total}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="No.Credits"
                                                        name="no_of_credits"
                                                        type="number"
                                                        value={x?.no_of_credits}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="Debits"
                                                        name="debits_total"
                                                        type="number"
                                                        value={x?.debits_total}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="No.Debits"
                                                        name="no_of_debits"
                                                        type="number"
                                                        value={x?.no_of_debits}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="OMC Transaction"
                                                        name="omc_transaction"
                                                        type="number"
                                                        value={x?.omc_transaction}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    {statementRow.length !== 1 && <Button size="small" variant="outlined" className={classes.btnDelete} onClick={() => handleRemoveClick(i)}>Remove</Button>}
                                                    {statementRow.length - 1 === i && <Button size="small" variant="outlined" color="primary" style={{margin:2}} onClick={handleAddClick}>Add</Button>}
                                                </TableCell>
                                            </TableRow>
                                            ))
                                        )
                                    }
                                </TableBody>
                                {
                                    disabled && (
                                        <TableFooter>
                                            <TableRow style={{backgroundColor: '#f2f2f0'}}>
                                                <TableCell><strong>Total</strong></TableCell>
                                                <TableCell align="center"><strong>{rowData?.in_bound_total}</strong></TableCell>
                                                <TableCell align="center"><strong>{rowData?.out_bound_total}</strong></TableCell>
                                                <TableCell align="center"><strong><Currency value={rowData?.credits_total_sum}/></strong></TableCell>
                                                <TableCell align="center"><strong>{rowData?.total_no_of_credits}</strong></TableCell>
                                                <TableCell align="center"><strong><Currency value={rowData?.debits_total_sum}/></strong></TableCell>
                                                <TableCell align="center"><strong>{rowData?.total_no_of_debits}</strong></TableCell>
                                                <TableCell align="center"><strong><Currency value={rowData?.total_omc_transaction}/></strong></TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    )
                                }
                            </Table>
                        </div>
                    </div>
                    {
                        disabled && (
                            <div style={{marginTop: 20}}>
                                <Table style={{width: 250}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>I/W Bounce %</TableCell>
                                            <TableCell>O/W Bounce %</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{parseInt(rowData?.in_bound_percent).toFixed(2)}</TableCell>
                                            <TableCell>{parseInt(rowData?.out_bound_percent).toFixed(2)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={classes.actionFooter}>
                <Divider />
                <div className={classes.actionButtonsWrapper}>
                    <div>
                        <Button variant="outlined" startIcon={<NavigateBeforeRoundedIcon />} onClick={() => callback(false)}>Back</Button>
                    </div>
                    <div>
                        <Button variant="contained" color="primary" onClick={() => disabled ? setDisabled(!disabled) : handleSave()} style={{ marginBottom: 12 }}>{disabled ? "Edit" : "Save"}</Button>
                    </div>
                </div>
            </div>
            <Drawer
            anchor="right"
            open={openEdit}
            onClose={() => {setEditRow({}); setOpenEdit(false)}}
            variant="temporary"
            >
                <div className={classes.sidePanelWrapper}>
                <Typography className={classes.sidePanelTitle} variant="h4">
                    <div>Edit Statement</div>
                    <CloseIcon fontSize='size' onClick={() => {setEditRow({}); setOpenEdit(false)}}/>
                </Typography>
                    <div className={classes.sidePanelFormContentWrapper}>
                        <div className={classes.stepperRoot}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        label="I/W Bounce"
                                        name="in_bound"
                                        type="number"
                                        onChange={onTextChange}
                                        value={editRow.in_bound}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="O/W Bounce"
                                        name="out_bound"
                                        type="number"
                                        onChange={onTextChange}
                                        value={editRow.out_bound}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="Credits"
                                        name="credits_total"
                                        type="number"
                                        onChange={onTextChange}
                                        value={editRow.credits_total}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="No.Credits"
                                        name="no_of_credits"
                                        type="number"
                                        onChange={onTextChange}
                                        value={editRow.no_of_credits}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="Debits"
                                        name="debits_total"
                                        type="number"
                                        onChange={onTextChange}
                                        value={editRow.debits_total}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="No.Debits"
                                        name="no_of_debits"
                                        type="number"
                                        onChange={onTextChange}
                                        value={editRow.no_of_debits}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        label="OMC Transaction"
                                        name="omc_transaction"
                                        type="number"
                                        onChange={onTextChange}
                                        value={editRow.omc_transaction}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                        <div className={classes.actionFooter}>
                            <Divider />
                            <div className={classes.actionButtonsWrapper}>
                                <div>
                                    <Button variant="outlined" startIcon={<NavigateBeforeRoundedIcon />} onClick={() => {setEditRow({}); setOpenEdit(false)}}>Back</Button>
                                </div>
                                <div>
                                    <Button variant="contained" color="primary" onClick={handleEdit} style={{ marginBottom: 12 }}>Save</Button>
                                </div>
                            </div>
                        </div>
                </div>
            </Drawer> 
        </div>
    )
}

export default StatementForm;
