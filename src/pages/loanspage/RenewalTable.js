import { Dialog, Popover } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DescriptionIcon from '@material-ui/icons/Description';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import React, { useMemo, useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import DocCheckListDetailsTable from '../../components/Attachment/DocCheckListDetailsTable';
import SignRequestLayout from '../../components/Leegality/SignRequestLayout';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { ReactComponent as ESignIcon } from '../../icons/e-sign.svg';
import { ReactComponent as LoanAgreementIcon } from '../../icons/loan_agreement.svg';
import { getRenewalLoans } from '../../services/loans.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  pills_FUEL: {
    color: '#d35178',
    backgroundColor: '#f7eae8'
  },
  pills_SOLAR: {
    color: '#51b37f',
    backgroundColor: '#e1f8e5',
  },
  anchorTag: {
    textDecoration: 'none',
    color: '#d35178',
  },
}));

const RenewalTable = ({ currentUser }) => {
  const classes = useStyles();
  const [loanAmount, setLoanAmount] = useState();
  const [dealershipId, setDealershipId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanId, setloanId] = useState();
  const [type, setType] = useState('');
  const [productTypeId, setProductTypeId] = useState();
  const [rowData, setRowData] = useState();
  const [loans, setLoans] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const actionable = !permissionCheck(currentUser.role_name, rulesList.external_view);

  useEffect(() => {
    setLoading(true)
    getRenewalLoans()
      .then((data) => {
        setLoans(data)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e);
      })
  }, [])

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership Id',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <RouterLink to={`/dealership/${value}`}>{value}</RouterLink>
          }
        }
      },
      {
        label: 'Name',
        name: 'name',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        }
      },
      {
        label: 'Type',
        name: 'product_name',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => <span className={clsx(classes.pill, classes[`pills_${value}`])}>{value}</span>
        }
      },
      {
        label: 'Region',
        name: 'region',
        options: {
          filter: true,
          sort: true,
          customBodyRender: value => (<>{value ? value.toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</>)
        }
      },
      {
        label: 'Approved Amount',
        name: 'amount_approved',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Approved Date',
        name: 'approved_date',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => {
            return <div>
              {value ? moment(new Date(value)).format('DD-MM-YYYY') : '-'}
            </div>
          }
        }
      },
      {
        label: 'Attachment',
        name: 'attachment',
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return (
              <>
                <div>
                  <Tooltip title="click to view documents checklist">
                    <LinkIcon style={{color:'grey'}} onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setDealershipId(value)
                    }}/>
                  </Tooltip>
                </div>
              </>
            )
          },
        }
      },
      {
        label: 'Documents',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: false,
          display: actionable ? true : 'excluded',
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: (value, r) => {
            return (
              <div style={{ minWidth: 70 }}>
                <Tooltip title="Sanction Letter">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['loan_id']); setDealershipId(value); setType('sanction'); setModalVisible(true); }}>
                    <DescriptionIcon style={{ width: 19 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Loan Agreement">
                  <IconButton style={{ marginRight: 3 }} size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['loan_id']); setDealershipId(value); setType('agreement'); setModalVisible(true); setLoanAmount(loans?.[r.rowIndex]['amount_approved']); setProductTypeId(loans?.[r.rowIndex]['product_id']) }}>
                    <LoanAgreementIcon width={12} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="eSign Application">
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => { setloanId(loans?.[r.rowIndex]['loan_id']); setType('application'); setDealershipId(value); setModalVisible(true); }}>
                    <ESignIcon width={17} />
                  </IconButton>
                </Tooltip>
              </div>
            )
          }
        }
      }
    ]
  }, [loans]);
  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    isRowSelectable: () => false,
    onCellClick: (colData, cellMeta) => {
      setRowData(loans[cellMeta.dataIndex])
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };
  
  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length !== 0 ? (
          <MUIDataTable
            title={<Typography className={classes.title} variant="h4" component="h4">{'Renewal Applications'} ({loans.length})</Typography>}
            data={loans}
            columns={columns}
            options={options}
          />
        ) : (!loading && <Paper style={{ padding: 10 }}>No Renewal Applications</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
      <Dialog fullWidth maxWidth="md" open={modalVisible} onClose={() => setModalVisible(false)}>
        <SignRequestLayout
          open={modalVisible}
          dealershipId={dealershipId}
          loanId={loanId}
          loanAmount={loanAmount}
          productId={productTypeId}
          type={type}
          title={type === 'application' ? 'eSign Application Form' : 'Sanction Letter'}
          onClose={() => setModalVisible(false)}
        />
      </Dialog>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <DocCheckListDetailsTable title={rowData} />
      </Popover>
    </div>
  )
}

export default RenewalTable;