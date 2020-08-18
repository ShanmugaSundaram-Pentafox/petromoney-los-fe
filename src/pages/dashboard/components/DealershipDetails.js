import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Currency from '../../../components/Number/Currency';
import SalesInfo from './SalesInfo';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { selectCurrentUser } from '../../../store/user/user.selector';
import { createStructuredSelector } from 'reselect';

const LoanInfoWrapper = styled.div`
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: rgba(0, 160, 0, 0.15);
`;

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 24,
    paddingTop: 48,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  contentWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  title: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '8px 16px',
    background: theme.palette.grey[300],
    borderBottomRightRadius: 12,
    boxShadow: '0px 0px 4px #8d8d8d',
  },
  gridItemStyle: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    // justifyContent: 'flex-end',
  },
  actionButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 16
  },
  btn: {
    marginLeft: 16
  },
  btnSuccess: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark
    }
  },
  btnError: {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.white
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.error.dark
    }
  }
}));

const LoanInfo = ({
  data,
  status,
  newInfo,
  currentUser,
  setNewLoanInfo
}) => {
  return (
    <LoanInfoWrapper>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Loan Type</TableCell>
            <TableCell align="right">Req. Amount</TableCell>
            <TableCell align="right">Amount Approved</TableCell>
            {
              status == "disbursed" ? <TableCell align="right">Amount Disbursed</TableCell> : null
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            data.map((row, i) => (
              <TableRow key={row.id}>
                <TableCell scope="row" component="th"><strong>{row.type}</strong></TableCell>
                <TableCell align="right"><Currency value={row.amount_requested} /></TableCell>
                <TableCell align="right">
                  {
                    status === "submitted" ? (
                      <UserCan
                        role={currentUser.role_name}
                        perform={rulesList.loan_approval}
                        yes={() => (
                          <TextInput
                            money
                            type="number"
                            fullWidth={false}
                            value={newInfo.amount_approved}
                            onChange={e => {
                              setNewLoanInfo({
                                ...newInfo,
                                [row.type]: e.target.value
                              })
                            }}
                          />
                        )}
                        no={() => "-"}
                      />
                    )
                    : <Currency value={row.amount_approved} /> 
                  }
                </TableCell>
                  {
                    status == "disbursed" ? (
                      <TableCell align="right">
                        <Currency value={row.amount_disbursed} />
                      </TableCell>
                    )  : null
                  }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </LoanInfoWrapper>
  )
}

const DealershipDetails = ({
  data,
  loanData,
  onClose,
  status,
  currentUser
}) => {
  const [values, setValues] = useState({});
  const [loanInfo, setLoanInfo] = useState({});
  const [comments, setComments] = useState();
  const [readOnly, setReadOnly] = useState(true);
  const [newLoanInfo, setNewLoanInfo] = useState({});
  
  const classes = useStyles();

  useEffect(() => {
    if(data) setValues(data);
  }, [data]);

  useEffect(() => {
    console.log(loanData)
    if(loanData) setLoanInfo(loanData);
  }, [loanData]);
  
  if(!data) return null;

  const gridProps = {
    item: true,
    xs: 12,
    className: classes.gridItemStyle
  }

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} variant="h4" component="h4">{values.id}</Typography>
      <div className={classes.contentWrapper}>
        <Grid container>
          <Grid {...gridProps}>
            <TextInput
              labelText="Name"
              value={values.name}
              readOnly={readOnly}
              onChange={handleChange}
            />
          </Grid>
          <Grid {...gridProps}>
            <TextInput
              labelText="Address"
              value={values.address}
              readOnly={readOnly}
              onChange={handleChange}
              multiline
            />
          </Grid>
          {
            values.pincode && (
              <Grid item xs={12}>
                <TextInput
                  labelText="Pincode"
                  type="number"
                  value={values.pincode}
                  readOnly={readOnly}
                  onChange={handleChange}
                />
              </Grid>
            )
          }
          {
            values.pan && (
              <Grid {...gridProps}>
                <TextInput
                  labelText="PAN"
                  value={values.pan}
                  readOnly={readOnly}
                  onChange={handleChange}
                />
              </Grid>
            )
          }
          {
            values.gst && (
              <Grid {...gridProps}>
                <TextInput
                  labelText="GST"
                  value={values.gst}
                  readOnly={readOnly}
                  onChange={handleChange}
                />
              </Grid>
            )
          }
          {
            values.region && (
              <Grid {...gridProps}>
                <TextInput
                  labelText="Region"
                  value={values.region}
                  readOnly={readOnly}
                  onChange={handleChange}
                />
              </Grid>
            )
          }
          {
            values.sales_area && (
              <Grid {...gridProps}>
                <TextInput
                  labelText="Sales Area"
                  value={values.sales_area}
                  readOnly={readOnly}
                  onChange={handleChange}
                />
              </Grid>
            )
          }

          <Grid {...gridProps}>
            {values.id ? <SalesInfo id={values.id} /> : null}
            {
              Array.isArray(loanInfo) ?
                <LoanInfo data={loanInfo} status={status} newInfo={newLoanInfo} currentUser={currentUser} setNewLoanInfo={setNewLoanInfo} />
                : null
            }
            {
              status == "submitted" && (
                <TextInput
                  multiline
                  rows={4}
                  rowsMax={8}
                  labelText="Remarks"
                  alignTop
                  placeholder="Enter your remarks here."
                  readOnly={!permissionCheck(currentUser.role_name, rulesList.loan_approval)}
                  onChange={e => {
                    setComments(e.target.value)
                  }}
                />
              )
            }
          </Grid>
        </Grid>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        <div className={classes.actionButtonsWrapper}>
          <div>
            <Button
              variant="contained"
              startIcon={<ArrowBackIosRoundedIcon />}
              onClick={onClose}>Back</Button>
          </div>
          <div>
            <Button
              component={RouterLink}
              to={`/dealership/${values.id}`}
              variant="contained"
              className={clsx(classes.btn, classes.btnSuccess)}
              startIcon={<AccountTreeRoundedIcon />}>View more</Button>
            {
              status == "submitted" && (
                <UserCan
                  role={currentUser.role_name}
                  perform={rulesList.loan_approval}
                  yes={() => (
                    <>
                      <Button
                        variant="contained"
                        className={clsx(classes.btn, classes.btnError)}
                        startIcon={<ThumbDownAltIcon />}
                        onClick={() => null}>Reject</Button>
                      <Button
                        variant="contained"
                        className={clsx(classes.btn, classes.btnSuccess)}
                        startIcon={<ThumbUpAltIcon />}
                        onClick={() => null}>Approve</Button>
                    </>
                  )}
                />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(DealershipDetails);