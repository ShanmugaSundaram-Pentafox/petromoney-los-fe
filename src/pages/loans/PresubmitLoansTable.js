import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { NavLink as RouterLink } from 'react-router-dom';
import Currency from '../../components/Number/Currency';
import { permissionCheck } from '../../components/UserCan/UserCan';
import { rulesList } from '../../config/userRules';
import { getDealershipById } from '../../services/dealerships.service';
import { getDocumentsChecklistById, getLoansByStatus, updateDocumentChecklistById } from '../../services/loans.service';
import SubmittedDrawer from '../dashboard/RightDrawer/SubmittedDrawer';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { ActionIcon, Badge, Box, Button, Checkbox, Modal, TextInput, Tooltip } from '@mantine/core';
import { IconLink, IconPlus } from '@tabler/icons-react';
import { RightSideDrawer } from '../../components/Mantine/RightSideDrawer/RightSideDrawer';
import COLORS from '../../theme/colors';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500
  },
  pill: {
    display: 'inline-block',
    borderRadius: '29px',
    padding: '3px 0px',
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
  const [dealershipData, setDealershipData] = useState();
  const [loansData, setLoansData] = useState();
  const [showPanel, setShowPanel] = useState({ status: false, data: '' });
  const [docModal, setDocModal] = useState({ modal: false });
  const [checklistData, setChecklistData] = useState([]);
  const [newValue, setNewValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const getPreSubmitLoansQuery = useQuery({
    queryKey: ['pre-submit-loans'],
    queryFn: () => getLoansByStatus('pre_submit', ''),
  })

  // getting the list of doc based on the id
  const getDocChecklistQuery = useQuery({
    queryKey: ['doc-checklist', docModal?.id],
    queryFn: () => getDocumentsChecklistById({ id: docModal?.id }),
    enabled: Boolean(docModal?.id),
    onSuccess: (data) => {
      setChecklistData(data);
    },
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
    {
      key: 'dealership_id',
      header: 'Dealership Id',
      enableColumnFilter: false,
      cell: (value) => <RouterLink to={`/dealership/${value?.getValue()}`}><span style={{color: COLORS.text.blue }}>{value?.getValue()}</span></RouterLink>,
      sorting: true,
    }, {
      key: 'name',
      header: 'Name',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue()?.toUpperCase()}</span>,
      sorting: true,
    }, {
      key: 'type',
      header: 'Type',
      cell: (value) => <span className={clsx(classes.pill, classes[`pills_${value?.getValue()}`])}>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
      cell: (value) => <span>{value?.getValue() ? value?.getValue().toLowerCase().replace(/^(.)|\s+(.)/g, value => value.toUpperCase()) : '-'}</span>
    }, {
      key: 'amount_requested',
      header: 'Req. Amount',
      enableColumnFilter: false,
      cell: (value) => <Currency value={value?.getValue()} />
    }, {
      key: 'created_date',
      header: 'Req. Date',
      enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() ? moment(new Date(value?.getValue())).format('DD-MM-YYYY') : '-'}</span>,
      sorting: true,
    }, {
      key: 'application_state',
      header: 'Application State',
      // enableColumnFilter: false,
      cell: (value) => <span>{value?.getValue() || '-'}</span>
    }, {
      key: 'action',
      header: 'Documents',
      isHeaderDownload: false,
      enableColumnFilter: false,
      cell: (value) => (
        <Tooltip label={'Click to view documents'} color='gray' withArrow>
          <ActionIcon size="xs" variant='transparent' onClick={() => setDocModal({ modal: true, id: value?.row?.original?.dealership_id })}><IconLink /></ActionIcon>
        </Tooltip>
      )
    },
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
      <DataTableViewer
        allowSorting={true}
        column={column}
        rowData={getPreSubmitLoansQuery?.data}
        title={'Pre Submit queue'}
        count={getPreSubmitLoansQuery?.data?.length}
        excelDownload
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'pre_submit')}
        loading={getPreSubmitLoansQuery?.isLoading}
      />
      <RightSideDrawer
        size={'70%'}
        opened={showPanel.status}
        onClose={() => { setShowPanel({ status: false, data: '' }) }}
        title={<Badge color="blue" size='lg' variant='light'>{loansData?.dealership_id} - {loansData?.name}</Badge>}
      >
        <SubmittedDrawer id={showPanel?.id} status={showPanel?.data} editable={showPanel?.editable} currentUser={currentUser} data={dealershipData} onClose={() => { setShowPanel({ status: false, data: '' }) }} selectedLoanData={loansData} />
      </RightSideDrawer>

      <Modal
        opened={docModal?.modal}
        onClose={() => { setDocModal({}); setChecklistData([]); }}
        title={'Document Checklist'}
        size={'lg'}
      >
        <div>
          <p id="modal-description">List of documents that need to collect</p>
        </div>
        <div style={{ marginTop: '10px' }} className={classes.outerContent}>
          {checklistData?.length
            ? checklistData?.map((item, index) => (
              <div key={item}>
                <Box className={classes.content} style={{ fontWeight: '700', fontSize: '14px' }} mt={10} mb={4}>
                  <p>{(index + 1) + '). '}</p>
                  <div>{Object.entries(item)?.[0]?.[0]}</div>
                </Box>
                {Object.entries(item)?.[0]?.[1]?.map((value, i) => (
                  <>
                    <Box key={i} className={classes.header} ml={10} mb={4}>
                      <div className={classes.content}>
                        <p>{(index + 1) + '.' + (i + 1) + '). '}</p>
                        <p style={{ maxWidth: '400px' }}>{Object.entries(value)?.[0]?.[0]}</p>
                      </div>
                      <Checkbox
                        mr={4}
                        checked={Boolean(Object.entries(value)?.[0]?.[1])}
                        size='xs'
                        styles={{ input: { cursor: 'pointer' } }}
                        onChange={() => handleChecked({ index: index, insideIndex: i, title: Object.entries(item)?.[0]?.[0], value: Object.entries(value)?.[0]?.[1], key: Object.entries(value)?.[0]?.[0] })}
                      />
                    </Box>
                  </>
                ))}
                {Object.entries(item)?.[0]?.[0] == 'Other documents' ? (
                  <div className={classes.header} style={{ marginLeft: '10px' }}>
                    <div className={classes.content} style={{ alignItems: 'center' }}>
                      <TextInput size='xs' onChange={(e) => setNewValue(e.target.value)} value={newValue} placeholder={'Doc Name'} />
                      <Tooltip label={'Click to add'} color='gray' withArrow>
                        <ActionIcon size={'md'} onClick={() => handleOthersAddition(index, item)} color='teal'>
                          <IconPlus />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </div>
                ) : null}
              </div>
            )) : getDocChecklistQuery?.isLoading ? <center><CircularProgress /></center> : <center>No Data to display</center>}
        </div>
        <div className={classes.header} style={{ justifyContent: 'right', marginTop: '20px' }}>
          <Button
            size='xs'
            color='green'
            loading={docModal?.isLoading}
            onClick={handleDocChecklistUpdate}
          >
            Save
          </Button>
        </div>
      </Modal>
    </div>
  )
}


export default PresubmitLoansTable;