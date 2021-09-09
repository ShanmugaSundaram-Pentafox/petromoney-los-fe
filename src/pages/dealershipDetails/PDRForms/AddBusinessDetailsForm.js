import React, { Fragment, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput from '../../../components/TextInput/TextInput';
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
import { getBusinessDetailsbyID, getPartnerDetailsbyID, updateBusinessDetailsByID, updatePartnersByID } from '../../../services/PDReport.services';
import { useMount } from 'react-use';
import { getBusinessTypes } from '../../../services/common.service';
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
    actionButtonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 16px'
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
    const [businessTypes, setBusinessTypes] = useState([]);
    const [partnerData, setPartnerData] = useState([])
    const [type, setType] = useState()
    const [businessData, setBusinessData] = useState();


    // useMount(() => {
    //     getBusinessTypes()
    //         .then(result => {
    //             setBusinessTypes(result.map(({ name, id }) => ({
    //                 label: name,
    //                 value: id
    //             })))
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         })
    //     getBusinessDetailsbyID(dealer_id)
    //         .then(data => {
    //             setBusinessData(data)
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         })
    //     getPartnerDetailsbyID(dealer_id)
    //         .then(data => {
    //             setPartnerData(data)
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         })

    // })


    const handleEdit = () => {
        setReadOnly(!readOnly)
    };
    const handleClose = () => {
        callback();
    };

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: {
            ...data
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),

        }),
        onSubmit: values => {
            updateBusinessDetailsByID(values, dealer_id)
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
                    // setTimeout(() => {
                    //     window.location.reload()
                    // }, 1500);

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
                        {/* <Grid container spacing={2}>
                            <Grid item md={6} style={{ marginBottom: 16 }}>
                                <label style={{ marginBottom: 12 }}>Business type</label>
                                <Select
                                    isClearable
                                    onChange={setType}
                                    options={businessTypes} />
                            </Grid>
                        </Grid> */}
                        <Grid container spacing={2}>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    labelText="No. of years in fuel business"
                                    name="business_age"
                                    value={values.business_age}
                                    readOnly={readOnly}
                                    error={errors.business_age}
                                    helperText={errors.business_age}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    labelText="No. of HSD Dispensers"
                                    name="hsd_count"
                                    value={values.hsd_count}
                                    readOnly={readOnly}
                                    error={errors.hsd_count}
                                    helperText={errors.hsd_count}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    labelText="No. of MS Dispensers"
                                    name="ms_count"
                                    value={values.ms_count}
                                    readOnly={readOnly}
                                    error={errors.ms_count}
                                    helperText={errors.ms_count}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    labelText="Area of fuel station (in Sq. ft)"
                                    name="fuel_station_area"
                                    value={values.fuel_station_area}
                                    readOnly={readOnly}
                                    error={errors.fuel_station_area}
                                    helperText={errors.fuel_station_area}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    labelText="Electricity units (per month)"
                                    name="electricity_units_month"
                                    value={values.electricity_units_month}
                                    readOnly={readOnly}
                                    error={errors.electricity_units_month}
                                    helperText={errors.electricity_units_month}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    money
                                    labelText="Electricity bill per month"
                                    name="electricity_bill_month"
                                    value={values.electricity_bill_month}
                                    readOnly={readOnly}
                                    error={errors.electricity_bill_month}
                                    helperText={errors.electricity_bill_month}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    money
                                    labelText="Insurance premium for pump"
                                    name="insurance_pump"
                                    value={values.insurance_pump}
                                    readOnly={readOnly}
                                    error={errors.insurance_pump}
                                    helperText={errors.insurance_pump}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    money
                                    labelText="Total Insurance premium"
                                    name="insurance_all"
                                    value={values.insurance_all}
                                    readOnly={readOnly}
                                    error={errors.insurance_all}
                                    helperText={errors.insurance_all}
                                />
                            </Grid>
                            {/* <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    money
                                    labelText="Monthly average sale"
                                    name="monthly_average_sale"
                                    value={values.monthly_average_sale}
                                    readOnly={readOnly}
                                    error={errors.monthly_average_sale}
                                    helperText={errors.monthly_average_sale}
                                />
                            </Grid> */}
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    labelText="LPG count"
                                    name="lpg_count"
                                    value={values.lpg_count}
                                    readOnly={readOnly}
                                    error={errors.lpg_count}
                                    helperText={errors.lpg_count}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    money
                                    labelText="Credit sales per day"
                                    name="credit_sales_day"
                                    value={values.credit_sales_day}
                                    readOnly={readOnly}
                                    error={errors.credit_sales_day}
                                    helperText={errors.credit_sales_day}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    money
                                    labelText="Credit sales per month"
                                    name="credit_sales_month"
                                    value={values.credit_sales_month}
                                    readOnly={readOnly}
                                    error={errors.credit_sales_month}
                                    helperText={errors.credit_sales_month}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    labelText="Average realization period"
                                    name="avg_realization_period"
                                    value={values.avg_realization_period}
                                    readOnly={readOnly}
                                    error={errors.avg_realization_period}
                                    helperText={errors.avg_realization_period}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextInput
                                    {...inputProps}
                                    money
                                    labelText="Outstanding any given time"
                                    name="credit_outstanding"
                                    value={values.credit_outstanding}
                                    readOnly={readOnly}
                                    error={errors.credit_outstanding}
                                    helperText={errors.credit_outstanding}
                                />
                            </Grid>
                            <Grid item md={7}>
                                <div style={{ paddingTop: 12 }}>
                                    <label>Is ATM available in outlet</label>
                                </div>
                            </Grid>
                            <Grid item md={4}>
                                <FormControl>
                                    <RadioGroup name="has_atm" value={values.has_atm} defaultValue={values.has_atm} onChange={handleChange}>
                                        <FormGroup row>
                                            <FormControlLabel value={1} control={<Radio color="secondary" />} label="Yes" />
                                            <FormControlLabel value={0} control={<Radio color="secondary" />} label="No" />
                                        </FormGroup>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item md={7}>
                                <div style={{ paddingTop: 12 }}>
                                    <label>Micro ATM Interested</label>
                                </div>
                            </Grid>
                            <Grid item md={4}>
                                <FormControl>
                                    <RadioGroup name="is_microatm" value={values.is_microatm} onChange={handleChange}>
                                        <FormGroup row>
                                            <FormControlLabel value={1} control={<Radio color="secondary" />} label="Yes" />
                                            <FormControlLabel value={0} control={<Radio color="secondary" />} label="No" />
                                        </FormGroup>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item md={7}>
                                <div style={{ paddingTop: 12 }}>
                                    <label>Is the customer a PEP (Politically Exposed Person) or closely associated to PEP</label>
                                </div>
                            </Grid>
                            <Grid item md={4}>
                                <FormControl>
                                    <RadioGroup name="is_pep" value={values.is_pep} onChange={handleChange}>
                                        <FormGroup row>
                                            <FormControlLabel value={1} control={<Radio color="secondary" />} label="Yes" />
                                            <FormControlLabel value={0} control={<Radio color="secondary" />} label="No" />
                                        </FormGroup>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            {/* {
                                values.is_pep === "yes" ? (
                                    <>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                labelText="Relationship with Politician"
                                                name="relationship"
                                                value={values.relationship}
                                                error={errors.relationship}
                                                helperText={errors.relationship}
                                            />
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextInput
                                                {...inputProps}
                                                labelText="Politician's position"
                                                name="position"
                                                value={values.position}
                                                error={errors.position}
                                                helperText={errors.position}
                                            />
                                        </Grid>
                                    </>
                                ) : null
                            } */}
                            {/* {
                                type?.label === 'Proprietorship' && (
                                    <>
                                        <Grid item md={6}>
                                            <TextInput
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
                                                labelText="Proprietor mobile"
                                                name="proprietor_mobile"
                                                value={values.proprietor_mobile}
                                                readOnly={readOnly}
                                                error={errors.proprietor_mobile}
                                                helperText={errors.proprietor_mobile}
                                            />
                                        </Grid>
                                    </>
                                )
                            }
                            {
                                type?.label === 'Partnership' && (
                                    <>
                                        <Grid item md={12}>
                                            <Fragment className={classes.table}>
                                                <Typography className={classes.subTitle} variant="h4">Partner Details</Typography>
                                                <Grid md={6}>
                                                    <TextInput
                                                        {...inputProps}
                                                        labelText="Number of Partner"
                                                        name="no_of_partners"
                                                        type="number"
                                                        value={values.no_of_partners}
                                                        readOnly={readOnly}
                                                        error={errors.no_of_partners}
                                                        helperText={errors.no_of_partners}
                                                    />
                                                </Grid>
                                            </Fragment>
                                        </Grid>
                                        < AddPartnerDetails dealer_id={dealer_id} />
                                    </>
                                )
                            } */}
                            {/* {
                                    Array.isArray(partnerData) && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Partner name</TableCell>
                                                    <TableCell>Mobile number</TableCell>
                                                    <TableCell>Managing partner name</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    partnerData?.map((row, i) => {
                                                        return (
                                                            <TableRow>
                                                                <TableCell>{row.partner_name}</TableCell>
                                                                <TableCell>{row.partner_mobile}</TableCell>
                                                                <TableCell>{row.managing_partner_name}</TableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                    )
                                                }
                                            </TableBody>
                                        </Table>
                                    )
                                } */}
                        </Grid>
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

export default AddBusinessDetailsForm;