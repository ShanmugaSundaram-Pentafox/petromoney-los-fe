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
import Typography from '@material-ui/core/Typography';
import Currency from '../../../components/Number/Currency';
import { useMount } from 'react-use';
import { getDealershipLoansById } from '../../../services/dealerships.service';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { updateLoanApprovalStatusById } from '../../../services/loans.service';

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

    status && updateLoanApprovalStatusById(id, loan.id, { user_id: currentUser.id, status })
      .then(res => {
        setLoansData(res);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('Loan Status update error - ', err)
      })
  }

  const editable = permissionCheck(currentUser.role_name, rulesList.dealership_edit)

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
                      onClick={() => processLoan(row)}>
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
                      onClick={() => processLoan(row)}>
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
    </div>
  )
}

export default LoansList;