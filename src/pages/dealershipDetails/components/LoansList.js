import { Select as MSelect } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import Currency from '../../../components/Number/Currency';
import TextInput from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getUserRoleForReview } from '../../../services/common.service';
import { getDealershipLoansById } from '../../../services/dealerships.service';
import { getApplicationStatusById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import apiCall from '../../../utils/api.util';


const useStyles = makeStyles({
  wrapper: {
    padding: 8
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    padding: 8
  },
});

const LoansList = ({ id, currentUser, titleAlign }) => {
  const queryClient = useQueryClient()
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState();
  const [dialogState, setDialogState] = useState({});
  const [user, setUser] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { data: loanData = [], isLoading } = useQuery(['dealership-loans', id], () => getDealershipLoansById(id), {refetchOnWindowFocus: false})
  const { data: status } = useQuery(['dealership-status', id], () => getApplicationStatusById(id), {refetchOnWindowFocus: false})
  useEffect(() => {
    if (!isLoading) {
      if (loanData.length) {
        let val = loanData[0].status === 'submitted' ? 'is_review=1' : 'is_approve=1'
        getUserRoleForReview(val)
          .then(res => {
            let d = [];
            res.forEach((item, i) => {
              d.push({
                label: <div>{item.first_name} {item.last_name}</div>,
                value: item.id
              })
            })
            setUserRole(d);
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
    if (loanData[0]?.application_state_id) {
      const re = status.find(d => d.id == loanData[0]?.application_state_id)
      setSelectedStatus({ ...re, disabled: status !== 'loan_approval' } || {})
    }
  }, [status, loanData])

  const processLoan = loan => {
    let status, remarksObj = {};
    if (loan?.status?.toLowerCase() === 'submitted') {
      setLoading(true);
      status = 'loan_review';
      remarksObj.reviewer_id = user.value;
      remarksObj.review_remarks = remarks;
    } else if (loan?.status?.toLowerCase() === 'loan_review') {
      setLoading(true);
      status = 'loan_approval';
      remarksObj.approver_id = user.value;
      remarksObj.recommendation_remarks = remarks;
    }
    else if (loan?.status?.toLowerCase() === 'approved') {
      setLoading(true);
      status = 'disbursement_approval';
      remarksObj.disbursement_recommendation_remarks = remarks;
    }

    status && updateLoanApprovalStatusById(id, loan.id, 'approval', { user_id: currentUser.id, ...remarksObj })
      .then(res => {
        queryClient.invalidateQueries(['dealership-loans', id])
        setLoading(false);
        setDialogState({});
      })
      .catch(err => {
        setLoading(false);
        setDialogState({});
        console.log('Loan Status update error - ', err)
      })
  }

  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit)

  const getRemarks = loan => () => {
    setDialogState({ open: true, data: loan });
  }

  const submitRemarks = () => {
    processLoan({ ...dialogState.data });
  }
  const updateApplicationStatus = (state) => {
    apiCall(`dealership/${id}/loans/${loanData[0].id}`, {
      method: 'POST',
      body: state,
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          queryClient.invalidateQueries(['dealership-loans', id])
          enqueueSnackbar(res.message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          })
        }
      })
      .catch(err => {
        console.log(err)
      })

  }

  if (!loanData || !loanData.length)
    return (
      <div className={classes.wrapper}>
        <Typography variant="h5" align={titleAlign} className={classes.title}>No Loan details found</Typography>
      </div>
    );
  return (
    <div className={classes.wrapper}>
      <Typography variant="h5" align={titleAlign} className={classes.title}>Loans</Typography>
      <Table className={classes.table} size="small" aria-label="Dealers">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align="right">Req</TableCell>
            <TableCell align="right">Appr</TableCell>
            <TableCell align="right">Disb</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Application Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(loanData) && loanData?.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.type}</TableCell>
              <TableCell align="right"><Currency value={row.amount_requested} /></TableCell>
              <TableCell align="right">
                <Tooltip title={row.approval_remarks} arrow>
                  <Currency value={row.amount_approved} />
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={row.disbursement_approval_remarks} arrow>
                  <Currency value={row.amount_disbursed} />
                </Tooltip>
              </TableCell>
              <TableCell align="center">{row.status}</TableCell>
              <TableCell align="center">
                {
                  row?.status?.toLowerCase() !== 'disbursed' && row?.status?.toLowerCase() !== 'rejected' &&
                    <MSelect
                      fullWidth
                      native
                      placeholder={'Select status'}
                      value={selectedStatus?.id}
                      onChange={e => {
                        const d = status.find(i => i.id == e.target.value)
                        setSelectedStatus(d)
                        updateApplicationStatus({
                          application_state: e.target.value
                        })
                      }}
                    >
                      <option value=''>-</option>
                      {
                      status?.map(item => item.application_state !== row.application_state && <option value={item.id}>{item.application_state}</option>)
                      }
                    </MSelect>
                }
              </TableCell>
              <TableCell align="center">
                {
                  row?.status?.toLowerCase() === 'submitted' && editable && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size='small'
                      disabled={loading}
                      className={classes.btnSuccess}
                      onClick={getRemarks(row)}>
                      {
                        loading ? 'Pleaes wait...' : 'Send for review'
                      }
                    </Button>
                  )
                }
                {
                  row?.status?.toLowerCase() === 'loan_review' && editable && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size='small'
                      disabled={loading}
                      className={classes.btnSuccess}
                      onClick={getRemarks(row)}>
                      {
                        loading ? 'Pleaes wait...' : 'Send for Approval'
                      }
                    </Button>
                  )
                }
                {
                  row?.status?.toLowerCase() === 'approved' && editable && (
                    <Button
                      variant="outlined"
                      color="primary"
                      fontSize="small"
                      disabled={loading}
                      className={classes.btnSuccess}
                      onClick={getRemarks(row)}>
                      {
                        loading ? 'Pleaes wait...' : 'Send for Disbursement Approval'
                      }
                    </Button>
                  )
                }
                {
                  row?.status?.toLowerCase() === 'loan_approval' && 'Pending for approval'
                }
                {
                  row?.status?.toLowerCase() === 'disbursement_approval' && 'Pending for disbursement approval'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={dialogState.open}
        onClose={() => setDialogState({})}
        aria-labelledby="approval-remarks"
        aria-describedby="approval-remarks-desc"
      >
        <DialogTitle id="approval-remarks">Remarks: Send for {dialogState.data?.status?.toLowerCase() === 'submitted' ? 'review' : dialogState.data?.status?.toLowerCase() === 'loan_review' ? 'Approval' : 'Disbursement Approval'}</DialogTitle>
        <DialogContent>
          {
            dialogState.data?.status?.toLowerCase() === 'submitted' && (
              <div style={{ marginBottom: 20 }}>
                <DialogContentText id="approval-remarks-desc">
                  Please choose whom did you want to sent for review.
                </DialogContentText>
                <Select
                  isClearable
                  name='type'
                  onChange={setUser}
                  options={userRole}
                  menuPlacement='bottom'
                  menuPosition='fixed'
                  maxMenuHeight='200px'

                />
              </div>
            )
          }
          {
            dialogState.data?.status?.toLowerCase() === 'loan_review' && (
              <div style={{ marginBottom: 20 }}>
                <DialogContentText id="approval-remarks-desc">
                  Please choose whom did you want to sent for approval.
                </DialogContentText>
                <Select
                  isClearable
                  name='review'
                  onChange={setUser}
                  options={userRole}
                  menuPlacement='bottom'
                  menuPosition='fixed'
                  maxMenuHeight='250px'
                />
              </div>
            )
          }
          <div>
            <DialogContentText id="approval-remarks-desc">
              Please enter your remarks for sending this for {dialogState.data?.status?.toLowerCase() === 'submitted' ? 'review' : dialogState.data?.status?.toLowerCase() === 'loan_review' ? 'Approval' : 'Disbursement Approval'}.
            </DialogContentText>
            <TextInput
              multiline
              alignTop
              direction='column'
              rows={4}
              rowsMax={8}
              labelText="Remarks*"
              placeholder="Enter your remarks here."
              value={remarks}
              onChange={e => {
                setRemarks(e.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogState({})} color="primary">
            Cancel
          </Button>
          <Button disabled={!remarks || loading} onClick={submitRemarks} color="primary">
            {loading ? 'Please wait...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LoansList;