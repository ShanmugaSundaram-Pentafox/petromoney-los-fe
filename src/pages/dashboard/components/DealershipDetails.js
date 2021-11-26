import { Checkbox, Select as MSelect, Chip, CircularProgress, Dialog, DialogActions, DialogContent, FormControlLabel, FormGroup, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Select from 'react-select';
import { useMount } from 'react-use';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components'
import DispApprovedDataTable from './DispApprovedDataTable';
import SalesInfo from './SalesInfo';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import Currency from '../../../components/Number/Currency';
import TextInput from '../../../components/TextInput/TextInput';
import UserCan, { permissionCheck } from '../../../components/UserCan/UserCan';
import { rulesList } from '../../../config/userRules';
import { getAllRegion, getUserRoleForReview } from '../../../services/common.service';
import { getLoanById, getLoanRejectReason, updateLoanApprovalStatusById, updateLoanStats } from '../../../services/loans.service';
import { selectCurrentUser } from '../../../store/user/user.selector';
import apiCall from '../../../utils/api.util';
import { useSnackbar } from 'notistack';
// import CloseIcon from '@material-ui/icons/Close';

// import Button from '../../../components/CommonComponents/Button/Button'

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
    padding: '0 24px 24px 24px',
    // paddingTop: 48,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  contentWrapper: {
    padding: 12,
    flex: 1,
    overflow: 'auto',
    overflowX: 'hidden'

  },
  wrapperTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: 24,
  },
  title: {
    // position: 'absolute',
    top: 0,
    left: 0,
    padding: '8px 16px',
    background: theme.palette.grey[300],
    borderBottomRightRadius: 12,
    boxShadow: '0px 0px 4px #8d8d8d',
  },
  closeIcon: {
    marginTop: 8,
  },
  gridItemStyle: {
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(1)
  },
  fieldItemStyle: {
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
  },
  rejectModal: {
    width: 600,
    minHeight: '35vh',
    maxHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between'
  },
  errorText: {
    color: '#D83A56',
    fontSize: '.7rem'
  },
  btns: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 10
  },
  actions: {
    marginTop: 15,
  },
  actions2: {
    marginTop: 15,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  list: {
    marginTop: 5,
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'column'
  },
  items: {
    borderBottom: '1px solid #c9c7c7',
    paddingTop: 5,
    paddingBottom: 5,
    '&:hover': {
      backgroundColor: '#ffffff',
      borderRadius: 2
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chip: {
    borderRadius: 2,
    marginRight: 10
  },
  eachItem: {
    textOverflow: 'ellipsis',
    paddingLeft: 5
  },
  itemNotation: {
    color: 'rgb(0,0,0,0.4)',
    paddingRight: 10
  },
  checkbox: {
    padding: 2,
    paddingLeft: 10
  },
  dialogTitle: {
    borderBottom: '1px dashed #ccc'
  }
}));
const fieldProps = {
  direction: 'column',
  alignTop: true,
}

const testProducts = [
  {
    product_id: 1,
    product_name: 'FUEL 18',
    interest: 18
  },
  {
    product_id: 2,
    product_name: 'FUEL 28',
    interest: 28
  },
];

const LoanInfo = ({
  data: row,
  status,
  newInfo,
  currentUser,
  editable,
  updateNewLoanInfo
}) => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});


  useEffect(() => {
    apiCall('business/products')
      .then(res => {
        if (res.status === 'SUCCESS') {
          setProducts(res.data || testProducts);
          if (row.product_id) {
            const re = res.data.find(d => d.product_id == row.product_id)
            setSelectedProduct({ ...re, disabled: status !== 'loan_approval' } || {})
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
                ['disbursed', 'disbursement_approval'].includes(status) ? <TableCell align="right">Disbursement Amount</TableCell> : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={row.id}>
              <TableCell scope="row" component="th">
                <MSelect
                  fullWidth
                  native
                  placeholder={'Select Loan Product'}
                  value={selectedProduct?.product_id}
                  disabled={selectedProduct?.disabled || !editable}
                  onChange={e => {
                    const d = products.find(i => i.product_id == e.target.value)
                    setSelectedProduct(d)
                    updateNewLoanInfo({
                      ...newInfo,
                      product_id: e.target.value
                    })
                  }}
                  style={{
                    color: '#333'
                  }}
                >
                  {/* <option value="">Choose Loan type</option> */}
                  {
                    products.map(item => <option key={item.product_id} value={item.product_id}>{item.product_name}</option>)
                  }
                </MSelect>
              </TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.interest}</strong></TableCell>
              <TableCell scope="row" component="th"><strong>{selectedProduct?.penal_interest}</strong></TableCell>
              <TableCell align="right"><Currency value={row.amount_requested} /></TableCell>
              <TableCell align="right">
                {
                  status === 'loan_approval' ? (
                    <UserCan
                      role={currentUser.role_name}
                      perform={rulesList.loan_approval}
                      yes={() => (
                        <TextInput
                          money
                          number
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
                      no={() => <Currency value={row.amount_approved} />}
                    />
                  )
                    : <Currency value={row.amount_approved} />
                }
              </TableCell>
              {
                status === 'disbursement_approval' ? (
                  <TableCell align="right">
                    <UserCan
                      role={currentUser.role_name}
                      perform={rulesList.loan_approval}
                      yes={() => (
                        <TextInput
                          money
                          number
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
                      no={() => <Currency value={row.amount_disbursed} />}
                    />
                  </TableCell>
                ) : (status == 'disbursed' ? (
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
  currentUser,
  editable,

}) => {
  const [values, setValues] = useState({});
  const [loanInfo, setLoanInfo] = useState({});
  const [reLoader, setReloader] = useState(false);
  const [rejectLoader, setRejectLoader] = useState(false);
  const [regions, setRegions] = useState([]);
  const [approveLoader, setApproveLoader] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [readOnly, setReadOnly] = useState(true);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [newLoanInfo, setNewLoanInfo] = useState({});
  const [selectedCategory, setSelectedCategory] = useState()
  const [rejectModal, setRejectModal] = useState(false);
  const [optionsData, setOptionsData] = useState([])
  const [reasonData, setReasonData] = useState()
  const [rejectReason, setRejectReason] = useState([])
  const [displayReason, setDisplayReason] = useState([])
  const [activeTab, setActiveTab] = useState()
  const [user, setUser] = useState([]);
  const [remarks, setRemarks] = useState();
  const [userRole, setUserRole] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const sortByKey = (a, b, key) => {
    if (a[key]?.trim() < b[key]?.trim()) {
      return -1;
    }
    if (a[key]?.trim() > b[key]?.trim()) {
      return 1;
    }
    return 0;
  }

  const classes = useStyles();

  useEffect(() => {
    if (status === 'loan_review') {
      getUserRoleForReview('is_approve=1')
        .then(res => {
          let d = [];
          res.forEach((item, i) => {
            d.push({
              label: `${item.first_name} ${item.last_name}`,
              value: item.id
            })
          })
          setUserRole(d);
        })
        .catch(e => {
          console.log(e);
        })
    }
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
    getAllRegion()
      .then(data => {
        setRegions(data);
      })
      .catch(err => {
        console.log(err)
      });
  }, [data, loanData]);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  useMount(() => {
    getLoanRejectReason()
      .then(data => {
        const optionsBuffer = []
        const dataBuffer = []

        data.map((data, index) => {
          optionsBuffer.push({ value: index, label: data.reason })
          dataBuffer.push([data.list.map((d) => { return ({ value: d.id, label: `${d.code} - ${d.description}` }) })])
          // console.log(data.list);
        })
        setOptionsData(optionsBuffer)
        setReasonData(dataBuffer)
        // console.log(dataBuffer);
      })
      .catch(e => {
        console.log(e);
      })
  })

  // selectedCategory && (
  //   // setDataOptions(reasonData[selectedCategory.value])
  //   console.log(reasonData[selectedCategory.value][0])
  // )


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

    let reqBody = {
      status: submitStatus,
      user_id: currentUser.id,
    };
    let resMsg = '';

    if (status === 'loan_approval') {
      if (!newLoanInfo.product_id) {
        setApiStatus({ loading: false, type: 'error', message: 'Please choose loan type.' });
        return null
      }
      // reqBody.approval_remarks = newLoanInfo.approval_remarks;
      reqBody.product_id = newLoanInfo.product_id;
    }
    if (submitStatus === 'approval') {
      setApproveLoader(true);
      if (status === 'loan_approval') {
        resMsg = 'Successfully Approved Loan Request';
        reqBody.amount_approved = newLoanInfo.amount_approved;
        reqBody.remarks = newLoanInfo.remarks;
      } else if (status === 'disbursement_approval') {
        reqBody.status = 'disbursement_approved';
        resMsg = 'Successfully Approved Loan for Disbursement';
        reqBody.amount_disbursed = newLoanInfo.amount_disbursed;
      }
    }
    if (status === 'disbursement_approval') {
      reqBody.disbursement_approval_remarks = newLoanInfo.disbursement_approval_remarks;
    }

    if (submitStatus === 'reject') {
      setRejectLoader(true);
      setRejectModal(false);
      reqBody.reason_id = rejectReason;
      resMsg = 'Request got rejected successfully';
    }
    if (submitStatus === 'loan_review') {
      reqBody.approver_id = user.value;
      reqBody.status = 'approval'
      reqBody.recommendation_remarks = remarks;
      resMsg = 'Request approved successfully';
    }
    if (submitStatus === 'disbursed') {
      if (loanData.amount_disbursed === newLoanInfo.amount_disbursed) {
        setApiStatus({ type: 'error', message: 'Please check Disburse amount. We see no change in Disburse amount!' })
        return null;
      }
    }


    updateLoanApprovalStatusById(values.id, loanData.id, reqBody)
      .then(res => {
        setApproveLoader(false);
        setRejectLoader(false);
        setLoanInfo(res.data);
        enqueueSnackbar(res.message, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        setTimeout(() => {
          setReloader(false);
          window.location.reload();
        }, 1500)
      })
      .catch(err => {
        setApproveLoader(false);
        setRejectLoader(false);
        enqueueSnackbar('Something went wrong, Please try Again!', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
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
    direction: 'column',
    alignTop: true,
    readOnly,
    className: classes.fieldItemStyle
  }

  const removeItem = (item) => {
    setRejectReason(rejectReason.filter(value => value !== item.value))
    setDisplayReason(displayReason.filter(label => label.label !== item.label))
  }

  const handleReasonChange = (event) => {
    let reasonArray = [...displayReason, { label: event.target.name, value: event.target.value }];
    let arrayCheck = [...rejectReason, event.target.value];
    if (rejectReason.includes(event.target.value)) {
      arrayCheck = arrayCheck.filter(value => value !== event.target.value)
      reasonArray = reasonArray.filter(name => name.label !== event.target.name)
    }
    setDisplayReason(reasonArray)
    setRejectReason(arrayCheck)
  }

  const handleClose = () => {
    setRejectModal(false);
    setRejectReason([])
    setDisplayReason([])
    setSelectedCategory();
  }

  const handleResubmit = () => {
    setReloader(true);
    updateLoanStats(data.id, loanData.id)
      .then(res => {
        // enqueueSnackbar(res, { variant: "success" });
        setReloader(false);
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        }
        )
        setTimeout(() => {
          setReloader(false);
          window.location.reload();
        }, 2000)

        // setData(data)
      })
      .catch((e) => {
        setReloader(false);
        console.log(e);
      })
  }
  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapperTitle}>
        <Typography className={classes.title} variant="h4" component="h4">{values.id}</Typography>
        <CloseIcon className={classes.closeIcon} onClick={onClose} />
      </div>
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
                  number
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
                  value={(regions.find(function (region, index) {
                    if (region.region == values.region)
                      return true;
                  }))?.name}
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
            <LoanInfo editable={editable} data={loanInfo} status={status} newInfo={newLoanInfo} currentUser={currentUser} updateNewLoanInfo={updateNewLoanInfo} />
          </Grid>

          {
            status == 'loan_approval' ? (
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
            status == 'approved' || status == 'rejected' ? (
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
            status == 'disbursement_approval' ? (
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
                  <DispApprovedDataTable id={values.id} loanData={loanInfo} editable={editable} />
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
          <div style={{ display: 'flex' }}>
            <div>
              <Button
                variant="contained"
                startIcon={<ArrowBackIosRoundedIcon />}
                onClick={onClose}>Back</Button>
            </div>
            {
              editable && status && ['rejected', 'approved', 'disbursment_approval', 'loan_approval', 'loan_review'].includes(status.toLowerCase()) && (
                <UserCan
                  role={currentUser.role_name}
                  perform={rulesList.loan_approval}
                  yes={() => (
                    !reLoader ? (
                      <div>
                        <Button
                          variant="contained"
                          disabled={apiStatus.loading}
                          className={clsx(classes.btn, classes.btnError)}
                          onClick={handleResubmit}
                        >
                          Re-submit</Button>
                      </div>
                    ) : (
                      <div style={{ marginLeft: '16px' }}>
                        <CircularProgress size={30} />
                      </div>
                    )

                  )}
                />
              )
            }
          </div>
          <div style={{ display: 'flex' }}>
            {
              editable && status && ['loan_review'].includes(status.toLowerCase()) && (
                <UserCan
                  role={currentUser.role_name}
                  perform={rulesList.loan_approval}
                  yes={() => (
                    <>
                      {
                        <div>
                          <Button
                            variant="contained"
                            disabled={apiStatus.loading}
                            className={clsx(classes.btn, classes.btnSuccess)}
                            startIcon={<ThumbUpAltIcon />}
                            onClick={() => setRejectModal(true)}> Send for Approval</Button>
                        </div>
                      }
                    </>
                  )}
                />
              )
            }
            <div>
              <Button
                component={RouterLink}
                to={`/dealership/${values.id}`}
                variant="contained"
                disabled={apiStatus.loading}
                className={clsx(classes.btn, classes.btnSuccess)}
                startIcon={<AccountTreeRoundedIcon />}>View more</Button>
            </div>
            {
              editable && status && ['loan_approval', 'disbursement_approval'].includes(status.toLowerCase()) && (
                <UserCan
                  role={currentUser.role_name}
                  perform={rulesList.loan_approval}
                  yes={() => (
                    <>
                      {
                        !rejectLoader ? (
                          <div>
                            <Button
                              variant="contained"
                              disabled={apiStatus.loading}
                              className={clsx(classes.btn, classes.btnError)}
                              startIcon={<ThumbDownAltIcon />}
                              onClick={() => setRejectModal(true)}>Reject</Button>
                          </div>
                        ) : (
                          <div style={{ marginLeft: '16px' }}>
                            <CircularProgress size={30} />
                          </div>
                        )
                      }
                      {
                        !approveLoader ? (
                          <div>
                            <Button
                              variant="contained"
                              disabled={apiStatus.loading}
                              className={clsx(classes.btn, classes.btnSuccess)}
                              startIcon={<ThumbUpAltIcon />}
                              onClick={() => updateLoanStatus('approval')}>Approve</Button>
                          </div>
                        ) : (
                          <div style={{ marginLeft: '16px' }}>
                            <CircularProgress size={30} />
                          </div>
                        )
                      }
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
      <Dialog
        open={rejectModal}
        onClose={() => setRejectModal(false)}
      >

        {/* <DialogTitle className={classes.dialogTitle}><Typography variant='h6'>Are you Sure?</Typography></DialogTitle> */}
        <DialogContent className={classes.rejectModal}>
          {
            status?.toLowerCase() !== 'loan_review' && (
              <>
                <div>
                  <Typography style={{ marginBottom: 20 }} variant='body1'>Choose category and reasons for rejection.</Typography>
                  <Typography variant='body2'>Category</Typography>
                  {
                    optionsData.map((item, i) => {
                      return <Chip key={i} label={item.label} className={classes.chip} variant={activeTab === i ? 'default' : 'outlined'} onClick={() => {
                        setSelectedCategory({ label: item?.label, value: item?.value })
                        setActiveTab(item.value)
                      }} clickable color={activeTab === i ? 'primary' : ''} />
                    })
                  }
                </div>
                {
                  selectedCategory && (
                    <div className={classes.actions}>
                      <Typography variant='body1'>Reason</Typography>
                      <FormGroup>
                        {
                          reasonData[selectedCategory.value][0].map((data, index) => {
                            return (
                              <FormControlLabel key={index} control={<Checkbox className={classes.checkbox} onChange={handleReasonChange} value={data.value} key={data.value} checked={rejectReason.includes(data.value)} name={data.label} />} label={data.label} color={activeTab === data.label ? 'primary' : ''} />
                            )
                          })
                        }
                      </FormGroup>
                    </div>
                  )
                }
                {
                  displayReason.length != 0 && (
                    <div className={classes.actions2}>
                      <Typography variant='body1'><strong>Selected Reasons</strong></Typography>
                      {
                        displayReason.sort((a, b) => sortByKey(a, b, 'label')).map((item, i) => {
                          return (
                            <div key={i} className={classes.items}>
                              <p className={classes.eachItem}><span className={classes.itemNotation}>{i + 1}.</span> {item.label}</p>
                              <Tooltip title="Remove">
                                <IconButton size='small'>
                                  <CloseIcon fontSize='small' onClick={() => removeItem(item)} />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }
              </>
            )
          }
          {
            status?.toLowerCase() === 'loan_review' && (
              <div style={{ marginBottom: 20 }}>
                <DialogContentText id="approval-remarks-desc">
                  Please choose whom did you want to sent for approval.
                </DialogContentText>
                <Select
                  isClearable
                  name='user_approve'
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      // borderWidth: 0,
                      // borderRadius: 0,
                      // borderBottomWidth: 1, 
                      borderColor: 'hsl(0, 0%, 90%)',
                      minHeight: 29,
                      '&:hover': {
                        boxShadow: 'none',
                        minHeight: 29,
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                      '> div': {
                        padding: 5
                      }
                    }),
                    indicatorContainer: (provided) => ({
                      ...provided,
                    })
                  }}
                  onChange={setUser}
                  options={userRole}
                />
                <DialogContentText id="approval-remarks-desc">
                  Please enter your remarks for sending this for approval.
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
            )
          }
        </DialogContent>
        <DialogActions>
          <div>
            <Button onClick={handleClose}>Cancel</Button>
            <Button color='primary' variant='outlined' onClick={() => { status === 'loan_review' ? updateLoanStatus('loan_review') : updateLoanStatus('reject') }}>Confirm</Button>
          </div>
        </DialogActions>
      </Dialog>
    </div >
  )
}
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(DealershipDetails);