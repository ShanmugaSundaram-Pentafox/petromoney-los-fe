import { Grid, Divider, CircularProgress } from '@material-ui/core';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Button from '../../../../components/CommonComponents/Button/Button';
import { ViewData } from '../../../../components/CommonComponents/FilePreview';
import TextInput from '../../../../components/TextInput/TextInput';
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
const AssetsEditForm = ({ dealer_id, assetData = {}, data, handleClose }) => {
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
    const { asset_id, id } = data
    const { asset_value, market_value, ownership, ownership_proof, relationship } = values
    delete values.asset_value; delete values.market_value; delete values.ownership_proof; delete values.relationship;
    const d = { asset_id, asset_value, market_value, ownership, ownership_proof, relationship, details: { ...values } }
    updateAssetDetailsById(d, dealer_id, id)
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
    direction: 'column',
    alignTop: true,
  }
  if (!data?.details) return null

  return (
    <Formik
      initialValues={{ ...data?.details, ...data }}
      validateOnBlur
      validateOnChange={false}
      onSubmit={submitForm}
    >
      {
        ({ values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues }) => (
          <>
            <label style={{ marginBottom: '20px' }}><strong>Asset type : </strong> {data.name}</label>
            <Grid container spacing={2}>
              {
                fields.length ? fields.map((item, i) => (
                  <Grid item md={6} key={i}>
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
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  number
                  labelText="Asset Value"
                  name="asset_value"
                  value={values.asset_value}
                  error={errors.asset_value}
                  helperText={errors.asset_value}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  number
                  labelText="Market value"
                  name="market_value"
                  value={values.market_value}
                  error={errors.market_value}
                  helperText={errors.market_value}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  select
                  labelText="Ownership"
                  name="ownership"
                  value={values.ownership}
                  error={errors.ownership}
                  helperText={errors.ownership}
                  onChange={handleChange}
                >
                  <option value="">Choose ownership</option>
                  <option value="Self owned">Self owned</option>
                  <option value="Family owned">Family owned</option>
                  <option value="Partnership">Partnership</option>
                  {/* {type.label !== "Gold" && <option value="Leased">Leased</option>} */}
                </TextInput>
              </Grid>
              {/* <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  labelText="Ownership Proof"
                  name="ownership_proof"
                  value={values.ownership_proof}
                  error={errors.ownership_proof}
                  helperText={errors.ownership_proof}
                  onChange={handleChange}
                />
              </Grid> */}
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
    </Formik >
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
        fields.length ? fields.map((item, i) => (
          <ViewData title={item.label} value={item.value} key={i} />
        )) : null
      }
    </>
  )

}