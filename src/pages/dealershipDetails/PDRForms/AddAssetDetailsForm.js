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
    title: {
        paddingLeft: 8,
        marginBottom: 8
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

const AddAssetDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState()
    const [businessType, setBusinessType] = useState('proprietorship')
    const [tankerData, setTankerData] = useState([])
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
                <div>Add Asset Details</div>
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
                                        select
                                        labelText="Assets"
                                        name="assets"
                                        value={values.outlet_address}
                                        readOnly={readOnly}
                                        error={errors.outlet_address}
                                        helperText={errors.outlet_address}
                                    >
                                        <option>Land</option>
                                        <option>Building</option>
                                        <option>Gold</option>
                                        <option>Car</option>
                                        <option>CV</option>
                                    </TextInput>
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

export default AddAssetDetailsForm;