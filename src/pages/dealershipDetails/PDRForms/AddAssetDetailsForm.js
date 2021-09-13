import React, { useState } from 'react';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import { useSnackbar } from 'notistack';
import { addAssetDetailsById, getAssetDataById, getAssetList } from '../../../services/PDReport.services';
import Select from 'react-select';
import { useMount } from 'react-use';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import PreviewCard from '../../../components/CommonComponents/Cards/PreviewCard';
import AssetDetailsCard from './Components/AssetDetailsCard';

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

const AddAssetDetailsForm = ({ data, dealer_id, callback, currentUser }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [type, setType] = useState("")
    const [loading, setLoading] = useState(false)
    const [editRowData, setEditRowData] = useState({})
    const [editRow, setEditRow] = useState(false);
    const [asset, setAsset] = useState([
        {
            asset_id: 2,
            comments: null,
            cost: 0.0,
            dealership_id: 111018,
            description: "Details of quantity of gold",
            // "details": "{\"quantity\": \"400\", \"asset_value\": \"2000\", \"ownership\": \"madhu\"}",
            details: [{ label: "quantity", value: 400 }, { label: "asset_value", value: 2000 }, { label: "ownership", value: "madhu" }],
            id: 4,
            market_value: 0.0,
            name: "Gold",
            ownership: "owner",
            ownership_proof: null
        },
        {
            asset_id: 4,
            comments: null,
            cost: 0.0,
            dealership_id: 111018,
            description: "Details of Land",
            details: [{ label: "Address", key: "address", value: "test  land address" }],
            id: 5,
            market_value: 0.0,
            name: "Land",
            ownership: "owner",
            ownership_proof: null
        },
        {
            asset_id: 4,
            comments: null,
            cost: 0.0,
            dealership_id: 111018,
            description: "Details of Land",
            details: [{ label: "address", value: "test  land address" }, { label: "asset_value", value: "200" }, { label: "ownership", value: "owner name new" }],
            id: 6,
            market_value: 0.0,
            name: "Land",
            ownership: "owner",
            ownership_proof: null
        }
    ])
    const [assetData, setAssetData] = useState([])
    const [assetList, setAssetList] = useState([])


    useMount(() => {
        getAssetList()
            .then(result => {
                let list = [], d = [];
                result.forEach((item, i) => {
                    list.push({
                        label: item.name,
                        value: item.asset_id
                    })
                    d.push({
                        ...item,
                        details: typeof (item.details) === "string" ? JSON.parse(item.details) : (item.details || [])
                    })
                })
                setAssetList(list);
                setAssetData(d);
            })
            .catch((e) => {
                console.log(e);
            })
        // getAssetDataById(dealer_id)
        //     .then(data => {
        //         let d = [];
        //         data.forEach((item, i) => {
        //             d.push({
        //                 ...item,
        //                 details: typeof (item.details) === "string" ? JSON.parse(item.details) : (item.details || [])
        //             })
        //         })
        //         setAsset(d)
        //     })
        //     .catch((e) => {
        //         console.log(e);
        //     })

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
            const data = { asset_id: type.value, details: { ...values } }
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
            addAssetDetailsById(data, dealer_id)
                .then(res => {
                    enqueueSnackbar(res, {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'success',
                    });
                    // setTimeout(() => {
                    //     window.location.reload()
                    // }, 1500);
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
    const editAssetRow = (item, i) => {
        setEditRow(true)
        console.log("asset row", item)
        setEditRowData(item)
    }
    const deleteAssetRow = (item, i) => {
        console.log("delete asset row", item)
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
                                            assetData?.map((data) => {
                                                return (
                                                    <>
                                                        {
                                                            data.asset_id === type?.value ? (
                                                                <Grid container spacing={2}>
                                                                    {
                                                                        Array.isArray(data.details) && data.details.map((item, i) => {
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
                                                                    {/* <Grid item md={6}>
                                                                        <TextInput
                                                                            {...inputProps}
                                                                            labelText="Ownership proof"
                                                                            name="ownership_proof"
                                                                            value={values.ownership_proof}
                                                                            error={errors.ownership_proof}
                                                                            helperText={errors.ownership_proof}
                                                                        >
                                                                        </TextInput>
                                                                    </Grid> */}
                                                                </Grid>
                                                            ) : null
                                                        }
                                                    </>
                                                )
                                            })
                                        }

                                    </>
                                    <Grid container spacing={2}>
                                        {
                                            editRow ? (
                                                <AssetDetailsCard id={dealer_id} data={editRowData} />
                                            ) : (
                                                asset.map((item, i) => {
                                                    return (
                                                        <Grid item md={6}>
                                                            <PreviewCard
                                                                onEdit={() => { editAssetRow(item, i) }}
                                                                onDelete={() => deleteAssetRow(item, i)}
                                                            >
                                                                <Grid container spacing={2}>
                                                                    <Grid item md={6}>
                                                                        <ViewData title="Asset Type" value={item.name} />
                                                                        <ViewData title="Ownership" value={item.ownership} />

                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        {
                                                                            item.details?.map((item, i) => {
                                                                                return (
                                                                                    <ViewData title={item.label} value={item.value} />
                                                                                )
                                                                            })
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </PreviewCard>
                                                        </Grid>
                                                    )
                                                })

                                            )
                                        }
                                    </Grid>

                                </div>
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
                            {loading ? <CircularProgress size={20} /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </div >


    )
}

export default AddAssetDetailsForm;