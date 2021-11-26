import { Select as MSelect } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
// import ButtonGroup from '@material-ui/core/ButtonGroup';
import LoanStatusDialog from './LoanStatusDialog';
import Currency from '../../../components/Number/Currency';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
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



const LoansList = ({ id, titleAlign, currentUser, dealerData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState();
  const [dialogState, setDialogState] = useState({});
  const [status, setStatus] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getDealershipLoansById(id)
      .then(data => setData(data))
      .catch(err => console.log('Loans fetch error >>', err))
    getApplicationStatusById(id)
      .then(data => {
        setStatus(data)
        if (dealerData[0].application_state_id) {
          const re = data.find(d => d.id == dealerData[0].application_state_id)
          setSelectedStatus({ ...re, disabled: status !== 'loan_approval' } || {})
        }
      })
      .catch(e => console.log('Error >>>>', e))
  }, [id, dealerData])


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

    status && updateLoanApprovalStatusById(id, loan.id, 'approval', { user_id: currentUser.id, status: 'approval', ...remarksObj })
      .then(res => {
        setData(res.loans);
        setLoading(false);
        setDialogState({});
      })
      .catch(err => {
        setLoading(false);
        setDialogState({});
        console.log('Loan Status update error - ', err)
      })
  }

  const getRemarks = loan => () => {
    setDialogState({ open: true, data: loan });
  }
  const submitRemarks = () => {
    processLoan({ ...dialogState.data });
  }

  const updateApplicationStatus = (state) => {
    apiCall(`dealership/${id}/loans/${data[0].id}`, {
      method: 'POST',
      body: state,
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          getDealershipLoansById(id)
            .then(data => setData(data))
            .catch(e => console.log('Error >>>>>>', e))
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
  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit)

  return (
    <>
      {
        Array.isArray(data) && data.length ? (
          <>
            <Typography variant="h5" align={titleAlign} className={classes.title}>Loans</Typography>
            <Table className={classes.table} size="small" aria-label="Dealers">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Req amt.</TableCell>
                  <TableCell align="right">Appr</TableCell>
                  <TableCell align="right">Disb</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Application Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map(row => (
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
                        <option value={selectedStatus}>{row.application_state}</option>
                        {
                          status.map(item => item.application_state !== row.application_state && <option value={item.id}>{item.application_state}</option>)
                        }
                      </MSelect>
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
                            onClick={getRemarks(row)}
                          >
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
              open={dialogState?.open}
            // onClose={setDialogState({})}
            >
              <LoanStatusDialog data={data} callback={(e) => setRemarks(e.target.value)} status={dialogState?.data?.status?.toLowerCase()} remarks={remarks} handleUser={(e) => setUser(e)} />
              <DialogActions>
                <Button
                  onClick={() => setDialogState({})}
                  color="primary">
                  Cancel
                </Button>
                <Button disabled={!remarks || loading} onClick={submitRemarks} color="primary">
                  {loading ? 'Please wait...' : 'Confirm'}
                </Button>
              </DialogActions>
            </Dialog>

          </>
        ) : (
          <h1>Invalid data</h1>
        )
      }
    </>
  )
}
export default LoansList;