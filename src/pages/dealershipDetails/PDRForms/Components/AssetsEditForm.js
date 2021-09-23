import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TextInput from '../../../../components/TextInput/TextInput';
import clsx from 'clsx';
import { makeStyles } from "@material-ui/styles";
import { Formik } from 'formik';
import { ViewData } from '../../../../components/CommonComponents/FilePreview';
import { Divider } from '@material-ui/core';
import Button from '../../../../components/CommonComponents/Button/Button';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@material-ui/core';
import { updateAssetDetailsById } from '../../../../services/PDReport.services';

const useStyles = makeStyles((theme) => ({
  actionFooter: {
    marginTop: 12,
    width: '100%'
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'end',
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
const AssetsEditForm = ({ id, assetData = {}, data, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(assetData.details)) {
      const f = assetData.details.map(item => {
        return {
          ...item,
          value: data?.details?.[item.key],
        }
      });
      setFields(f);
    }
  }, [assetData, data])

  const submitForm = values => {
    const d = { ...data, details: { ...values } }
    updateAssetDetailsById(d, id)
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
  const inputProps = {
    direction: "column",
    alignTop: true,
  }
  if (!data?.details) return null

  return (
    <Formik
      initialValues={{ ...data?.details }}
      validateOnBlur
      validateOnChange={false}
      onSubmit={submitForm}
    >
      {
        ({ values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues }) => (
          <>
            <Grid container spacing={2}>
              {
                fields.length ? fields.map(item => (
                  <Grid item md={6}>
                    <TextInput
                      {...inputProps}
                      labelText={item.label}
                      name={item.key}
                      value={values[item.key]}
                      error={errors[item.key]}
                      helperText={errors[item.key]}
                      onChange={handleChange}
                    />
                  </Grid>
                )) : null
              }
            </Grid>
            {
              fields.length ? (
                <div className={classes.actionFooter}>
                  <Divider />
                  <div className={classes.actionButtonsWrapper}>
                    <div>
                      <Button
                        variant="outlined"
                        style={{ margin: 4 }}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        type="submit"
                        style={{ margin: 4 }}
                        className={clsx(classes.btn, classes.editButton)}
                        startIcon={<NavigateNextRounded />}
                        onClick={loading ? () => null : handleSubmit}
                      >
                        {loading ? <CircularProgress size={20} /> : 'Save'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null
            }
          </>
        )
      }
    </Formik>
  )
}

export default AssetsEditForm;

export const AssetCard = ({ id, assetData = {}, data }) => {
  const [fields, setFields] = useState([])
  useEffect(() => {
    if (Array.isArray(assetData.details)) {
      const f = assetData.details.map(item => {
        return {
          ...item,
          value: data?.details?.[item.key],
        }
      });
      setFields(f);
    }
  }, [assetData, data])
  return (
    <>
      {
        fields.length ? fields.map(item => (
          <ViewData title={item.label} value={item.value} />
        )) : null
      }
    </>
  )

}