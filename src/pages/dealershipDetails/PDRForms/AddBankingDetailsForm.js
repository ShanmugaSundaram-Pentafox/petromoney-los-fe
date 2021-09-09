import React, { Fragment, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput, { InputWrapper } from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { useMount } from 'react-use';
import { getBankDetailsbyID, updateBankDetailsByID } from '../../../services/PDReport.services';

const useStyles = makeStyles((theme) => ({
    sidePanelTitle: {
        // textAlign: 'center',
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 0,
        boxShadow: '0 1px 4px -3px #333'
    },
    sidePanelFormWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '80vw'
    },
    sidePanelFormContentWrapper: {
        flex: 1,
        overflow: 'auto'
    },
    sidePanelWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '40vw',
        padding: 14,
    },
    actionButtons: {
        // paddingTop: 8
    },
    tableRow: {
        cursor: 'pointer'
    },
    document: {
        display: 'inline-block',
        borderRadius: 2,
        lineHeight: 1,
    },
    table: {
        padding: 8,
        marginTop: 8
    },
    btnSuccess: {
        '&.MuiButton-contained': {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.white
        },
        '&.MuiButton-contained:hover': {
            backgroundColor: theme.palette.success.dark
        }
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
    },
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
    },
    subTitle: {
        marginTop: 8,
        marginBottom: 8

    },
    editButton: {
        marginRight: '8px',
        '&.MuiButton-contained': {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.white
        },
        '&.MuiButton-contained:hover': {
            backgroundColor: theme.palette.success.dark
        }
    }

}))

const AddBankingDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [bankData, setBankData] = useState([])
    const [addNew, setAddNew] = useState(bankData ? false : true)
    const [tankerData, setTankerData] = useState([])
    const [editable, setEditable] = useState(true)
    const [addNewRow, setAddNewRow] = useState();
    const [apiData, setApiData] = useState({});
    const [editRow, setEditRow] = useState({});

    useMount(() => {
        getBankDetailsbyID(dealer_id)
            .then(data => {
                setBankData(data)
            })
            .catch((e) => {
                console.log(e);
            })
    })
    const editBankRow = (rowData, rowIndex) => {
        setEditRow({ ...rowData, rowIndex });
    }
    const deleteBankRow = (row, index) => {
        // deleteTanker(row, dealer_id)
        //     .then(data => {
        //         console.log(data)
        //     })
        //     .catch((e) => {
        //         console.log(e);
        //     })

    }


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: {},
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),

        }),
        onSubmit: values => {
            updateBankDetailsByID(values, dealer_id)
                .then(res => {
                    console.log(res)
                    enqueueSnackbar(res, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'success',
                    }
                    )
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500);

                })
                .catch(e => {
                    enqueueSnackbar(e, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'error',
                    }
                    )
                })
        }
    });
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentYearDiff = date.getFullYear() - 1970;
    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    const saveEditRow = (data, i) => {
        updateBankDetailsByID(data, dealer_id)
            .then(res => {
                setTankerData(res);
                setEditRow({});
            })
            .catch(err => {
                console.log('Sales data save error - ', err);
            })
    }
    const onEditTextChange = e => {
        const { name, value } = e.target;
        setEditRow({
            ...editRow,
            [name]: value
        })
    }
    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add Banking &amp; Loan Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => { setAddNewRow(!addNewRow) }}
                        style={{ marginBottom: 12 }}
                    >
                        Add Bank
                    </Button>

                    <Table className={classes.table} size="small" aria-label="Income">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Account Holder name</TableCell>
                                <TableCell align="left">Bank name</TableCell>
                                <TableCell align="left">Account No.</TableCell>
                                <TableCell align="left">Branch</TableCell>
                                <TableCell align="left">IFSC</TableCell>
                                <TableCell align="left">Account Type</TableCell>
                                <TableCell align="left">Account since</TableCell>
                                <TableCell align="left">Transaction limit</TableCell>
                                <TableCell align="left">security</TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                bankData?.map((row, i) => i === editRow?.rowIndex ? (
                                    <TableRow key={`edit-row-${i}`}>
                                        <TableCell md={6}>
                                            <TextInput
                                                label="Account Holder name"
                                                name="account_name"
                                                value={values.account_name}
                                                error={errors.account_name}
                                                helperText={errors.account_name}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell md={6}>
                                            <TextInput
                                                label="Name of the Bank"
                                                name="bank_name"
                                                value={values.bank_name}
                                                error={errors.bank_name}
                                                helperText={errors.bank_name}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell md={6}>
                                            <TextInput
                                                label="Account Number"
                                                name="account_no"
                                                value={editRow.account_no}
                                                error={errors.account_no}
                                                helperText={errors.account_no}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell md={6}>
                                            <TextInput
                                                label="Account Number"
                                                name="bank_branch"
                                                value={editRow.bank_branch}
                                                error={errors.bank_branch}
                                                helperText={errors.bank_branch}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell md={6}>
                                            <TextInput
                                                label="IFSC"
                                                name="ifsc"
                                                value={editRow.ifsc}
                                                error={errors.ifsc}
                                                helperText={errors.ifsc}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell md={6}>
                                            <TextInput
                                                label="Account Type"
                                                name="account_type"
                                                value={editRow.account_type}
                                                error={errors.account_type}
                                                helperText={errors.account_type}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell md={6}>
                                            <TextInput
                                                select
                                                label="Account since"
                                                name="account_since"
                                                value={editRow.account_since}
                                                error={errors.account_since}
                                                onChange={onEditTextChange}
                                                helperText={errors.account_since}
                                            >
                                                {
                                                    <>
                                                        <option value="null">Vintage with bank</option>
                                                        {[...Array(currentYearDiff)].map((_, i) => {
                                                            return (
                                                                <option value={currentYear - i}>{currentYear - i}</option>
                                                            )
                                                        })}
                                                    </>
                                                }
                                            </TextInput>
                                        </TableCell>
                                        <TableCell md={6}>
                                            <TextInput
                                                money
                                                label="Transaction Limit"
                                                name="transaction_limit"
                                                value={editRow.transaction_limit}
                                                error={errors.transaction_limit}
                                                helperText={errors.transaction_limit}
                                            />
                                        </TableCell>
                                        <TableCell item md={6}>
                                            <TextInput
                                                select
                                                labelText="Is Secured"
                                                name="security"
                                                value={editRow.security}
                                                error={errors.security}
                                                helperText={errors.security}
                                            >
                                                <option>Secured</option>
                                                <option>Unsecured</option>
                                            </TextInput>
                                        </TableCell>
                                        {/* <TableCell>
                                            <TextInput
                                                label="Tanker number"
                                                name="vehicle_no"
                                                value={editRow.vehicle_no}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                select
                                                label="Tanker type"
                                                name="tanker_type"
                                                value={editRow.tanker_type}
                                                onChange={onEditTextChange}
                                            >
                                                <option>Owned</option>
                                                <option>Rented</option>
                                            </TextInput>
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                label="Tanker capacity in liters"
                                                name="tanker_capacity"
                                                value={editRow.tanker_capacity}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                label="Operational hours"
                                                name="operation_hours"
                                                value={editRow.operation_hours}
                                                onChange={onEditTextChange}
                                            />
                                        </TableCell> */}
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="success"
                                                className={classes.btnSuccess}
                                                onClick={() => saveEditRow(editRow, i)}>
                                                Save
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => {
                                                    setEditRow({});
                                                }}>
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow key={i}>
                                        <TableCell align="left">{row.account_name}</TableCell>
                                        <TableCell align="left">{row.bank_name}</TableCell>
                                        <TableCell align="left">{row.account_no}</TableCell>
                                        <TableCell align="left">{row.bank_branch}</TableCell>
                                        <TableCell align="left">{row.ifsc}</TableCell>
                                        <TableCell align="left">{row.account_type}</TableCell>
                                        <TableCell align="left">{row.account_since}</TableCell>
                                        <TableCell align="left">{row.bank_branch}</TableCell>
                                        <TableCell align="right">
                                            {
                                                editable ? (
                                                    <>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="success"
                                                            className={classes.btnSuccess}
                                                            onClick={() => editBankRow(row, i)}>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="success"
                                                            className={classes.btnSuccess}
                                                            onClick={() => deleteBankRow(row, i)}>
                                                            Delete
                                                        </Button>
                                                    </>
                                                ) : null
                                            }

                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {
                                addNewRow && (
                                    <TableRow key={"new-row"}>
                                        <TableCell>
                                            <TextInput
                                                label="Tanker number"
                                                name="vehicle_no"
                                                value={values.vehicle_no}
                                                onChange={handleChange}
                                            >
                                            </TextInput>
                                        </TableCell>
                                        <TableCell>
                                            <TextInput
                                                select
                                                label="Tanker Type"
                                                name="tanker_type"
                                                value={values.tanker_type}
                                                onChange={handleChange}
                                            >
                                                <option>Owned</option>
                                                <option>Rented</option>
                                            </TextInput>
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            <TextInput
                                                label="Tanker_capacity"
                                                name="tanker_capacity"
                                                value={values.tanker_capacity}
                                                onChange={handleChange}
                                            />
                                        </TableCell>
                                        <TableCell >
                                            <TextInput
                                                label="Operation hours"
                                                name="operation_hours"
                                                value={values.operation_hours}
                                                onChange={handleChange}
                                            />
                                        </TableCell>
                                        <TableCell align={"right"}></TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>

                    {/* {

                        bankData && (
                            <>
                                <div className={classes.table}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Bank name</TableCell>
                                                <TableCell align="left">Account No.</TableCell>
                                                <TableCell align="left">IFSC</TableCell>
                                                <TableCell align="left">Account since</TableCell>
                                                <TableCell align="left">Transaction limit</TableCell>
                                                <TableCell align="left">Branch</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {
                                            bankData.map((row, i) => {
                                                return (
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="left">{row.bank_name}</TableCell>
                                                            <TableCell align="left">{row.account_no}</TableCell>
                                                            <TableCell align="left">{row.ifsc}</TableCell>
                                                            <TableCell align="left">{row.account_since}</TableCell>
                                                            <TableCell align="left">{row.transaction_limit}</TableCell>
                                                            <TableCell align="left">{row.bank_branch}</TableCell>
                                                            <TableCell align="right">
                                                                {
                                                                    editable ? (
                                                                        <>
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="success"
                                                                                className={classes.btnSuccess}
                                                                                onClick={() => editBankRow(row, i)}>
                                                                                Edit
                                                                            </Button>
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="success"
                                                                                className={classes.btnSuccess}
                                                                                onClick={() => deleteBankRow(row, i)}>
                                                                                Delete
                                                                            </Button>
                                                                        </>
                                                                    ) : null
                                                                }
                                                            </TableCell>

                                                        </TableRow>
                                                    </TableBody>
                                                )
                                            })
                                        }
                                    </Table>
                                </div>
                            </>
                        )
                    } */}

                </div>
            </div>
            <div className={classes.actionFooter}>
                <Divider />
                <div className={classes.actionButtonsWrapper}>
                    <div>
                        <Button
                            variant="outlined"
                            startIcon={<NavigateBeforeRoundedIcon />}
                            // disabled={loading}
                            onClick={handleClose}
                        >
                            Back
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            type="submit"
                            className={clsx(classes.btn, classes.editButton)}
                            startIcon={!readOnly ? <NavigateNextRounded /> : <EditIcon />}
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div >


    )
}

export default AddBankingDetailsForm;