import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React, { useState } from 'react';
import { PreviewCardBank } from '../../../../components/CommonComponents/Cards/PreviewCard';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import CustomToken from '../../../../components/CommonComponents/CustomToken';
import { ViewData } from '../../../../components/CommonComponents/FilePreview';
import { bankAccValidate, deleteBankDetailsByID } from '../../../../services/PDReport.services';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useQueryClient } from 'react-query';
import { logger } from '../../../../config/logger';

const useStyles = makeStyles((theme) => ({
  token: {
    position: 'absolute', top: 0, right: 0, borderRadius: '0px 4px 0px 4px'
  },
  tokenSuccess: {
    backgroundColor: '#2eaf67'
  },
  tokenError: {
    backgroundColor: '#ef5454'
  },
  btnSuccess: {
    marginLeft: 16,
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  text: {
    margin: 15, textAlign: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center'
  },
  success: {
    color: '#2eaf67'
  },
  error: {
    color: '#ef5454'
  }
}))

const BankDetailsCard = ({ id, data, editBankDetails, editable, currentUser }) => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles()
  const [bankVerify, setBankVerify] = useState()
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verifiedDetails, setVerifiedDetails] = useState()

  const editBankRow = (rowData, rowIndex) => {
    editBankDetails(rowData, rowIndex)
  }
  const deleteBankRow = (row, index) => {
    deleteBankDetailsByID(row, id)
      .then(data => {
        console.log(data)
        enqueueSnackbar(data, {
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
      .catch((e) => {
        console.log(e);
      })
  }

  const verifyBank = () => {
    setVerificationLoading(true)
    bankAccValidate(bankVerify?.account_no, bankVerify?.ifsc)
      .then(res => {
        setVerificationLoading(false)
        queryClient.invalidateQueries('bank-data')
        setVerifiedDetails(res)
        setTimeout(() => {setBankVerify(); setVerifiedDetails();}, 1000)
      })
      .catch(e => {
        logger(e)
        setVerifiedDetails(e)
        setVerificationLoading(false)
      })
  }

  return (
    <Grid container spacing={2} style={{ marginTop: 4 }}>{
      data.map((item, i) => {
        return (
          <Grid item md={6} key={item.id}>
            <PreviewCardBank
              id={item.id}
              onEdit={() => { editBankRow(item, i) }}
              onDelete={() => deleteBankRow(item, i)}
              verified={item?.bank_verified}
              onCustom={() => setBankVerify(item)}
              tokenLabel='Verify Bank'
              customIcon={<AccountBalanceOutlinedIcon color='primary' />}
              action={!editable}
              verifiedDate={item?.last_verified_date}
              currentUser={currentUser}
            >
              <span className={classNames(classes.token, item?.bank_verified ? classes.tokenSuccess : classes.tokenError)}><CustomToken variant={item?.bank_verified ? 'success' : 'error'} label={item?.bank_verified ? 'verified' : 'unverified'} icon={item?.bank_verified ? 'tick' : 'cross'} /></span>
              <Grid container spacing={2} style={{ marginTop: 4 }}>
                <Grid item md={6}>
                  <ViewData title="Acc. Holder's name" value={item.account_name} />
                  <ViewData title="Acc. type" value={item.account_type} />
                  <ViewData title="Bank name" value={item.bank_name} />
                  <ViewData title="City" value={item.bank_city} />
                  <ViewData title="Security" value={item.security} />
                </Grid>
                <Grid item md={6}>
                  <ViewData title="Acc. number" value={item.account_no} />
                  <ViewData title="IFSC code" value={item.ifsc} />
                  <ViewData title="Branch" value={item.bank_branch} />
                  <ViewData title="Acc. since" value={item.account_since} />
                </Grid>
              </Grid>
            </PreviewCardBank>
          </Grid>
        )
      })
    }
      <Dialog
      fullWidth
      maxWidth={'sm'}
      open={bankVerify}
      >
        <DialogContent>
          <Typography variant="h5" style={{textAlign: 'center', marginBottom: 8}}>Account Verification</Typography>
          <Alert severity='warning' variant='outlined'>
            <AlertTitle>Note</AlertTitle>
            <Typography variant='body1'>As a part of account verification process an amount of ₹1 will be deposited on your account. Please do not close this window until the process is completed.</Typography>
          </Alert>
          <Collapse in={verificationLoading}>
            <Typography variant='h5' className={classes.text}>
              Verifying your account
              <CircularProgress size={20} style={{ marginLeft: 10 }} />
            </Typography>
          </Collapse>
          <Collapse in={verifiedDetails}>
            {
              verifiedDetails?.details ?
                <Typography variant='h5' className={classNames(classes.text, classes.success)} >
                  <CheckCircleOutlinedIcon style={{ marginRight: 8 }} />
                  Account Verified Successfully
                </Typography> :
                <Typography variant='h5' className={classNames(classes.text, classes.error)} >
                  <CancelOutlinedIcon style={{ marginRight: 8 }} />
                  Account Not Verified
                </Typography>
            }
          </Collapse>
          <div style={{display: 'flex', justifyContent: 'center', marginTop:16, marginBottom: 8}}>
            <Button variant='outlined' disabled={verificationLoading} onClick={() => { setBankVerify(); setVerifiedDetails(); }}>Cancel</Button>
            {
              !bankVerify?.bank_verified &&
              <Button variant='contained' disabled={verificationLoading} className={classes.btnSuccess} onClick={() => verifyBank()}>Verify</Button>
            }
          </div>
        </DialogContent>
      </Dialog>
    </Grid>
  )

}

export default BankDetailsCard;