import { Drawer, Fade, IconButton, Modal, Tooltip, Backdrop, Checkbox } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Add, Clear } from '@material-ui/icons';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import { useMount } from 'react-use';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import Currency from '../../components/Number/Currency';
import TextInput from '../../components/TextInput/TextInput';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { getDealershipById } from '../../services/dealerships.service';
import { getDocumentsChecklistById, getLoansByStatus, updateDocumentChecklistById } from '../../services/loans.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import SubmittedDrawer from '../dashboard/RightDrawer/SubmittedDrawer';
import { createColumnHelper } from '@tanstack/react-table';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 8px',
    fontSize: '12px',
    fontWeight: '500',
    minWidth: '30px',
    textAlign: 'center',
  },
  sidePanelWrapper: {
    width: '70vw',
    maxWidth: '80vw'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '6px',
    minWidth: '500px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    gap: '5px'
  },
  outerContent: {
    maxHeight: '60vh',
    overflowY: 'scroll',
  }
}));

const PresubmitLoansTable = ({ currentUser }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dealershipData, setDealershipData] = useState();
  const [loansData, setLoansData] = useState();
  const [loans, setLoans] = useState([]);
  const [showPanel, setShowPanel] = useState({ status: false, data: '' });
  const [docModal, setDocModal] = useState({ modal: false });
  const [checklistData, setChecklistData] = useState([]);
  const [newValue, setNewValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const columnHelper = createColumnHelper();

  // getting the list of doc based on the id
  const getDocChecklistQuery = useQuery({
    queryKey: ['doc-checklist', docModal?.id],
    queryFn: () => getDocumentsChecklistById({ id: docModal?.id }),
    enabled: Boolean(docModal?.id),
    onSuccess: (data) => {
      setChecklistData(data);
    },
  })

  useMount(() => {
    setLoading(true);
    getLoansByStatus('pre_submit', '')
      .then(data => {
        setLoans(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
  })

  const onRowClick = (id, selectedLoanData, status) => {
    setLoansData(selectedLoanData);
    getDealershipById(id)
      .then(data => {
        setDealershipData(data)
      })
      .catch(e => null);
    setShowPanel({ status: true, data: status, id: id, editable: permissionCheck(currentUser.role_name, rulesList.loan_approval) });
  }

  const column = [
    columnHelper.accessor('dealership_id', {
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}>{value?.getValue()}</RouterLink>
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }),
    columnHelper.accessor('region', {
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }),
    columnHelper.accessor('amount_requested', {
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }),
    columnHelper.accessor('created_date', {
      header: 'Req. Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>
    }),
    columnHelper.accessor('application_state', {
      header: 'Application State',
      // enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() || '-'}</span>
    }),
    columnHelper.accessor('action', {
      header: 'Documents',
      enableColumnFilter: false,
      cell: (value) => (
        <Tooltip title={'Click to view documents'}>
          <IconButton size="small" color="primary" aria-label="application" onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id })}><LinkIcon /></IconButton>
        </Tooltip>
      )
    })
  ]

  // used to check and uncheck the checkbox
  const handleChecked = ({ index, insideIndex, title, value, key }) => {
    const result = [...checklistData];
    const changedData = result?.[index]?.[title];
    changedData.splice(insideIndex, 1, { [key]: value == 1 ? 0 : 1 });
    setChecklistData(result);
  }

  // used to update the checkbox
  const handleDocChecklistUpdate = () => {
    if (!checklistData?.length) {
      // if there is no data update it will throw warning
      enqueueSnackbar('Something went wrong', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'warning',
      });
    } else {
      setDocModal((old) => ({ ...old, isLoading: true }))
      updateDocumentChecklistById({ id: docModal?.id, data: checklistData })
        .then(res => {
          enqueueSnackbar('Updated Successfully', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          setDocModal({});
          setChecklistData([]);
        })
        .catch(e => {
          console.log(e);
          enqueueSnackbar(e, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          })
        })
        .finally(() => {
          setDocModal((old) => ({ ...old, isLoading: false }))
        })
    }
  }

  // used to handle the others addition in checklist
  const handleOthersAddition = (index, arr) => {
    if (newValue?.length) {
      let result = [...checklistData];
      let othersArr = result?.[index]?.['Other documents'];
      othersArr.push({ [newValue]: 0 });
      result.splice(index, 1, { 'Other documents': othersArr });
      setChecklistData(result);
      setNewValue('');
      return;
    }
    enqueueSnackbar('Please enter value to add', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      variant: 'warning',
    });
  }

  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length ? (
          <DataTableViewer
            column={column}
            rowData={loans}
            title={'Pre Submit queue'}
            excelDownload
            onRowClick={(i) => onRowClick(i.dealership_id, i, 'pre_submit')}
          />
        ) : (!loading && <Paper style={{ padding: 10 }}>No Records found</Paper>)
      }
      {
        loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
      }
      <Drawer
        anchor="right"
        ModalProps={{
          onBackdropClick: () => { setShowPanel({ status: false, data: '' }) }
        }}
        open={showPanel.status}
        variant={'temporary'}
      >
        <div className={classes.sidePanelWrapper}><SubmittedDrawer id={showPanel?.id} status={showPanel?.data} editable={showPanel?.editable} currentUser={currentUser} data={dealershipData} onClose={() => { setShowPanel({ status: false, data: '' }) }} selectedLoanData={loansData} /></div>
      </Drawer>

      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={docModal?.modal}
        onClose={() => { setDocModal({}); setChecklistData([]); }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={docModal?.modal}>
          <div className={classes.paper}>
            <div>
              <div className={classes.header} style={{ height: '30px' }}>
                <h2 id="modal-title">Document Checklist</h2>
                <IconButton style={{ padding: '8px' }} onClick={() => { setDocModal({}); setChecklistData([]); }}>
                  <Clear />
                </IconButton>
              </div>
              <p id="modal-description">List of documents that need to collect</p>
            </div>
            <div style={{ marginTop: '10px' }} className={classes.outerContent}>
              {checklistData?.length
                ? checklistData?.map((item, index) => (
                  <div key={item}>
                    <div className={classes.content} style={{ margin: '10px 0', fontWeight: '700', fontSize: '14px' }}>
                      <p>{(index + 1) + '). '}</p>
                      <div>{Object.entries(item)?.[0]?.[0]}</div>
                    </div>
                    {Object.entries(item)?.[0]?.[1]?.map((value, i) => (
                      <>
                        <div key={i} className={classes.header} style={{ marginLeft: '10px' }}>
                          <div className={classes.content}>
                            <p>{(index + 1) + '.' + (i + 1) + '). '}</p>
                            <p style={{ maxWidth: '400px' }}>{Object.entries(value)?.[0]?.[0]}</p>
                          </div>
                          <div>
                            <Checkbox
                              checked={Boolean(Object.entries(value)?.[0]?.[1])}
                              size='small'
                              color="primary"
                              inputProps={{ 'aria-label': 'secondary checkbox' }}
                              onChange={() => handleChecked({ index: index, insideIndex: i, title: Object.entries(item)?.[0]?.[0], value: Object.entries(value)?.[0]?.[1], key: Object.entries(value)?.[0]?.[0] })}
                            />
                          </div>
                        </div>
                      </>
                    ))}
                    {Object.entries(item)?.[0]?.[0] == 'Other documents' ? (
                      <div className={classes.header} style={{ marginLeft: '10px' }}>
                        <div className={classes.content} style={{ alignItems: 'center' }}>
                          <TextInput onChange={(e) => setNewValue(e.target.value)} value={newValue} placeholder={'Doc Name'} />
                          <Tooltip title={'Click to add'}>
                            <Add style={{ color: 'green', cursor: 'pointer' }} onClick={() => handleOthersAddition(index, item)} />
                          </Tooltip>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )) : getDocChecklistQuery?.isLoading ? <center><CircularProgress /></center> : <center>No Data to display</center>}
            </div>
            <div className={classes.header} style={{ justifyContent: 'right', marginTop: '20px' }}>
              <LoaderButton
                variant='contained'
                size='medium'
                style={{ color: 'white', marginRight: 8, backgroundColor: 'green' }}
                isLoading={docModal?.isLoading}
                onClick={handleDocChecklistUpdate}
              >
                Save
              </LoaderButton>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}


export default PresubmitLoansTable;