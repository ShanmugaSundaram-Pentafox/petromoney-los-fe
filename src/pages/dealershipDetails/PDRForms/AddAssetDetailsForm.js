import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/CommonComponents/Button/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from "@material-ui/styles";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addAssetDetailsById, getAssetDataById, getAssetList } from '../../../services/PDReport.services';
import Select from 'react-select';
import { useMount } from 'react-use';
import { TableBody } from '@material-ui/core';
import { URL } from '../../../config/serverUrls';

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
    table: {
        marginTop: 20,

    },
    typeField: {
        marginBottom: 20,
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
    const [type, setType] = useState()
    const [loading, setLoading] = useState(false)
    const [asset, setAsset] = useState([])
    const [assetData, setAssetData] = useState([])
    const [assetList, setAssetList] = useState([])


    useMount(() => {
        getAssetList()
            .then(result => {
                setAssetList(result.map(({ name, asset_id }) => ({
                    label: name,
                    value: asset_id
                })))
                setAssetData(result)
            })
            .catch((e) => {
                console.log(e);
            })
        getAssetDataById(dealer_id)
            .then(data => {
                setAsset(data)
            })
            .catch((e) => {
                console.log(e);
            })

    })

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
            const data = { details: { ...values }, asset_id: type.value }
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
            fetch(`dealership/${dealer_id}/assets`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            })
                .then((res) => {
                    return res.json();
                })
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
                <div>Add Asset Details</div>
                <CloseIcon onClick={handleClose} />
            </Typography>
            <div className={classes.sidePanelFormContentWrapper}>
                <div className={classes.stepperRoot}>
                    <Box>
                        <>
                            <div>
                                <div className={classes.typeField}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6}>
                                            <label style={{ marginBottom: 8 }}>Asset type</label>
                                            <Select
                                                isClearable
                                                onChange={setType}
                                                options={assetList} />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div>
                                    <>
                                        {
                                            assetData.map((data) => {
                                                return (
                                                    <>
                                                        {
                                                            data.asset_id === type?.value ? (
                                                                <Grid container spacing={2}>
                                                                    {
                                                                        data.details.map((item, i) => {
                                                                            return (
                                                                                <Grid item md={6}>
                                                                                    <TextInput
                                                                                        {...inputProps}
                                                                                        labelText={item.label}
                                                                                        name={item.key}
                                                                                        // value={item.key}
                                                                                        error={errors.key}
                                                                                        helperText={errors.key}
                                                                                    >
                                                                                    </TextInput>
                                                                                </Grid>
                                                                            )
                                                                        })
                                                                    }
                                                                    <Grid item md={6}>
                                                                        <TextInput
                                                                            {...inputProps}
                                                                            labelText="Ownership"
                                                                            name="ownership"
                                                                            value={values.ownership}
                                                                            error={errors.ownership}
                                                                            helperText={errors.ownership}
                                                                        >
                                                                        </TextInput>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <TextInput
                                                                            {...inputProps}
                                                                            labelText="Ownership proof"
                                                                            name="ownership_proof"
                                                                            value={values.ownership_proof}
                                                                            error={errors.ownership_proof}
                                                                            helperText={errors.ownership_proof}
                                                                        >
                                                                        </TextInput>
                                                                    </Grid>

                                                                </Grid>
                                                            ) : null
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                    </>
                                </div>
                                {/* <div>
                                    <Grid container spacing={2}>
                                        {
                                            type?.label === "Land" ?
                                                (
                                                    <>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                labelText="Land Address"
                                                                name="land_address"
                                                                value={values?.land_address}
                                                                error={errors.land_address}
                                                                helperText={errors.land_address}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                money
                                                                labelText="Land Value"
                                                                name="land_value"
                                                                value={values?.land_value}
                                                                error={errors.land_value}
                                                                helperText={errors.land_value}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                    </>
                                                ) : type?.label === "Building" ? (
                                                    <>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                labelText="Building Address"
                                                                name="building_address"
                                                                value={values?.building_address}
                                                                error={errors.building_address}
                                                                helperText={errors.building_address}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                money
                                                                labelText="Building Value"
                                                                name="building_value"
                                                                value={values?.building_value}
                                                                error={errors.building_value}
                                                                helperText={errors.building_value}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                    </>

                                                ) : type?.label === "Gold" ? (
                                                    <>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                labelText="Gold Quantity"
                                                                name="gold_quantity"
                                                                placeholder="in grams"
                                                                value={values?.gold_quantity}
                                                                error={errors.gold_quantity}
                                                                helperText={errors.gold_quantity}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                money
                                                                labelText="Gold Value"
                                                                name="gold_value"
                                                                value={values?.gold_value}
                                                                error={errors.gold_value}
                                                                helperText={errors.gold_value}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                    </>
                                                ) : type?.label === "Car" ? (
                                                    <>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                labelText="Car Model"
                                                                name="car_model"
                                                                value={values?.car_model}
                                                                error={errors.car_model}
                                                                helperText={errors.car_model}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                labelText="Car Manufacture Year"
                                                                name="car_yom"
                                                                value={values?.car_yom}
                                                                error={errors.car_yom}
                                                                helperText={errors.car_yom}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <TextInput
                                                                {...inputProps}
                                                                money
                                                                labelText="Car Value"
                                                                name="car_value"
                                                                value={values?.car_value}
                                                                error={errors.car_value}
                                                                helperText={errors.car_value}
                                                            >
                                                            </TextInput>
                                                        </Grid>
                                                    </>
                                                ) : null
                                        }
                                    </Grid>
                                </div> */}
                                {/* <>
                                    {
                                        assetData.map((row, i) => {
                                            return (
                                                <>
                                                    {
                                                        row.asset_id === 4 && (
                                                            <div className={classes.table}>
                                                                <Typography className={classes.typography}>Land</Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell align="left">Address</TableCell>
                                                                            <TableCell align="left">Value</TableCell>
                                                                            <TableCell align="right">Action</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell align="left">{row.details.land_address}</TableCell>
                                                                            <TableCell align="left">{row.details.land_value}</TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        row.asset_id === 5 && (
                                                            <div className={classes.table}>
                                                                <Typography className={classes.typography}>Building</Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell align="left">Address</TableCell>
                                                                            <TableCell align="left">Value</TableCell>
                                                                            <TableCell align="right">Action</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell align="left">{row.details.building_address}</TableCell>
                                                                            <TableCell align="left">{row.details.building_value}</TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        row.asset_id === 2 && (
                                                            <div className={classes.table}>
                                                                <Typography className={classes.typography}>Gold</Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell align="left">Quantity</TableCell>
                                                                            <TableCell align="left">Value</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell align="left">{row.details.gold_quantity}</TableCell>
                                                                            <TableCell align="left">{row.details.gold_value}</TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        row.asset_id === 1 && (
                                                            <div className={classes.table}>
                                                                <Typography className={classes.typography}>Car</Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell align="left">Model</TableCell>
                                                                            <TableCell align="left">Year of Manufacture</TableCell>
                                                                            <TableCell align="left">value</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell align="left">{row.details.car_model}</TableCell>
                                                                            <TableCell align="left">{row.details.car_yom}</TableCell>
                                                                            <TableCell align="left">{row.details.car_value}</TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        )
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </> */}
                            </div>
                        </>
                    </Box >
                </div >
            </div >
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
                            startIcon={<NavigateNextRounded />}
                            onClick={loading ? () => null : handleSubmit}
                        >
                            {loading ? <CircularProgress size={20} /> :
                                'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </div >


    )
}

export default AddAssetDetailsForm;