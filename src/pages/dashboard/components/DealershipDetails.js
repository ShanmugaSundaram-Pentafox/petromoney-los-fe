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
import Select from '@material-ui/core/Select';
import Currency from '../../../components/Number/Currency';
import SalesInfo from './SalesInfo';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { selectCurrentUser } from '../../../store/user/user.selector';
import { createStructuredSelector } from 'reselect';
import { getLoanById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import Alert from '@material-ui/lab/Alert';
import DispApprovedDataTable from './DispApprovedDataTable';
import apiCall from '../../../utils/api.util';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';

const LoanInfoWrapper = styled.div`
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: rgba(0, 160, 0, 0.15);
`;

const ViewMoreBtn = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  padding: 5px;
  padding-top: 15px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(176,176,176,0.75) 100%);
  transition: all .35s ease-in-out;

  &:hover {
    background: linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(176,176,176,0.90) 100%);
  }
`;

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: 24,
    paddingTop: 48,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
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
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  fieldItemStyle:{
    // marginBottom:theme.spacing(2)
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
const fieldProps = {
  direction: "column",
  alignTop: true,
}

const testProducts = [
  {
    product_id: 1,
    product_name: "FUEL 18",
    interest: 18
  },
  {
    product_id: 2,
    product_name: "FUEL 28",
    interest: 28
  },
];

const LoanInfo = ({
  data: row,
  status,
  newInfo,
  currentUser,
  updateNewLoanInfo
}) => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  
  useEffect(() => {
    apiCall(`business/products`)
    .then(res => {
      if(res.status === 'SUCCESS') {
        setProducts(res.data || testProducts);
        if(row.product_id) {
          const re = res.data.find(d => d.product_id == row.product_id)
          setSelectedProduct({ ...re, disabled: status !== "loan_approval" } || {})
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  }, [row.product_id]);

  return (
    <>
      <LoanInfoWrapper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Loan Type</TableCell>
              <TableCell>Interest %</TableCell>
              <TableCell>Penal Interest %</TableCell>
              <TableCell align="right">Req. Amount</TableCell>
              <TableCell align="right">Amount Approved</TableCell>
              {
                ["disbursed", "disbursement_approval"].includes(status) ? <TableCell align="right">Disbursement Amount</TableCell> : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={row.id}>
              <TableCell scope="row" component="th">
                <Select
                  fullWidth
                  native
                  placeholder={"Select Loan Product"}
                  value={selectedProduct?.product_id}
                  disabled={selectedProduct?.disabled}
                  onChange={e => {
                  const d = products.find(i => i.product_id == e.target.value)
                  setSelectedProduct(d)
                  updateNewLoanInfo({
                    ...newInfo,
                    product_id: e.target.value
                  })
                }}>
                  <option value="">Choose Loan type</option>
                  {
                    products.map(item => <option value={item.product_id}>{item.product_name}</option>)
                  }
                </Select>
              </TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.interest}</strong></TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.penal_interest}</strong></TableCell>
              <TableCell align="right"><Currency value={row.amount_requested} /></TableCell>
              <TableCell align="right">
                {
                  status === "loan_approval" ? (
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
                            updateNewLoanInfo({
                              ...newInfo,
                              amount_approved: e.target.value
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
                status === "disbursement_approval" ? (
                  <TableCell align="right">
                    <UserCan
                      role={currentUser.role_name}
                      perform={rulesList.loan_approval}
                      yes={() => (
                        <TextInput
                          money
                          type="number"
                          fullWidth={false}
                          value={newInfo.amount_disbursed}
                          onChange={e => {
                            updateNewLoanInfo({
                              ...newInfo,
                              amount_disbursed: e.target.value
                            })
                          }}
                        />
                      )}
                      no={() => "-"}
                    />
                  </TableCell>
                ) : (status == "disbursed" ? (
                  <TableCell align="right">
                    <Currency value={row.amount_disbursed} />
                  </TableCell>
                ) : null)
              }
            </TableRow>
          </TableBody>
        </Table>
      </LoanInfoWrapper>
      <Grid container>
        <Grid item xs={12} className={classes.gridItemStyle} style={{ position: 'relative' }}>
          Recommendation Remarks(for Approval):
          <TextInput
            disabled
            alignTop
            multiline
            rows={4}
            // rowsMax={8}
            value={row.recommendation_remarks}
            {...fieldProps}
          />
          {
            row.recommendation_remarks?.length >= 300 ? (
              <ViewMoreBtn onClick={() => setShowRemarksModal(row.recommendation_remarks)}>
                View more
              </ViewMoreBtn>
            ) : null
          }
        </Grid>
      </Grid>
      {
        row.disbursement_recommendation_remarks && (
          <Grid container>
            <Grid item xs={12} className={classes.gridItemStyle} style={{ position: 'relative' }}>
              Recommendation Remarks(for Disbursement):
              <TextInput
                disabled
                readOnly
                alignTop
                multiline
                rows={4}
                // rowsMax={8}
                value={row.disbursement_recommendation_remarks}
              />
              {
                row.disbursement_recommendation_remarks?.length >= 300 ? (
                  <ViewMoreBtn onClick={() => setShowRemarksModal(row.disbursement_recommendation_remarks)}>
                    View more
                  </ViewMoreBtn>
                ) : null
              }
            </Grid>
          </Grid>
        )
      }
      <FormDialog open={showRemarksModal} title="Remarks" onClose={() => setShowRemarksModal(false)}>
        <TextInput
          disabled
          alignTop
          multiline
          readOnly
          value={showRemarksModal}
          style={{ width: '40vw', minWidth: 400 }}
          />
      </FormDialog>
    </>
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
  const [apiStatus, setApiStatus] = useState({});
  const [readOnly, setReadOnly] = useState(true);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [newLoanInfo, setNewLoanInfo] = useState({});

  const classes = useStyles();

  useEffect(() => {
    if (loanData?.id && data?.id) {
      getLoanById(data.id, loanData.id)
        .then(res => {
          setLoanInfo(res);
          setNewLoanInfo({
            ...res,
            amount_approved: res.amount_requested || 0,
            amount_disbursed: res.amount_approved || 0,
          });
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [data, loanData]);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  // useEffect(() => {
  //   if(loanData) {
  // setLoanInfo(loanData)
  // setNewLoanInfo({
  //   ...loanData,
  //   amount_approved: loanData.amount_requested,
  //   amount_disbursed: loanData.amount_approved,
  // });
  //   };
  // }, [loanData]);

  if (!data) return null;

  const updateLoanStatus = submitStatus => {
    // if(!newLoanInfo.approval_remarks) {
    //   setApiStatus({ type: 'error', message: 'Please enter your remarks/comments.' });
    //   return null
    // }
    
    setApiStatus({ loading: true, type: 'info', message: 'We are processing your request, Please wait...' });
    let reqBody = {
      status: submitStatus,
      user_id: currentUser.id,
    };
    let resMsg = '';

    if (status === "loan_approval") {
      if(!newLoanInfo.product_id) {
        setApiStatus({ loading: false, type: 'error', message: 'Please choose loan type.' });
        return null
      }
      reqBody.approval_remarks = newLoanInfo.approval_remarks;
      reqBody.product_id = newLoanInfo.product_id;
    }
    if (submitStatus === "approved") {
      if (status === "loan_approval") {
        resMsg = 'Successfully Approved Loan Request';
        reqBody.amount_approved = newLoanInfo.amount_approved;
      } else if (status === "disbursement_approval") {
        reqBody.status = 'disbursement_approved';
        resMsg = 'Successfully Approved Loan for Disbursement';
        reqBody.amount_disbursed = newLoanInfo.amount_disbursed;
      }
    }
    if (status === "disbursement_approval") {
      reqBody.disbursement_approval_remarks = newLoanInfo.disbursement_approval_remarks;
    }

    if (submitStatus === 'rejected') {
      resMsg = 'Request got rejected successfully';
    }
    // if(submitStatus === "disbursed") {
    // if (loanData.amount_disbursed === newLoanInfo.amount_disbursed) {
    //   setApiStatus({ type: 'error', message: 'Please check Disburse amount. We see no change in Disburse amount!' })
    //   return null;
    // }

    // }
    updateLoanApprovalStatusById(values.id, loanData.id, reqBody)
      .then(res => {
        setLoanInfo(res.data);
        setApiStatus({ type: 'success', message: res.message || resMsg })
      })
      .catch(err => {
        setApiStatus({ type: 'error', message: 'Unable to update status. Please contact your admin' })
        console.log('Loan status update error - ', err)
      })
  }

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

  const updateNewLoanInfo = (d) => {
    setNewLoanInfo({
      ...newLoanInfo,
      ...d
    });
  }
  const fieldProps = {
    direction: "column",
    alignTop: true,
    readOnly,
    className:classes.fieldItemStyle
  }


  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} variant="h4" component="h4">{values.id}</Typography>
      <div className={classes.contentWrapper}>
        <Grid container spacing={2}>
          <Grid {...gridProps}>
            <TextInput
              labelText="Name"
              value={values.name}
              readOnly={readOnly}
              onChange={handleChange}
              {...fieldProps}
            />
          </Grid>
          <Grid {...gridProps} md={6} >
            <TextInput
              labelText="Address"
              value={values.address}
              readOnly={readOnly}
              onChange={handleChange}
              multiline
              {...fieldProps}
            />
          </Grid>
          {
            values.pincode && (
              <Grid item xs={12} md={6}>
                <TextInput
                  labelText="Pincode"
                  type="number"
                  value={values.pincode}
                  readOnly={readOnly}
                  onChange={handleChange}
                  {...fieldProps}
                />
              </Grid>
            )
          }
          {
            values.pan && (
              <Grid {...gridProps} md={6}>
                <TextInput
                  labelText="PAN"
                  value={values.pan}
                  readOnly={readOnly}
                  onChange={handleChange}
                  {...fieldProps}
                />
              </Grid>
            )
          }
          {
            values.gst && (
              <Grid {...gridProps} md={6}>
                <TextInput
                  labelText="GST"
                  value={values.gst}
                  readOnly={readOnly}
                  onChange={handleChange}
                  {...fieldProps}
                />
              </Grid>
            )
          }
          {
            values.region && (
              <Grid {...gridProps} md={6}>
                <TextInput
                  labelText="Region"
                  value={values.region}
                  readOnly={readOnly}
                  onChange={handleChange}
                  {...fieldProps}
                />
              </Grid>
            )
          }
          {
            values.sales_area && (
              <Grid {...gridProps} md={6}>
                <TextInput
                  labelText="Sales Area"
                  value={values.sales_area}
                  readOnly={readOnly}
                  onChange={handleChange}
                  {...fieldProps}
                />
              </Grid>
            )
          }

          <Grid {...gridProps}>
            {values.id ? <SalesInfo id={values.id} currentUser={currentUser} /> : null}
            <LoanInfo data={loanInfo} status={status} newInfo={newLoanInfo} currentUser={currentUser} updateNewLoanInfo={updateNewLoanInfo} />
          </Grid>

          {
            status == "loan_approval" ? (
              <Grid {...gridProps}>
                <TextInput
                  multiline
                  rows={4}
                  rowsMax={8}
                  labelText="Remarks*"
                  alignTop
                  placeholder="Enter your remarks here."
                  value={newLoanInfo.approval_remarks}
                  onChange={e => {
                    setNewLoanInfo({
                      ...newLoanInfo,
                      approval_remarks: e.target.value
                    })
                  }}
                  {...fieldProps}
                  readOnly={!permissionCheck(currentUser.role_name, rulesList.loan_approval)}

                />
              </Grid>
            ) : null
          }

          {
            status == "approved" || status == "rejected" ? (
              <Grid {...gridProps} style={{ position: 'relative' }}>
                <TextInput
                  multiline
                  rows={4}
                  rowsMax={8}
                  labelText="Remarks*"
                  alignTop
                  value={newLoanInfo.approval_remarks}
                  disabled
                  {...fieldProps}
                />
                {
                  loanInfo.approval_remarks?.length >= 300 ? (
                    <ViewMoreBtn onClick={() => setShowRemarksModal(loanInfo.approval_remarks)}>
                      View more
                    </ViewMoreBtn>
                  ) : null
                }
              </Grid>
            ) : null
          }

          {
            status == "disbursement_approval" ? (
              <>
                <Grid {...gridProps} style={{ position: 'relative' }}>
                  Remarks(Approval)
                  <TextInput
                    disabled
                    readOnly
                    alignTop
                    multiline
                    rows={4}
                    // rowsMax={8}
                    value={loanInfo.approval_remarks}
                    {...fieldProps}
                  />
                  {
                      loanInfo.approval_remarks?.length >= 300 ? (
                        <ViewMoreBtn onClick={() => setShowRemarksModal(loanInfo.approval_remarks)}>
                          View more
                        </ViewMoreBtn>
                      ) : null
                    }
                  {/* <Typography variant="p" component={'p'}>
                    {loanInfo.approval_remarks}
                  </Typography> */}
                  
                </Grid>

                <Grid {...gridProps}>
                  <TextInput
                    multiline
                    rows={4}
                    rowsMax={8}
                    labelText="Remarks*"
                    alignTop
                    placeholder="Enter your remarks here."
                    value={newLoanInfo.disbursement_approval_remarks}
                    onChange={e => {
                      setNewLoanInfo({
                        ...newLoanInfo,
                        disbursement_approval_remarks: e.target.value
                      })
                    }}
                    {...fieldProps}
                    readOnly={!permissionCheck(currentUser.role_name, rulesList.loan_approval)}
                  />
                </Grid>
              </>
            ) : null
          }

          {
            status == 'disbursement_approved' || status == 'disbursed' ? (
              <>
                <Grid {...gridProps} style={{ position: 'relative' }}>
                  Remarks(Approval)
                  {/* <Typography variant="p" component={'p'}>
                  {loanInfo.approval_remarks}
                </Typography> */}
                  <TextInput
                    disabled
                    alignTop
                    multiline
                    rows={4}
                    // rowsMax={8}
                    value={loanInfo.approval_remarks}
                    {...fieldProps}
                  />
                  {
                    loanInfo.approval_remarks?.length >= 300 ? (
                      <ViewMoreBtn onClick={() => setShowRemarksModal(loanInfo.approval_remarks)}>
                        View more
                      </ViewMoreBtn>
                    ) : null
                  }
                </Grid>
                <Grid {...gridProps} style={{ position: 'relative' }}>
                  Remarks(Disbursement)
                    {/* <Typography variant="p" component={'p'}>
                    {loanInfo.disbursement_approval_remarks}
                  </Typography> */}
                  <TextInput
                    disabled
                    alignTop
                    multiline
                    rows={4}
                    value={loanInfo.disbursement_approval_remarks}
                    {...fieldProps}
                  />
                  {
                    loanInfo.disbursement_approval_remarks?.length >= 300 ? (
                      <ViewMoreBtn onClick={() => setShowRemarksModal(loanInfo.disbursement_approval_remarks)}>
                        View more
                      </ViewMoreBtn>
                    ) : null
                  }
                </Grid>
                <Grid {...gridProps}>
                  <DispApprovedDataTable id={values.id} loanData={loanInfo} />
                </Grid>
              </>
            ) : null
          }
        </Grid>
      </div>
      <div className={classes.actionFooter}>
        <Divider />
        {
          apiStatus.type && (
            <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
          )
        }
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
              disabled={apiStatus.loading}
              className={clsx(classes.btn, classes.btnSuccess)}
              startIcon={<AccountTreeRoundedIcon />}>View more</Button>
            {
              status && ["loan_approval", "disbursement_approval"].includes(status.toLowerCase()) && (
                <UserCan
                  role={currentUser.role_name}
                  perform={rulesList.loan_approval}
                  yes={() => (
                    <>
                      <Button
                        variant="contained"
                        disabled={apiStatus.loading}
                        className={clsx(classes.btn, classes.btnError)}
                        startIcon={<ThumbDownAltIcon />}
                        onClick={() => updateLoanStatus('rejected')}>Reject</Button>
                      <Button
                        variant="contained"
                        disabled={apiStatus.loading}
                        className={clsx(classes.btn, classes.btnSuccess)}
                        startIcon={<ThumbUpAltIcon />}
                        onClick={() => updateLoanStatus('approved')}>Approve</Button>
                    </>
                  )}
                />
              )
            }
          </div>
        </div>
      </div>
      <FormDialog open={showRemarksModal} title="Remarks" onClose={() => setShowRemarksModal(false)}>
        <TextInput
          disabled
          alignTop
          multiline
          readOnly
          value={showRemarksModal}
          style={{ width: '40vw', minWidth: 400 }}
          />
      </FormDialog>
    </div>
  )
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(DealershipDetails);