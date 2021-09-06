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
            console.log("values", values)
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
                        onClick={() => { setAddNew(!addNew) }}
                        style={{ marginBottom: 12 }}
                    >
                        Add Bank
                    </Button>
                    {
                        addNew && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item md={6}>
                                        <TextInput
                                            {...inputProps}
                                            labelText="Name of the Bank"
                                            name="bank_name"
                                            value={values.bank_name}
                                            error={errors.bank_name}
                                            helperText={errors.bank_name}
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            {...inputProps}
                                            labelText="Account Number"
                                            name="account_no"
                                            value={values.account_no}
                                            error={errors.account_no}
                                            helperText={errors.account_no}
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            {...inputProps}
                                            labelText="Account Type"
                                            name="aacount_type"
                                            value={values.aacount_type}
                                            error={errors.aacount_type}
                                            helperText={errors.aacount_type}
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            select
                                            {...inputProps}
                                            labelText="Vintage with Banker"
                                            name="account_since"
                                            value={values.account_since}
                                            error={errors.account_since}
                                            helperText={errors.account_since}
                                        >
                                            {
                                                <>
                                                    <option value="null">Vintage with banker</option>
                                                    {[...Array(currentYearDiff)].map((_, i) => {
                                                        return (
                                                            <option value={currentYear - i}>{currentYear - i}</option>
                                                        )
                                                    })}
                                                </>
                                            }
                                        </TextInput>
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            {...inputProps}
                                            money
                                            labelText="Transaction Limit"
                                            name="transaction_limit"
                                            value={values.transaction_limit}
                                            error={errors.transaction_limit}
                                            helperText={errors.transaction_limit}
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextInput
                                            select
                                            {...inputProps}
                                            labelText="Is Secured"
                                            name="security"
                                            value={values.is_security}
                                            error={errors.is_security}
                                            helperText={errors.is_security}
                                        >
                                            <option>Secured</option>
                                            <option>Unsecured</option>
                                        </TextInput>
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
                                                <TableCell align="left">Bank name</TableCell>
                                                <TableCell align="left">Account No.</TableCell>
                                                <TableCell align="left">Account since</TableCell>
                                                <TableCell align="left">Transaction limit</TableCell>
                                                <TableCell align="left">Branch</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        {
                                            bankData.map((row, i) => {
                                                return (
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="left">{row.bank_name}</TableCell>
                                                            <TableCell align="left">{row.account_no}</TableCell>
                                                            <TableCell align="left">{row.account_since}</TableCell>
                                                            <TableCell align="left">{row.transaction_limit}</TableCell>
                                                            <TableCell align="left">{row.bank_branch}</TableCell>
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

export default AddBankingDetailsForm;