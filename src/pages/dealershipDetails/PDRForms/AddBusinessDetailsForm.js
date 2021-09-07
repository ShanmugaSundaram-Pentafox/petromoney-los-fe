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
import Select from 'react-select';
import { getBusinessTypes } from '../../../services/common.service';
import AddPartnerDetails from './AddPartnerDetails';
import { Table } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import { TableBody } from '@material-ui/core';



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


    useMount(() => {
        getBusinessTypes()
            .then(result => {
                setBusinessTypes(result.map(({ name, id }) => ({
                    label: name,
                    value: id
                })))
            })
            .catch((e) => {
                console.log(e);
            })
        getBusinessDetailsbyID(dealer_id)
            .then(data => {
                setBusinessData(data)
            })
            .catch((e) => {
                console.log(e);
            })
        getPartnerDetailsbyID(dealer_id)
            .then(data => {
                setPartnerData(data)
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
        initialValues: {
            ...data,
        },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            transport_name: Yup.string().required('Please enter transporter name'),

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
                        <Grid container spacing={2}>
                            <Grid item md={6} style={{ marginBottom: 16 }}>
                                <label style={{ marginBottom: 12 }}>Business type</label>
                                <Select
                                    isClearable
                                    onChange={setType}
                                    options={businessTypes} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            {
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
                                                {/* <Grid md={6}>
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
                                                    </Grid> */}
                                            </Fragment>
                                        </Grid>
                                        < AddPartnerDetails dealer_id={dealer_id} />
                                    </>
                                )
                            }
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
                            onClick={handleSubmit}
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