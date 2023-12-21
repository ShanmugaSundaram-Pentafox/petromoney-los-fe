import { Button, Dialog, DialogContent, Tooltip, Typography } from '@material-ui/core';
import { CheckCircleOutline } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SyncIcon from '@material-ui/icons/Sync';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import styled from 'styled-components'
import { action_id, resources_id } from '../../../config/accessControl';
import CheckAllowed from '../../../pages/rbac/CheckAllowed';
import { changeBankStatusById, syncBankDetailsWithLMS } from '../../../services/PDReport.services';
import DeleteButton from '../Button/DeleteButton';

const Card = styled.div`
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  box-shadow: rgb(0 0 0 / 12%) 0px 0px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;

  .card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px  0px 15px;
  }

  .card-footer {
    // background-color: #f9f9f9;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border-radius: 0 0 4px 4px;
  }

  .card-footer-left {
    display: flex;
    padding-bottom: 6px;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 0 0 4px 4px;
  }
`;
const useStyles = makeStyles((theme) => ({
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
}))


const PreviewCard = ({ children, action = true, onEdit, onDelete, onCustom, customButton = false, customIcon, token = false, tokenLabel, tokenIcon, variant }) => {
  const classes = useStyles()
  const [deleteModal, setDeleteModal] = useState(false)

  return (
    <Card style={{ marginBottom: 0 }}>
      <div className="card-body">
        {children}
      </div>
      {
        action &&
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10 }} >
            <div>
              {
                customButton &&
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    style={{ margin: 4 }}
                    className={classes.btnSuccess}
                    startIcon={customIcon ? customIcon : <InfoOutlinedIcon color="primary" />}
                    onClick={onCustom}
                  >
                    {tokenLabel}
                  </Button>
              }
            </div>
            <div className='card-footer'>
              <Button
                size="small"
                variant="outlined"
                color="success"
                style={{ margin: 4 }}
                className={classes.btnSuccess}
                startIcon={<EditIcon color="primary" />}
                onClick={onEdit}
              >
                Edit
              </Button>
              <DeleteButton deleteModal={deleteModal} deleteAction={onDelete} setDeleteModal={setDeleteModal} />
            </div>
          </div>
      }
    </Card>
  )
}
export default PreviewCard;

export const PreviewCardBank = ({ id, children, onVerify, onEdit, action = true, onDelete, onCustom, verified = false, customIcon, tokenLabel, verifiedDate, currentUser, data }) => {
  const classes = useStyles()
  const [deleteModal, setDeleteModal] = useState(false)
  const [bankStatus, setBankStatus] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient()


  const handleSync = () => {
    syncBankDetailsWithLMS(id)
      .then((res) => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
  }

  const bankStatusChange = () => {
    const body = {
      is_active: data?.is_active == 1 ? 0 : 1,
      account_number: data?.account_no,
    };
    changeBankStatusById({ dealershipId: data?.dealership_id, data: body })
      .then((res) => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      });
  }

  return (
    <>
      <Card style={{ marginBottom: 0, backgroundColor: data?.is_active == 1 ? null : '#ffe7e7' }}>
        <div className="card-body">
          {children}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: 10 }} >
          {data?.is_active == 1 ? (
            verified ?
              <Typography variant='body2' style={{ color: 'rgb(0,0,0,0.4)', margin: '16px 0px' }}>
                {`Last Verified: ${verifiedDate || '-'}`}
              </Typography> : (
                <div className='card-footer-left'>
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankVerify}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      style={{ margin: 4 }}
                      className={classes.btnSuccess}
                      startIcon={customIcon ? customIcon : <InfoOutlinedIcon color="primary" />}
                      onClick={onCustom}
                    >
                      &nbsp;{tokenLabel} &nbsp;
                    </Button>
                  </CheckAllowed>
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.manualBankVerify}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      style={{ margin: 4 }}
                      startIcon={customIcon ? customIcon : <InfoOutlinedIcon color="primary" />}
                      className={classes.btnSuccess}
                      onClick={onVerify}
                    >
                      Manual verify
                    </Button>
                  </CheckAllowed>
                </div>
              )
          ) : <div></div>
          }
          {
            verified ? (
              <Tooltip title={'click to sync bank to LMS'}>
                <div className='card-footer'>
                  {data?.is_active == 1
                    ? (<>
                      <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankSync}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          style={{ margin: 4 }}
                          className={classes.btnSuccess}
                          startIcon={<CheckCircleOutline style={{ color: '#ccc' }} />}
                          onClick={() => setBankStatus({ status: data?.is_active, modal: true })}
                        >
                          Deactivate
                        </Button>
                      </CheckAllowed>
                      <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankSync}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          style={{ margin: 4 }}
                          className={classes.btnSuccess}
                          startIcon={<SyncIcon color="primary" />}
                          onClick={handleSync}
                        >
                          Sync bank
                        </Button>
                      </CheckAllowed>
                    </>
                    ) : (
                      <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankSync}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          style={{ margin: 4 }}
                          className={classes.btnSuccess}
                          startIcon={<CheckCircleOutline style={{ color: 'green' }} />}
                          onClick={() => setBankStatus({ status: data?.is_active, modal: true })}
                        >
                          Activate
                        </Button>
                      </CheckAllowed>
                    )
                  }
                </div>
              </Tooltip>
            ) : null
          }
          {
            (!verified && data?.is_active == 1) && (
              <div className='card-footer'>
                <CheckAllowed
                  currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankEdit}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    style={{ marginBottom: 8, marginLeft: 6 }}
                    className={classes.btnSuccess}
                    startIcon={<EditIcon color="primary" />}
                    onClick={onEdit}
                  >
                    Edit
                  </Button>
                </CheckAllowed>
                <CheckAllowed currentUser={currentUser} resource={resources_id?.personalDiscussion} action={action_id?.personalDiscussion?.bankDelete}>
                  <DeleteButton deleteModal={deleteModal} deleteAction={onDelete} setDeleteModal={setDeleteModal} />
                </CheckAllowed>
              </div>
            )

          }

        </div>
      </Card>

      <Dialog
        fullWidth
        onClose={() => setBankStatus(false)}
        maxWidth={'sm'}
        open={bankStatus?.modal || false}
      >
        <DialogContent>
          <Typography variant="h5" style={{ textAlign: 'center', marginBottom: 8 }}>Bank {bankStatus?.status == 0 ? 'Activate' : 'Deactivate'}</Typography>
          <Alert severity='warning' variant='outlined'>
            <AlertTitle>Note</AlertTitle>
            <Typography variant='body1'>{bankStatus?.status == 0 ? 'If this bank is activated then you can able to proceed with this bank to get the loan' : 'If this bank is deactivated then you can\'t able to proceed with this bank'}</Typography>
          </Alert>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: 8, gap: 10 }}>
            <Button variant='outlined' onClick={() => { setBankStatus(false) }}>No</Button>
            <Button variant='contained' className={classes.btnSuccess} onClick={bankStatusChange}>Yes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}