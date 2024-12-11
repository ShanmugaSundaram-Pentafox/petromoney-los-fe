import { Stack, Table, Text, Title, Button, Select as MantineSelect, Group, Box, ScrollArea, Select, Loader, Alert } from '@mantine/core';
import Tooltip from '@material-ui/core/Tooltip';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import AccountStatement from './AccountStatement';
import { Modal } from '../../../components/Mantine/Modal/Modal';
import Currency from '../../../components/Number/Currency';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getUserRoleForReview } from '../../../services/common.service';
import { getDealershipLoansById } from '../../../services/dealerships.service';
import { getApplicationStatusById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import apiCall from '../../../utils/api.util';
import { isAllowed } from '../../../utils/cerbos';
import RichTextEditorBox from '../../../components/RichTexEditor/RichTextEditorBox';
import { useDebouncedState } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';

const LoansList = ({ id, currentUser, titleAlign }) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState();
  const [dialogState, setDialogState] = useState({});
  const [user, setUser] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const [searchValue, setSearchValue] = useDebouncedState('');
  const readOnly = permissionCheck(currentUser.role_name, rulesList.external_view);
  const { enqueueSnackbar } = useSnackbar();
  const [errorStatus, setErrorStatus] = useState()
  const { data: loanData = [], isLoading } = useQuery(['dealership-loans', id], () => getDealershipLoansById(id), { refetchOnWindowFocus: false })
  const { data: status } = useQuery(
    ['dealership-status', id],
    () => getApplicationStatusById(id),
    {
      onSuccess: (data) => {
        const re = data?.find(d => d.id == loanData[0]?.application_state_id)
        setSelectedStatus({ ...re, value: `${re?.id}-${re?.application_state}`, disabled: data !== 'loan_approval' } || {})
      },
      enabled: Boolean(loanData?.[0]?.id),
      refetchOnWindowFocus: false
    }
  );
  const { data: userRole , isLoading: userRoleLoading } = useQuery(
    ['userRoles', searchValue, status, loanData],
    () => getUserRoleForReview({ status: loanData[0].status === 'submitted' ? 'is_review=1' : 'is_approve=1', search: searchValue }),
    {
      select: (data) =>
        data.map((item) => ({
          label: `${item.first_name} ${item.last_name || ''}`.trim(),
          value: item.id?.toString(),
        })),
      enabled: Boolean(!isLoading && loanData.length && isAllowed(currentUser?.permissions, resources_id.dashboard, action_id.dashboard.send_for_approval)),
    }
  );

  const processLoan = loan => {
    if (user && remarks) {
      let status, remarksObj = {};
      if (loan?.status?.toLowerCase() === 'submitted') {
        setLoading(true);
        status = 'loan_review';
        remarksObj.user_id = currentUser?.id
        remarksObj.reviewer_id = parseInt(user);
        remarksObj.review_remarks = remarks;
      } else if (loan?.status?.toLowerCase() === 'loan_review') {
        setLoading(true);
        status = 'loan_approval';
        remarksObj.user_id = currentUser?.id
        remarksObj.approver_id = parseInt(user);
        remarksObj.approval_remarks = remarks;
      }
      else if (loan?.status?.toLowerCase() === 'approved') {
        setLoading(true);
        status = 'disbursement_approval';
        remarksObj.disbursement_recommendation_remarks = remarks;
      }

      status && updateLoanApprovalStatusById(id, loan.id, 'approval', { user_id: currentUser.id, ...remarksObj })
        .then(res => {
          queryClient.invalidateQueries(['dealership-loans', id])
          setLoading(false);
          setDialogState({});
        })
        .catch(err => {
          setLoading(false);
          setDialogState({});
          enqueueSnackbar(err, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
          });
        })
    } else {
      setErrorStatus('Please select approver and enter remarks.')
    }
  }

  const editable = isAllowed(currentUser?.permissions, resources_id?.loansList, action_id?.loansList?.action)

  const getRemarks = loan => () => {
    setDialogState({ open: true, data: loan });
  }

  const submitRemarks = () => {
    processLoan({ ...dialogState.data });
  }

  const updateApplicationStatus = (state) => {
    apiCall(`dealership/${id}/loans/${loanData[0].id}`, {
      method: 'POST',
      body: state,
    })
      .then(res => {
        if (res.status === 'SUCCESS') {
          queryClient.invalidateQueries(['dealership-loans', id])
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

  if (!loanData || !loanData.length)
    return (
      <Stack mih="320" align="center" justify="center">
        <Text>No Loan details found</Text>
      </Stack>
    );

  return (
    <>
      <Title order={3} mb="lg">Loans</Title>
      <Box style={{ display: 'flex', }}>
        <Box style={{ flex: 1, overflowX: 'scroll', width: '700px' }}>
          <ScrollArea.Autosize>
            <Table fz="xs" aria-label="Dealers">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Appr</Table.Th>
                  <Table.Th>Disb</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Application Status</Table.Th>
                  <Table.Th ta="center">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {Array.isArray(loanData) && loanData?.map(row => (
                  <Table.Tr key={row.id}>
                    <Table.Td className="whitespace-nowrap">{row.type}</Table.Td>

                    <Table.Td>
                      <Tooltip title={row.approval_remarks} arrow>
                        <Currency value={row.amount_approved} />
                      </Tooltip>
                    </Table.Td>

                    <Table.Td>
                      <Tooltip title={row.disbursement_approval_remarks} arrow>
                        <Currency value={row.amount_disbursed} />
                      </Tooltip>
                    </Table.Td>

                    <Table.Td>{row.status}</Table.Td>

                    <Table.Td>
                      {row?.status?.toLowerCase() !== 'disbursed' && row?.status?.toLowerCase() !== 'rejected' && (
                        <MantineSelect
                          w={200}
                          placeholder='Select Status'
                          value={selectedStatus?.value}
                          disabled={!isAllowed(currentUser?.permissions, resources_id?.loansList, action_id?.loansList?.applicationStatus)}
                          onChange={(_value, option) => {
                            setSelectedStatus(option)
                            updateApplicationStatus({
                              application_state: option?.id
                            })
                          }}
                          size='xs'
                          data={status?.map((i) => ({
                            label: i?.application_state,
                            value: `${i?.id}-${i?.application_state}`,
                            ...i,
                          }))}
                        />
                        // <MSelect
                        //   fullWidth
                        //   native
                        //   placeholder={'Select status'}
                        //   value={selectedStatus?.id}
                        //   disabled={!isAllowed(currentUser?.permissions, resources_id?.loansList, action_id?.loansList?.applicationStatus)}
                        //   onChange={e => {
                        //     const d = status?.find(i => i.id == e.target.value)
                        //     setSelectedStatus(d)
                        //     updateApplicationStatus({
                        //       application_state: e.target.value
                        //     })
                        //   }}
                        // >
                        //   <option value=''>-</option>
                        //   {
                        //     status?.map((item, i) => item.application_state !== row.application_state && <option key={i} value={item.id}>{item.application_state}</option>)
                        //   }
                        // </MSelect>
                      )}
                    </Table.Td>

                    <Table.Td>
                      {row?.status?.toLowerCase() === 'submitted' && editable && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={getRemarks(row)}
                          disabled={loading}
                        >
                          {loading ? 'Please wait...' : 'Send for review'}
                        </Button>
                      )}

                      {row?.status?.toLowerCase() === 'loan_review' && editable && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={getRemarks(row)}
                          disabled={loading}
                        >
                          {loading ? 'Please wait...' : 'Send for Approval'}
                        </Button>
                      )}

                      {row?.status?.toLowerCase() === 'approved' && editable && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={getRemarks(row)}
                          disabled={loading}
                        >
                          {loading ? 'Please wait...' : 'Send for Disbursement Approval'}
                        </Button>
                      )}

                      {row?.status?.toLowerCase() === 'loan_approval' && 'Pending for approval'}

                      {row?.status?.toLowerCase() === 'disbursement_approval' && 'Pending for disbursement approval'}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea.Autosize>
        </Box>
      </Box>

      {loanData[0]?.status === 'disbursed' && isAllowed(currentUser?.permissions, resources_id?.loansList, action_id?.loansList?.statement) && (
        <div style={{ marginTop: 18 }}>
          <AccountStatement id={id} currentUser={currentUser} />
        </div>
      )}

      <Modal
        size="lg"
        centered
        open={dialogState.open}
        close={() => {setDialogState({})
          setSearchValue(null)
          setErrorStatus(null)
        }}
        title={`Send for ${dialogState.data?.status?.toLowerCase() === 'submitted' ? 'review' : dialogState.data?.status?.toLowerCase() === 'loan_review' ? 'Approval' : 'Pre Disbursement Approval'}`}
      >
        {dialogState.data?.status?.toLowerCase() === 'submitted' && (
          <Stack gap="4">
            <Text id="approval-remarks-desc">Please choose whom did you want to sent for review</Text>
            <Select
              searchable
              nothingFoundMessage = {userRoleLoading ? <Loader size="xs"/> : 'No data found'}
              onSearchChange={setSearchValue}
              onBlur={setSearchValue(null)}
              placeholder='search or select reviewer'
              clearable
              name='type'
              onChange={setUser}
              data={userRole || []}
              styles={{ dropdown: { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', zIndex: 99999 } }}
              menuPlacement='bottom'
              menuPosition='fixed'
              maxMenuHeight='200px'
              mb='xs'
            />
          </Stack>
        )}

        {dialogState.data?.status?.toLowerCase() === 'loan_review' && (
          <Stack gap="4">
            <Text id="approval-remarks-desc">Please choose whom did you want to sent for approval</Text>
            <Select
              searchable
              onSearchChange={setSearchValue}
              onBlur={setSearchValue(null)}
              nothingFoundMessage = {userRoleLoading ? <Loader size="xs"/> : 'No data found'}
              placeholder='search or select reviewer'
              clearable
              name='review'
              onChange={setUser}
              data={userRole || []}
              styles={{ dropdown: { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', zIndex: 99999 } }}
              menuPlacement='bottom'
              menuPosition='fixed'
              maxMenuHeight='200px'
              mb='xs'
            />
          </Stack>
        )}

        <Text id="approval-remarks-desc">Please enter your remarks for sending this for {dialogState.data?.status?.toLowerCase() === 'submitted' ? 'review' : dialogState.data?.status?.toLowerCase() === 'loan_review' ? 'Approval' : 'Disbursement Approval'}</Text>
        <RichTextEditorBox
          onChange={setRemarks}
        />
        {
          errorStatus
            ? <Alert mt='xs' variant='light' color='orange' title='Error!' icon={<IconInfoCircle />}>
              {errorStatus}
            </Alert>
            : null
        }

        {/* <TextInput
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
            /> */}
        <Group justify='flex-end' mt={'md'}>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setDialogState({})}
          >
            Cancel
          </Button>

          <Button
            size="xs"
            color={'green'}
            onClick={submitRemarks}
            loading={loading}
          >
            Confirm
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default LoansList;