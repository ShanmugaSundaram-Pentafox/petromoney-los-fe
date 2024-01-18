import { Drawer, Fade, IconButton, Modal, Tooltip, Backdrop, Checkbox } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Clear } from '@material-ui/icons';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import { useMount } from 'react-use';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { getDealershipById } from '../../services/dealerships.service';
import { getDocumentsChecklistById, getLoansByStatus, updateDocumentChecklistById } from '../../services/loans.service';
import { dateCustomSort } from '../../utils/commonFunctions.util';
import SubmittedDrawer from '../dashboard/RightDrawer/SubmittedDrawer';

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
  const { enqueueSnackbar } = useSnackbar();

  // getting the list of doc based on the id
  const getDocChecklistQuery = useQuery({
    queryKey: ['doc-checklist', docModal?.id],
    queryFn: () => getDocumentsChecklistById({ id: docModal?.id }),
    enabled: Boolean(docModal?.id),
    onSuccess: (data) => {
      setChecklistData(data);
    },
    select: (data) => {
      // sorting the data
      return data.sort((a, b) => (a.document_checklist_id > b.document_checklist_id) ? 1 : ((b.document_checklist_id > a.document_checklist_id) ? -1 : 0));
    }
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
        name: 'type',
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
        label: 'Req. Amount',
        name: 'amount_requested',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'left',
          }),
          customBodyRender: value => <strong><Currency value={value} /></strong>
        }
      },
      {
        label: 'Req. Date',
        name: 'created_date',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: value => {
            return <div>
              {value ? moment(new Date(value)).format('DD-MM-YYYY') : '-'}
            </div>
          }
        }
      },
      {
        label: 'Application state',
        name: 'application_state',
        options: {
          filter: true,
          filterWidth: '100%',
          sort: true,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: value => {
            return <div>
              {value ? value : '-'}
            </div>
          }
        }
      },
      {
        label: 'Documents',
        name: 'dealership_id',
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({
            align: 'center',
          }),
          customBodyRender: (value, r) => {
            return (
              <>
                <Tooltip title={'Click to view documents'}>
                  <IconButton size="small" color="primary" aria-label="application" onClick={() => setDocModal({ modal: true, id: value })}><LinkIcon /></IconButton>
                </Tooltip>
              </>
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
      if (cellMeta.colIndex !== 7) {
        onRowClick(loans[cellMeta.dataIndex].dealership_id, loans[cellMeta.dataIndex], 'pre_submit')
      }
    },
    customSort: (data, dataIndex, rowIndex) => {
      let dateIndex = 5
      return dateCustomSort(data, dataIndex, rowIndex, dateIndex)
    }
  };

  // used to check and uncheck the checkbox
  const handleChecked = (i, data) => {
    const result = [...checklistData];
    result.splice(i, 1, { ...data, is_verified: data?.is_verified == 1 ? 0 : 1 });
    setChecklistData(result);
  }

  // used to update the checkbox
  const handleDocChecklistUpdate = () => {
    let arr = [];
    // used to get the changed the data
    checklistData.forEach((i, index) => {
      i !== getDocChecklistQuery?.data?.[index] && arr.push(i);
    })
    if (!arr?.length) {
      // if there is no data update it will throw warning
      enqueueSnackbar('Nothing to update', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'warning',
      });
    } else {
      setDocModal((old) => ({ ...old, isLoading: true }))
      updateDocumentChecklistById({ id: docModal?.id, data: arr })
        .then(res => {
          enqueueSnackbar('Updated Successfully', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
          setDocModal({});
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

  return (
    <div className={classes.root}>
      {
        Array.isArray(loans) && loans.length ? (
          <MUIDataTable
            title={<Typography className={classes.title} variant="h4" component="h4">{'Pre Submit queue'} ({loans.length})</Typography>}
            data={loans}
            columns={columns}
            options={options}
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
        onClose={() => setDocModal({})}
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
                <IconButton style={{ padding: '8px' }} onClick={() => setDocModal({})}>
                  <Clear />
                </IconButton>
              </div>
              <p id="modal-description">List of documents that need to collect</p>
            </div>
            <div style={{ marginTop: '10px' }} className={classes.outerContent}>
              {getDocChecklistQuery?.data?.length
                ? getDocChecklistQuery?.data?.map((item, index) => (
                  <div key={index} className={classes.header}>
                    <div className={classes.content}>
                      <p>{item?.document_checklist_id + '). '}</p>
                      <p style={{ maxWidth: '400px' }}>{item?.document_title}</p>
                    </div>
                    <div>
                      <Checkbox
                        checked={Boolean(checklistData?.find(val => val?.document_checklist_id === item?.document_checklist_id)?.is_verified)}
                        size='small'
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        onChange={() => handleChecked(index, checklistData?.find(val => val?.document_checklist_id === item?.document_checklist_id))}
                      />
                    </div>
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