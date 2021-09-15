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
    const [asset, setAsset] = useState([])
    const [assetCheck, setAssetCheck] = useState([])
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
        getAssetDataById(dealer_id)
            .then(data => {
                let d = [];
                data.forEach((item, i) => {
                    d.push({
                        ...item,
                        details: typeof (item.details) === "string" ? JSON.parse(item.details) : (item.details || [])
                    })
                })
                setAsset(d)
                console.log("dealer asset >>", d)
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
                                            <label style={{ marginBottom: 8 }}>Choose asset type to add</label>
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
                                                                            select
                                                                            labelText="Ownership"
                                                                            name="ownership"
                                                                            value={values.ownership}
                                                                            error={errors.ownership}
                                                                            helperText={errors.ownership}
                                                                        >
                                                                            <option>Self owned</option>
                                                                            <option>Family owned</option>
                                                                            <option>Partnership</option>
                                                                            {type.label !== "Gold" && <option>Leased</option>}
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
                                    <Grid container spacing={2}>
                                        {
                                            editRow ? (
                                                <AssetDetailsCard id={dealer_id} assetData={assetCheck} data={editRowData} />
                                            ) : (
                                                asset.map((item, i) => {
                                                    console.log("item >>>", item)
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
                                                                        {/* {
                                                                            assetData.map((data, i) => {
                                                                                return (
                                                                                    data.asset_id === item.asset_id ? (
                                                                                        <ViewData title={data.label} value={item.}

                                                                                    ): null                                                                                 
                                                                                )
                                                                            })


                                                                        } */}
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