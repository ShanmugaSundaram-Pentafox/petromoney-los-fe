import React, {useState} from 'react'
import { Box, Button, Divider, Grid, IconButton, makeStyles, Table, TableBody, TableFooter, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import TextInput from '../../../components/TextInput/TextInput';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { TableCell } from '@material-ui/core';
import Currency from '../../../components/Number/Currency';
import { getPastYears, getMonth as month } from '../../../utils/commonFunctions.util';

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
}))

const StatementForm = ({callback, rowData, addStatement}) => {
    const classes = useStyles()
    const [disabled, setDisabled] = useState(addStatement?.action === 'view')
    const [editRow, setEditRow] = useState({})
    const [statementRow, setStatementRow] = useState([{month:"",year:"",i_w:"",o_w:"",credits:"",no_credits:"",debits:"",no_debits:"",omc_transaction:""}])
    const LastThreeYear = getPastYears(3)
    const sumOf = (array, key) => {
        let sumArray = []
        var sum = (r, a) => r.map((b, i) => a[i] + b);
        let value = array?.reduce((result, currentValue) => {sumArray.push([currentValue[key]])}, 0);
        return sumArray.length && sumArray?.reduce(sum)
    };
    const [total, setTotal] = useState({
        i_w:sumOf(rowData?.statement, 'i_w'),
        o_w:sumOf(rowData?.statement, 'o_w'),
        credits:sumOf(rowData?.statement, 'credits'),
        no_credits:sumOf(rowData?.statement, 'no_credits'),
        debits:sumOf(rowData?.statement, 'debits'),
        no_debits:sumOf(rowData?.statement, 'no_debits'),
        omc_transaction:sumOf(rowData?.statement, 'omc_transaction'),
        i_wBounce: sumOf(rowData?.statement, 'i_w')/sumOf(rowData?.statement, 'no_credits')*100,
        o_wBounce: sumOf(rowData?.statement, 'o_w')/sumOf(rowData?.statement, 'no_debits')*100,
    })
    
    const handleInputChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...statementRow];
        list[index][name] = value;
        setStatementRow(list)
    }

    const handleAddClick = () => {
        setStatementRow([...statementRow, {month:"",year:"",i_w:"",o_w:"",credits:"",no_credits:"",debits:"",no_debits:"",omc_transaction:""}])
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
                                value={rowData?.account_holder}
                                disabled={disabled}
                                // error={errors[item.key]}
                                // helperText={errors[item.key]}
                                // type={item.type}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <label>Account No</label>
                            <TextInput
                                type="number"
                                name="account_no"
                                value={rowData?.account_no}
                                disabled={disabled}
                                // error={errors[item.key]}
                                // helperText={errors[item.key]}
                                // type={item.type}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <label>Bank Name</label>
                            <TextInput
                                name="bank_name"
                                value={rowData?.bank_name}
                                disabled={disabled}
                                // error={errors[item.key]}
                                // helperText={errors[item.key]}
                                // type={item.type}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <label>Account Type</label>
                            <TextInput
                                select
                                name="account_type"
                                value={rowData?.account_type}
                                disabled={disabled}
                                // error={errors[item.key]}
                                // helperText={errors[item.key]}
                                // type={item.type}
                            >
                                <option value=" ">Choose Account Type</option>
                                <option value=" ">Current</option>
                                <option value=" ">Cash Credit</option>
                                <option value=" ">Overdraft</option>
                                <option value=" ">EDFS</option>
                            </TextInput>
                        </Grid>
                    </Grid>
                    <div style={{marginTop: 20}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography variant="h6">Statement</Typography>
                            {/* <Button variant='outlined' color='secondary' size='small' onClick={() => setAddNewRow(true)}>Add</Button> */}
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
                                        rowData?.statement?.map((item, i) => i === editRow?.i ? (
                                            <TableRow key={`edit-row-${i}`}>
                                                <TableCell scope="row" component="th">
                                                    <TextInput
                                                        select
                                                        fullWidth={true}
                                                        disabled={true}
                                                        label="Month"
                                                        name="month"
                                                        type="number"
                                                        value={editRow.month}
                                                        onChange={onTextChange}
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
                                                        disabled={true}
                                                        label="Year"
                                                        name="year"
                                                        type="number"
                                                        value={editRow.year}
                                                        onChange={onTextChange}
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
                                                        name="i_w"
                                                        type="number"
                                                        value={editRow.i_w}
                                                        onChange={onTextChange}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="O/W Bounce"
                                                        name="o_w"
                                                        type="number"
                                                        value={editRow.o_w}
                                                        onChange={onTextChange}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="Credits"
                                                        name="credits"
                                                        type="number"
                                                        value={editRow.credits}
                                                        onChange={onTextChange}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="No.Credits"
                                                        name="no_credits"
                                                        type="number"
                                                        value={editRow.no_credits}
                                                        onChange={onTextChange}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="Debits"
                                                        name="debits"
                                                        type="number"
                                                        value={editRow.debits}
                                                        onChange={onTextChange}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="No.Debits"
                                                        name="no_debits"
                                                        type="number"
                                                        value={editRow.no_debits}
                                                        onChange={onTextChange}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="OMC Transaction"
                                                        name="omc_transaction"
                                                        type="number"
                                                        value={editRow.omc_transaction}
                                                        onChange={onTextChange}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button variant="outlined" size="small" >Save</Button>
                                                    <Button variant="outlined" size="small" onClick={() => setEditRow({})}>Cancel</Button>
                                                    {/* <IconButton color='primary' style={{color: '#1EAE98'}}><SaveIcon fontSize="small" /></IconButton> */}
                                                    {/* <IconButton style={{color: '#FF4848'}} onClick={()=>setEditRow({})}><CloseIcon fontSize="small" /></IconButton> */}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                                <TableRow key={i}>
                                                    <TableCell scope="row" component="th">{month?.find(type => {return type.value === item.month})?.label} - {item.year}</TableCell>
                                                    <TableCell align="center">{item.i_w}</TableCell>
                                                    <TableCell align="center">{item.o_w}</TableCell>
                                                    <TableCell align="center"><Currency value={item.credits}/></TableCell>
                                                    <TableCell align="center">{item.no_credits}</TableCell>
                                                    <TableCell align="center"><Currency value={item.debits}/></TableCell>
                                                    <TableCell align="center">{item.no_debits}</TableCell>
                                                    <TableCell align="center"><Currency value={item.omc_transaction}/></TableCell>
                                                    {
                                                        !disabled && (
                                                            <TableCell align="right">
                                                                <Button size="small" variant="outlined" className={classes.btnEdit} onClick={()=>setEditRow({...item, i})}>Edit</Button>
                                                                <Button size="small" variant="outlined" className={classes.btnDelete}>Delete</Button>
                                                                {/* <Tooltip title="Edit"><IconButton size="small" onClick={() => setEditRow({...item, i})}><EditIcon fontSize="small"/></IconButton></Tooltip> */}
                                                                {/* <Tooltip title="Remove"><IconButton size="small"><CloseIcon fontSize="small"/></IconButton></Tooltip> */}
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
                                                        name="i_w"
                                                        type="number"
                                                        value={x?.i_w}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="O/W Bounce"
                                                        name="o_w"
                                                        type="number"
                                                        value={x?.o_w}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="Credits"
                                                        name="credits"
                                                        type="number"
                                                        value={x?.credits}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="No.Credits"
                                                        name="no_credits"
                                                        type="number"
                                                        value={x?.no_credits}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="Debits"
                                                        name="debits"
                                                        type="number"
                                                        value={x?.debits}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextInput
                                                        label="No.Debits"
                                                        name="no_debits"
                                                        type="number"
                                                        value={x?.no_debits}
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
                                                <TableCell align="center"><strong>{total?.i_w}</strong></TableCell>
                                                <TableCell align="center"><strong>{total?.o_w}</strong></TableCell>
                                                <TableCell align="center"><strong><Currency value={total?.credits}/></strong></TableCell>
                                                <TableCell align="center"><strong>{total?.no_credits}</strong></TableCell>
                                                <TableCell align="center"><strong><Currency value={total?.debits}/></strong></TableCell>
                                                <TableCell align="center"><strong>{total?.no_debits}</strong></TableCell>
                                                <TableCell align="center"><strong><Currency value={total?.omc_transaction}/></strong></TableCell>
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
                                            <TableCell>{total?.i_wBounce.toFixed(2)}</TableCell>
                                            <TableCell>{total?.o_wBounce.toFixed(2)}</TableCell>
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
                        <Button variant="contained" color="primary" onClick={() => setDisabled(!disabled)} style={{ marginBottom: 12 }}>{disabled ? "Edit" : "Save"}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatementForm;
