import { Grid } from '@material-ui/core';
import React from 'react';
import TextInput from '../../../../components/TextInput/TextInput';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const AssetDetailsCard = ({ id, assetData, data }) => {

    const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
        initialValues: { ...data },
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            // transport_name: Yup.string().required('Please enter transporter name'),
        }),
        onSubmit: values => {
            const data = { details: { ...values } }
            // addAssetDetailsById(data, id)
            //     .then(res => {
            //         enqueueSnackbar(res, {
            //             anchorOrigin: {
            //                 vertical: 'top',
            //                 horizontal: 'right',
            //             },
            //             variant: 'success',
            //         });
            //         // setTimeout(() => {
            //         //     window.location.reload()
            //         // }, 1500);
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
    console.log("valuessss", values)
    console.log("asset", assetData)
    return (
        <>
            {
                assetData.map((item, i) => {
                    console.log("item", item)
                    console.log("assset idddddddddddddddd check", values.asset_id)
                    return (
                        <>
                            {
                                item.asset_id === values.asset_id ? (
                                    < Grid container spacing={2}>
                                        {
                                            Array.isArray(values.details) && values.details.map((item, i) => {
                                                return (
                                                    <Grid item md={6}>
                                                        <TextInput
                                                            {...inputProps}
                                                            labelText={item.label}
                                                            name={item.label}
                                                            value={item.value}
                                                            error={errors.label}
                                                            helperText={errors.label}
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
                                    </Grid>
                                ) : null
                            }
                        </>
                    )
                })
            }
        </>
    )
}

export default AssetDetailsCard;