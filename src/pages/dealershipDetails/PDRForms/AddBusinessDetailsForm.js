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
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';

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
        marginTop:8
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

const AddBusinessDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState()
    const [businessType, setBusinessType] = useState('proprietorship')
    const [partnerData, setPartnerData] = useState([])
    const [editable, setEditable] = useState(true)
    const [applicantsList, setApplicantsList] = useState([]);
    const [addNewRow, setAddNewRow] = useState();
    const [apiData, setApiData] = useState({});
    const [editRow, setEditRow] = useState({});


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const handleDateChange = (date) => {
        setSelectedDate(date)
        // handleDate(date)
    }
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
    const editPartnerRow = (rowData, rowIndex) => {
        setEditRow({ ...rowData, rowIndex });
    }
    const saveIncomeRow = (rowData, rowIndex) => {
        const objBody = {
            user_id: currentUser.id, ...rowData
        }
    }
    const saveNewPartner = () => {
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
                <div>Add Business Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {
                                    businessType === 'proprietorship' && (
                                        <>
                                            <Grid item md={6}>
                                                <TextInput
                                                    select
                                                    {...inputProps}
                                                    labelText="Proprietor name"
                                                    name="proprietor_name"
                                                    value={values.proprietor_name}
                                                    readOnly={readOnly}
                                                    error={errors.proprietor_name}
                                                    helperText={errors.proprietor_name}
                                                />
                                            </Grid>
                                            <Grid item md={6}>
                                                <TextInput
                                                    {...inputProps}
                                                    labelText="ProPrietor mobile"
                                                    name="proprietor_mobile"
                                                    value={values.proprietor_mobile}
                                                    readOnly={readOnly}
                                                    error={errors.proprietor_mobile}
                                                    helperText={errors.proprietor_mobile}
                                                />
                                            </Grid>
                                            <Grid item md={12}>
                                                <Fragment className={classes.table}>
                                                    <Typography className={classes.subTitle} variant="h4">Partner Details</Typography>
                                                    <Grid  md={6}>
                                                        <TextInput
                                                            {...inputProps}
                                                            labelText="Number of Partner"
                                                            name="no_of_partner"
                                                            type="number"
                                                            value={values.no_of_partner}
                                                            readOnly={readOnly}
                                                            error={errors.no_of_partner}
                                                            helperText={errors.no_of_partner}
                                                        />
                                                    </Grid>
                                                    <Table className={classes.table} size="small" aria-label="Income">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Partner name</TableCell>
                                                                <TableCell>Partner mobile</TableCell>
                                                                <TableCell align="right">Managing partner name</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                Array.isArray(partnerData) && partnerData.map((item, i) => editRow.rowIndex === i ? (
                                                                    <TableRow key={i}>
                                                                        <TableCell>
                                                                            <TextInput
                                                                                label="Partner Name"
                                                                                name="partner_name"
                                                                                value={editRow.business_name?.toUpperCase()}
                                                                                onChange={onEditTextChange}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <TextInput
                                                                                label="Partner Mobile"
                                                                                name="partner_mobile"
                                                                                type="number"
                                                                                value={editRow.business_age}
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
                                                                        <TableCell>{item.partner_name}</TableCell>
                                                                        <TableCell>{item.partner_mobile}</TableCell>
                                                                        <TableCell align={"right"}>{item.managig_partner_name}</TableCell>
                                                                        <TableCell align={"right"}>
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="success"
                                                                                className={classes.btnSuccess}
                                                                                onClick={() => editPartnerRow(item, i)}>
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
                                                                                label="Partner Name"
                                                                                name="partner_name"
                                                                                value={apiData.business_name?.toUpperCase()}
                                                                                onChange={onTextChange}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell align={"right"}>
                                                                            <TextInput
                                                                                label="Partner Mobile"
                                                                                name="partner_mobile"
                                                                                type="number"
                                                                                value={apiData.business_age}
                                                                                onChange={onTextChange}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell >
                                                                            <TextInput
                                                                                label="Managining partner name"
                                                                                name="managing_partner_name"
                                                                                value={apiData.managing_partner_name}
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
                                                                                    onClick={saveNewPartner}>
                                                                                    <DoneRoundedIcon fontSize="small" />
                                                                                </Button>
                                                                            </Fragment>
                                                                        ) : (editable && (

                                                                            <Button
                                                                                variant="contained"
                                                                                className={clsx(classes.btn, classes.btnSuccess)}
                                                                                onClick={() => setAddNewRow(true)}>Add Partner</Button>
                                                                        ))
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Fragment>
                                                {/* <IncomeTa id={id} editable={editable} currentUser={currentUser} /> */}
                                            </Grid>
                                        </>
                                    )
                                }
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

export default AddBusinessDetailsForm;