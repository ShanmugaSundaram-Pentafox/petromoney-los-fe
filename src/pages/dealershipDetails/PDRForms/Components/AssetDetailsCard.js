import { Grid } from '@material-ui/core';
import React from 'react';
import TextInput from '../../../../components/TextInput/TextInput';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const AssetDetailsCard = ({ data }) => {

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
    return (
        <>
            <Grid item md={6}>
                <TextInput
                    {...inputProps}
                    labelText="name"
                    name="name"
                    value={values.name}
                    error={errors.name}
                    helperText={errors.name}
                >
                </TextInput>
            </Grid>
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
            {
                values.details.map((item, i) => {
                    return (
                        <Grid item md={6}>
                            <TextInput
                                {...inputProps}
                                labelText={item.label}
                                name={item.value}
                                value={item.value}
                            >
                            </TextInput>
                        </Grid>
                    )
                })
            }

        </>

    )
}

export default AssetDetailsCard;