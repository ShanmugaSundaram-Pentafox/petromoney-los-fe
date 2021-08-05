import { TextField } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { updatePassword } from '../../../services/common.service';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Button from '../../../components/CommonComponents/Button/Button';
import { Typography } from '@material-ui/core';
import { Divider } from '@material-ui/core';


const useStyles = makeStyles(theme => ({

    passwordWrapper: {
        marginTop: 10,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    textFieldStyle: {
        marginBottom: '12px',
        display: 'block',

        '& .MuiInputLabel-formControl': {
            fontSize: '13px',
            lineHeight: '140%',
            color: '#909191',
            top: '-6px',
        },
        '& .MuiInputBase-formControl': {
            minWidth: '40%',
        },
        '& .MuiInputBase-input': {
            fontWeight: '500',
            fontSize: '13px',
            lineHeight: '140%',
            width: '100%',
        }
    },
}));

const PasswordForm = ({ data, callback }) => {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const { values, errors, handleChange, handleSubmit, setValues, isSubmitting, setSubmitting, setFieldValue } = useFormik({
        initialValues: {},
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: Yup.object().shape({
            password: Yup.string().required('Enter the Password'),
            confirm_password: Yup.string().required('Enter the Password'),
        }),
        onSubmit: values => {
            const d = { ...values };
            d.password = (d.password + '').trim();
            d.confirm_password = (d.confirm_password + '').trim();

            if (d.password && d.confirm_password && d.password === d.confirm_password) {
                updatePassword(d, data.id)
                    .then(res => {
                        enqueueSnackbar(res, {
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success',
                        }
                        )
                        setTimeout(() => {
                            window.location.reload(false);
                        }, 2000)
                    })
                    .catch(err => {
                        console.log(err)
                    })

            } else {
                if (!(d.password === d.confirm_password) && d.password && d.confirm_password) {
                    enqueueSnackbar('Password does not match', {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'warning',
                    }
                    )
                }
                else {
                    enqueueSnackbar('Please enter valid password', {
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        variant: 'warning',
                    }
                    )

                }

            }

        }
    });

    return (
        <>
            <Divider />
            <Box mb={2}>
                <Typography variant="h4" component="h3" style={{ marginTop: 4 }}>Change password</Typography>

                {
                    <Box mt={2} mb={2} bgcolor={"#fafafa"}>
                        <TextField
                            margin="dense"
                            name="password"
                            label="Enter New Password"
                            type="password"
                            value={values.password}
                            className={classes.textFieldStyle}
                            error={errors.password}
                            helperText={errors.password}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            label="Confirm New Password"
                            type="password"
                            name="confirm_password"
                            value={values.confirm_password}
                            className={classes.textFieldStyle}
                            error={errors.confirm_password}
                            helperText={errors.confirm_password}
                            onChange={handleChange}
                        />

                        <div className={classes.passwordWrapper}>
                            <Button variant='outlined' onClick={callback} style={{ marginRight: 4 }}>Cancel</Button>
                            <Button variant='contained' color="primary" onClick={() => { handleSubmit() }}>Save</Button>
                        </div>
                    </Box>
                }
            </Box>
        </>
    )

}
export default PasswordForm;