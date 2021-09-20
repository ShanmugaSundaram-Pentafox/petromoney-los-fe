import React, { useState } from 'react';
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
import 'date-fns';
import { addOmcDetails, addReferenceDetails, getOmcDetailsById } from '../../../services/PDReport.services';
import { FormControl } from '@material-ui/core';
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
        width: '55vw'
    },
    sidePanelFormContentWrapper: {
        flex: 1,
        overflow: 'auto'
    },
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
    },
    stepperRoot: {
        padding: 16,
        paddingTop: 8
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

const AddReferenceForm = ({ data, dealer_id, isEdit, callback }) => {
    const [readOnly, setReadOnly] = useState(isEdit === 'Edit' ? false : true);
    const [loading, setLoading] = useState(false)
    const [executedDate, setExecutedDate] = useState(data?.agreement_executed_on)
    const [validDate, setValidDate] = useState(data?.agreement_valid_till)

    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: { ...data },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),
        }),
        onSubmit: values => {
            enqueueSnackbar('you are not allowed to add references details,Please contact admin', {
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                variant: 'error',
            });
            // addReferenceDetails(values, dealer_id)
            //     .then(res => {
            //         enqueueSnackbar(res, {
            //             anchorOrigin: {
            //                 vertical: 'top',
            //                 horizontal: 'right',
            //             },
            //             variant: 'success',
            //         });
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 1500);
            //     })
            //     .catch(e => {
            //         console.log(e);
            //     })
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
                <div>Add Reference Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* <Grid item md={6}>
                                    <label>Other Bunks owned in family member</label>
                                    <TextInput
                                        {...inputProps}
                                        select
                                        labelText="Other Bunks owned in family member"
                                        name="other_bunks_owned"
                                        value={values.other_bunks_owned}
                                        error={errors.other_bunks_owned}
                                        helperText={errors.other_bunks_owned}
                                    >
                                        <option value="">Choose option</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </TextInput>
                                </Grid> */}
                                {
                                    <>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                labelText="Dealer name"
                                                name="dealer_name"
                                                value={values.dealer_name}
                                                error={errors.dealer_name}
                                                helperText={errors.dealer_name}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                labelText="Dealer mobile"
                                                name="dealer_mobile"
                                                value={values.dealer_mobile}
                                                error={errors.dealer_mobile}
                                                helperText={errors.dealer_mobile}
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <TextInput
                                                {...inputProps}
                                                multiline
                                                labelText="Remarks"
                                                name="remarks"
                                                value={values.remarks}
                                                error={errors.remarks}
                                                helperText={errors.remarks}
                                            />
                                        </Grid>
                                        {/* <Grid item md={6}>
                                                <TextInput
                                                    {...inputProps}
                                                    labelText="Sales officer name"
                                                    name="sales_officer_name"
                                                    value={values.sales_officer_name}
                                                    error={errors.sales_officer_name}
                                                    helperText={errors.sales_officer_name}
                                                />
                                            </Grid>
                                            <Grid item md={6}>
                                                <TextInput
                                                    {...inputProps}
                                                    labelText="Sales officer mobile"
                                                    name="sales_officer_mobile"
                                                    value={values.sales_officer_mobile}
                                                    error={errors.sales_officer_mobile}
                                                    helperText={errors.sales_officer_mobile}
                                                />
                                            </Grid> */}
                                    </>
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
        </div >
    )
}
export default AddReferenceForm;