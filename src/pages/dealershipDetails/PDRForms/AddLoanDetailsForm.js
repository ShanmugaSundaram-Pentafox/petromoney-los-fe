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
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { useMount } from 'react-use';
import { getBankDetailsbyID, getLoanDetailsbyID, updateBankDetailsByID, updateLoanDetailsByID } from '../../../services/PDReport.services';

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
        width: '55vw'
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

const AddLoanDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [bankData, setBankData] = useState([])
    const [addNew, setAddNew] = useState(bankData ? false : true)
    // const [tankerData, setTankerData] = useState([])
    // const [editable, setEditable] = useState(true)
    // const [addNewRow, setAddNewRow] = useState();
    // const [apiData, setApiData] = useState({});
    // const [editRow, setEditRow] = useState({});

    useMount(() => {
        getLoanDetailsbyID(dealer_id)
            .then(data => {
                setBankData(data)
            })
            .catch((e) => {
                console.log(e);
            })
    })


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
            updateLoanDetailsByID(values, dealer_id)
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
    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add Loan Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => { setAddNew(!addNew) }}
                        style={{ marginBottom: 12 }}
                    >
                        Add Loan
                    </Button>
                    {
                        addNew && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item md={6}>
                                        <TextInput
                                            {...inputProps}
                                            select
                                            labelText="Loan Type"
                                            name="loan_type"
                                            value={values.loan_type}
                                            error={errors.loan_type}
                                            helperText={errors.loan_type}
                                        >
                                            <option value="">Choose type</option>
                                            <option>Bank</option>
                                            <option>Finance</option>
                                            <option>Monthly EMI</option>
                                        </TextInput>
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            {...inputProps}
                                            labelText="Bank Name"
                                            name="bank_name"
                                            value={values.bank_name}
                                            error={errors.bank_name}
                                            helperText={errors.bank_name}
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            {...inputProps}
                                            labelText="Loan amount"
                                            name="loan_amount"
                                            value={values.loan_amount}
                                            error={errors.loan_amount}
                                            helperText={errors.loan_amount}
                                        />
                                    </Grid>
                                </Grid>
                            </Box >
                        )
                    }
                    {
                        bankData && (
                            <>
                                <div className={classes.table}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Loan Type</TableCell>
                                                <TableCell align="left">Bank Name</TableCell>
                                                <TableCell align="left">Amount</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {
                                            bankData.map((row, i) => {
                                                return (
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="left">{row.loan_type}</TableCell>
                                                            <TableCell align="left">{row.bank_name}</TableCell>
                                                            <TableCell align="left">{row.loan_amount}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                )
                                            })
                                        }
                                    </Table>
                                </div>
                            </>
                        )
                    }

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

export default AddLoanDetailsForm;