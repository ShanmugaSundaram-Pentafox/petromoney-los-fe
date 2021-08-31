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
import { addInfrastructureDetails } from '../../../services/PDReport.services';


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

const AddInfrastructureDetailsForm = ({ data, dealer_id, isEdit, callback, currentUser }) => {

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
        // console.log('Income api body - ', apiData)
        if (Object.keys(apiData).length < 3) return null;
        const objBody = {
            user_id: currentUser.id, ...apiData, ...data
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
            // transport_name: Yup.string().required('Please enter transporter name'),

        }),
        onSubmit: values => {
            const data = {...values}
            addInfrastructureDetails(data ,dealer_id)
            .then(res => {
                enqueueSnackbar(res, {
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                    },
                    variant: 'success',
                  });
                setTimeout(() => {
                    window.location.reload()
                },1500);
            })
            .catch(e => {
                console.log(e);
            })
        }
    });
    const inputProps = {
        direction: "column",
        alignTop: true,
        onChange: handleChange,
    }
    return (
        <div className={classes.sidePanelFormWrapper}>
            <Typography className={classes.sidePanelTitle} variant="h4">
                <div>Add Infrastructure Details</div>
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
                                        labelText="No of Employees"
                                        name="no_of_employee"
                                        type="number"
                                        value={values.no_of_employee}
                                        readOnly={readOnly}
                                        error={errors.no_of_employee}
                                        helperText={errors.no_of_employee}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="No of Nozzles"
                                        name="no_of_nozzle"
                                        type="number"
                                        value={values.no_of_nozzle}
                                        readOnly={readOnly}
                                        error={errors.no_of_nozzle}
                                        helperText={errors.no_of_nozzle}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="No of Storage Tank"
                                        name="no_of_tank"
                                        value={values.no_of_tank}
                                        readOnly={readOnly}
                                        error={errors.no_of_tank}
                                        helperText={errors.no_of_tank}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Tank Capacity"
                                        name="tank_capacity"
                                        value={values.tank_capacity}
                                        readOnly={readOnly}
                                        error={errors.tank_capacity}
                                        helperText={errors.tank_capacity}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        select
                                        labelText="Using Solar"
                                        name="is_solar"
                                        value={values.is_solar}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        error={errors.is_solar}
                                        helperText={errors.is_solar}
                                    >
                                        <option>YES</option>
                                        <option>NO</option>

                                    </TextInput>
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Number of Hoarding"
                                        name="no_of_hoarding"
                                        type="number"
                                        value={values.no_of_hoarding}
                                        readOnly={readOnly}
                                        error={errors.no_of_hoarding}
                                        helperText={errors.no_of_hoarding}
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
                                                                    disabled={readOnly}
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

export default AddInfrastructureDetailsForm;