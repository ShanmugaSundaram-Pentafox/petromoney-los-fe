import React, { Fragment, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput, { InputWrapper } from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addInfrastructureDetails } from '../../../services/PDReport.services';
import AddTankerDetails from './AddTankerDetails';
import { FormControl } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';


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
        width: '60vw'
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


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: { ...data },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),

        }),
        onSubmit: values => {
            const data = { ...values }
            addInfrastructureDetails(data, dealer_id)
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
                    }, 1500);
                })
                .catch(e => {
                    enqueueSnackbar(e, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'error',
                    });
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
                                        type="number"
                                        value={values.no_of_tank}
                                        readOnly={readOnly}
                                        error={errors.no_of_tank}
                                        helperText={errors.no_of_tank}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="No of Hoarding"
                                        name="no_of_hoarding"
                                        type="number"
                                        value={values.no_of_hoarding}
                                        readOnly={readOnly}
                                        error={errors.no_of_hoarding}
                                        helperText={errors.no_of_hoarding}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Tank Capacity"
                                        name="tank_capacity"
                                        value={values.tank_capacity}
                                        readOnly={readOnly}
                                        placeholder="in liters"
                                        error={errors.tank_capacity}
                                        helperText={errors.tank_capacity}
                                    />
                                </Grid>
                                <Grid item md={2} style={{ marginTop: 22 }}>
                                    <div>
                                        <label>Using Solar</label>
                                    </div>
                                </Grid>
                                <Grid item md={3} style={{ marginTop: 12 }} >
                                    <FormControl>
                                        <RadioGroup name="is_solar" value={values.is_solar} onChange={handleChange}>
                                            <FormGroup row>
                                                <FormControlLabel value="yes" control={<Radio color="secondary" />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                                            </FormGroup>
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {/* <Grid item md={6}>
                                    <TextInput
                                        {...inputProps}
                                        labelText="Using Solar"
                                        name="is_solar"
                                        value={values.is_solar}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                        error={errors.is_solar}
                                        helperText={errors.is_solar}
                                    >
                                    </TextInput>
                                </Grid> */}
                                <Grid item md={12}>
                                    <Fragment className={classes.table}>
                                        <Typography className={classes.subTitle} variant="h4">Tanker Details</Typography>
                                        {/* <Grid md={6}>
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
                                        </Grid> */}
                                        <AddTankerDetails dealer_id={dealer_id} length={values.no_of_tanker} />
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