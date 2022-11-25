import { Button, CircularProgress, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import SpeedOutlinedIcon from '@material-ui/icons/SpeedOutlined';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { ViewData } from '../../../components/CommonComponents/FilePreview';
import { getCrimeReport } from '../../../services/dealers.service';

const useStyles = makeStyles({
  row: {
    paddingRight: 12,
    paddingBottom: 14
  }
});

const DealerCrimeInfoForm = ({ values, errors, onChange, editMode, dealerData, currentUser, setFieldValue, cibilEditMode, editable }) => {
  let pan = dealerData?.pan
  let userType = dealerData?.userType
  let dealership_id = dealerData?.dealership_id
  let id = dealerData?.id
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState({ icon: false })
  const [cibilData, setCibilData] = useState()
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };

  const crimeReport = () => {
    setLoading({ icon: true, loading: true })
    getCrimeReport(id, userType?.replace(/[- ]/g, '')?.toLowerCase())
      .then(data => {
        setLoading({ icon: true, loading: false, success: true })
        queryClient.invalidateQueries('credit')
        setCibilData(data)
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
        setLoading({ icon: true, loading: false, success: false, error: true })
      })
  }

  const ValidateProps = (valid) => {
    return (
      <div>
        {
          valid?.icon ?
            valid?.loading ? <CircularProgress size={20} /> :
              valid?.success ?
                <CheckCircleOutlineOutlinedIcon fontSize='medium' style={{ color: '#4caf50' }} /> : null : null
        }
      </div>
    )
  }

  return (
    <>
      <Grid container style={{ padding: 8 }}>
        <Grid item md={12} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: 0, alignItems: 'center', paddingRight: 10 }}>
            <ViewData title='Name' value={dealerData?.first_name + ' ' + dealerData?.last_name} style={{ marginBottom: 0 }} />
            <Typography variant='body2' style={{ color: 'rgb(0,0,0,0.4)' }}>{dealerData?.userType}</Typography>
          </div>
        </Grid>
        {
          <>
            {
              !editable &&
                <Grid {...gridItem} md={4}>
                  {<Button variant='outlined' color='primary' style={{ marginTop: 10 }} onClick={crimeReport} startIcon={<SpeedOutlinedIcon />}>Check Crime Data</Button>}
                </Grid>
            }
            <Grid {...gridItem} md={2} style={{ marginTop: 15 }}>
              {ValidateProps(loading)}
            </Grid>
          </>
        }
      </Grid>
    </>
  )
}

export default DealerCrimeInfoForm;
