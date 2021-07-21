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
import Currency from '../../../components/Number/Currency';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

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
        width: '40vw'
    },
    sidePanelFormContentWrapper: {
        flex: 1,
        overflow: 'auto'
    },
    wrapper: {
        padding: 8,
        width: '55vw',
    },
    title: {
        paddingLeft: 8,
        marginBottom: 8
    },
    table: {
        // minWidth: 650,
        padding: 8
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    footer: {
        paddingTop: 8,
        textAlign: 'right'
    },
    sidePanelWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '40vw',
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
    sidePanelWrapper: {
        width: '40vw',
        padding: '14px',
    },
    table: {
        padding: 8,
        marginTop: 8
    },
    formWrapper: {
        padding: '0 15px'
    },
    row: {
        paddingRight: 4,
        paddingBottom: 14
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
    transportFormWrapper: {
        padding: theme.spacing(2),
    },
    transWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(2),
    },
    ownerWrapper: {
        flex: 1,
        overflowY: 'auto'
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
    },
    actionButtons: {
        // paddingTop: 8
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
    },
    stepTitle: {
        '& .MuiStepLabel-label.MuiStepLabel-active': {
            fontSize: 15,
            fontWeight: 600
        }
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
    const [tankerData, setTankerData] = useState([])
    const [editable, setEditable] = useState(true)
    const [addNewRow, setAddNewRow] = useState();
    const [apiData, setApiData] = useState({});
    const [editRow, setEditRow] = useState({});


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const onTextChange = e => {
        const { name, value } = e.target;
        setApiData({
            ...apiData,
            [name]: value
        })
    }
    const onEditTextChange = e => {
        const { name, value } = e.target;
        setEditRow({
            ...editRow,
            [name]: value
        })
    }
    const editTankerRow = (rowData, rowIndex) => {
        setEditRow({ ...rowData, rowIndex });
    }
    const saveIncomeRow = (rowData, rowIndex) => {
        const objBody = {
            user_id: currentUser.id, ...rowData
        }
    }
    const saveNewTanker = () => {
        console.log('Income api body - ', apiData)
        if (Object.keys(apiData).length < 3) return null;
        const objBody = {
            user_id: currentUser.id, ...apiData
        }
        // postDealershipIncomeById(id, objBody)
        //     .then(res => {
        //         setIncome(res);
        //         setLoading(false);
        //         setAddNewRow(false);
        //         setApiData({});
        //     })
        //     .catch(err => {
        //         console.log('Income data save error - ', err);
        //         setLoading(false);
        //     })
    }

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            transport_name: Yup.string().required('Please enter transporter name'),

        }),
        // onSubmit: values => {
        //     updateFleetOperator(values, dealer_id, data.id)
        //         .then(res => {
        //             console.log(res)
        //             enqueueSnackbar(res, {
        //                 anchorOrigin: {
        //                     vertical: 'top',
        //                     horizontal: 'right',
        //                 },
        //                 variant: 'success',
        //             }
        //             )
        //             setTimeout(() => {
        //                 window.location.reload()
        //             }, 1500);

        //         })
        //         .catch(e => {
        //             enqueueSnackbar(e, {
        //                 anchorOrigin: {
        //                     vertical: 'top',
        //                     horizontal: 'right',
        //                 },
        //                 variant: 'error',
        //             }
        //             )
        //         })


        // }
    });
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
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Account Type"
                                        name="aacount_type"
                                        value={values.aacount_type}
                                        readOnly={readOnly}
                                        error={errors.aacount_type}
                                        helperText={errors.aacount_type}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Name of the Bank"
                                        name="bank_name"
                                        value={values.bank_name}
                                        readOnly={readOnly}
                                        error={errors.bank_name}
                                        helperText={errors.bank_name}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Account Number"
                                        name="account_no"
                                        type="number"
                                        value={values.account_no}
                                        readOnly={readOnly}
                                        error={errors.account_no}
                                        helperText={errors.account_no}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Vintage with Banker"
                                        name="vintage_with_banker"
                                        value={values.vintage_with_banker}
                                        readOnly={readOnly}
                                        error={errors.vintage_with_banker}
                                        helperText={errors.vintage_with_banker}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Transaction Limit"
                                        name="transaction_limit"
                                        value={values.transaction_limit}
                                        readOnly={readOnly}
                                        error={errors.transaction_limit}
                                        helperText={errors.transaction_limit}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Is Secured"
                                        name="is_secured"
                                        type="number"
                                        value={values.is_secured}
                                        readOnly={readOnly}
                                        error={errors.is_secured}
                                        helperText={errors.is_secured}
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <Fragment className={classes.table}>
                                        <Typography className={classes.subTitle} variant="h4">Tanker Details</Typography>
                                        <Grid md={6}>
                                            <TextInput
                                                {...inputProps}
                                                labelText="Number of Tanker"
                                                name="no_of_tanker"
                                                type="number"
                                                value={values.no_of_tanker}
                                                readOnly={readOnly}
                                                error={errors.no_of_tanker}
                                                helperText={errors.no_of_tanker}
                                            />
                                        </Grid>
                                        <Table className={classes.table} size="small" aria-label="Income">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Tanker  Type</TableCell>
                                                    <TableCell>Tanker Capacitys</TableCell>
                                                    <TableCell align="right">Tanker Operation hours</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    Array.isArray(tankerData) && tankerData.map((item, i) => editRow.rowIndex === i ? (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <TextInput
                                                                    label="Tanker Type"
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
                                                                    label="Tanker Capacity"
                                                                    name="tanker_capacity"
                                                                    type="number"
                                                                    value={editRow.tanker_capacity}
                                                                    onChange={onEditTextChange}
                                                                />
                                                            </TableCell>
                                                            <TableCell align={"right"}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="success"
                                                                    className={classes.btnSuccess}
                                                                    onClick={() => saveIncomeRow(editRow, i)}>
                                                                    Save
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        <TableRow key={i}>
                                                            <TableCell>{item.tanker_type}</TableCell>
                                                            <TableCell>{item.tanker_capacity}</TableCell>
                                                            <TableCell align={"right"}>{item.operating_time}</TableCell>
                                                            <TableCell align={"right"}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="success"
                                                                    className={classes.btnSuccess}
                                                                    onClick={() => editTankerRow(item, i)}>
                                                                    Edit
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                                {
                                                    addNewRow && (
                                                        <TableRow key={"new-row"}>
                                                            <TableCell>
                                                                <TextInput
                                                                    select
                                                                    label="Tanker Type"
                                                                    name="tanker_type"
                                                                    value={apiData.tanker_type}
                                                                    onChange={onTextChange}
                                                                >
                                                                    <option>Owned</option>
                                                                    <option>Rented</option>
                                                                </TextInput>
                                                            </TableCell>
                                                            <TableCell align={"right"}>
                                                                <TextInput
                                                                    label="Tanker_capacity"
                                                                    name="tanker_capacity"
                                                                    type="number"
                                                                    value={apiData.tanker_capacity}
                                                                    onChange={onTextChange}
                                                                />
                                                            </TableCell>
                                                            <TableCell >
                                                                <TextInput
                                                                    label="Operation hours"
                                                                    type="number"
                                                                    name="operating_time"
                                                                    value={apiData.operating_time}
                                                                    onChange={onTextChange}
                                                                />
                                                            </TableCell>
                                                            <TableCell align={"right"}></TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                                <TableRow key={"add-row"}>
                                                    <TableCell align="right" colSpan={4}>
                                                        {
                                                            addNewRow ? (
                                                                <Fragment>
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        color="error"
                                                                        onClick={() => {
                                                                            setAddNewRow(false);
                                                                        }}>
                                                                        <DeleteForeverRoundedIcon fontSize="small" />
                                                                    </Button>
                                                                    &nbsp;&nbsp;
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        color="success"
                                                                        className={classes.btnSuccess}
                                                                        onClick={saveNewTanker}>
                                                                        <DoneRoundedIcon fontSize="small" />
                                                                    </Button>
                                                                </Fragment>
                                                            ) : (editable && (

                                                                <Button
                                                                    variant="contained"
                                                                    className={clsx(classes.btn, classes.btnSuccess)}
                                                                    onClick={() => setAddNewRow(true)}>Add Tanker</Button>
                                                            ))
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Fragment>
                                    {/* <IncomeTa id={id} editable={editable} currentUser={currentUser} /> */}
                                </Grid>

                            </Grid>
                        </form>
                    </Box >
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
                            onClick={loading ? () => null : readOnly ? handleEdit : handleSubmit}
                        >
                            {loading ? <CircularProgress size={20} /> : readOnly ? `Edit` :
                                'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default AddBankingDetailsForm;