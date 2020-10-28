import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Currency from '../../../components/Number/Currency';
import { useMount } from 'react-use';
import { getDealershipLoansById } from '../../../services/dealerships.service';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { updateLoanApprovalStatusById } from '../../../services/loans.service';
import TextInput from '../../../components/TextInput/TextInput';

const useStyles = makeStyles({
  wrapper: {
    padding: 8
  },
  title: {
    paddingLeft: 8,
    marginBottom: 8
  },
  table: {
    // minWidth: 650,
    padding: 8
  },
});

const LoansList = ({ id, currentUser, titleAlign }) => {
  const classes = useStyles();
  const [data, setLoansData] = useState();
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState();
  const [dialogState, setDialogState] = useState({});
  
  useMount(() => {
    getDealershipLoansById(id)
      .then(data => setLoansData(data))
      .catch(e => null)
  });

  const processLoan = loan => {
    let status;
    if(loan.status.toLowerCase() === "submitted") {
      setLoading(true);
      status = 'loan_approval';
    } else if (loan.status.toLowerCase() === "approved") {
      setLoading(true);
      status = 'disbursement_approval'
    }

    status && updateLoanApprovalStatusById(id, loan.id, { user_id: currentUser.id, status, recommendation_remarks: remarks })
      .then(res => {
        setLoansData(res);
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

  if(!data || !data.length)
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
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.type}</TableCell>
              <TableCell align="right"><Currency value={row.amount_requested} /></TableCell>
              <TableCell align="right">
                <Tooltip title={row.remarks} arrow>
                  <Currency value={row.amount_approved} />
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={row.remarks} arrow>
                  <Currency value={row.amount_disbursed} />
                </Tooltip>
              </TableCell>
              <TableCell align="center">{row.status}</TableCell>
              <TableCell align="center">
                {
                  row.status.toLowerCase() === "submitted" && editable && (
                    <Button
                      variant="outlined"
                      color="primary"
                      fontSize="small"
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
                  row.status.toLowerCase() === "approved" && editable && (
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
                  row.status.toLowerCase() === "loan_approval" && 'Pending for approval'
                }
                {
                  row.status.toLowerCase() === "disbursement_approval" && 'Pending for disbursement approval'
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
        <DialogTitle id="approval-remarks">Remarks: Send for {dialogState.data?.status?.toLowerCase() === 'submitted' ? `Approval` : 'Disbursement Approval'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="approval-remarks-desc">
            Please enter your remarks for sending this for {dialogState.data?.status?.toLowerCase() === 'approved' ? `approval` : 'disbursement approval'}.
          </DialogContentText>
          <TextInput
            multiline
            rows={4}
            rowsMax={8}
            labelText="Remarks*"
            alignTop
            placeholder="Enter your remarks here."
            value={remarks}
            onChange={e => {
              setRemarks(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogState({})} color="primary">
            Cancel
          </Button>
          <Button disabled={!remarks || loading} onClick={submitRemarks} color="primary" autoFocus>
            {loading ? `Please wait...` : `Confirm`}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LoansList;