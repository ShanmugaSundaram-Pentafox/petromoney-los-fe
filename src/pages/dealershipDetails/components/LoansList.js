import { Flex, Stack, Table, Text, Title } from '@mantine/core';
import { Select as MSelect } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import AccountStatement from './AccountStatement';
import { Button } from '../../../components/Mantine/Button/Button';
import { Modal } from '../../../components/Mantine/Modal/Modal';
import Currency from '../../../components/Number/Currency';
import { TextEditor } from '../../../components/TextEditor/TextEditor';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getUserRoleForReview } from '../../../services/common.service';
import { getDealershipLoansById } from '../../../services/dealerships.service';
import { getApplicationStatusById, updateLoanApprovalStatusById } from '../../../services/loans.service';
import apiCall from '../../../utils/api.util';
import { isAllowed } from '../../../utils/cerbos';

const LoansList = ({ id, currentUser, titleAlign }) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState();
  const [dialogState, setDialogState] = useState({});
  const [user, setUser] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const readOnly = permissionCheck(currentUser.role_name, rulesList.external_view);
  const { enqueueSnackbar } = useSnackbar();
  const { data: loanData = [], isLoading } = useQuery(['dealership-loans', id], () => getDealershipLoansById(id), { refetchOnWindowFocus: false })
  const { data: status } = useQuery(['dealership-status', id], () => getApplicationStatusById(id), { refetchOnWindowFocus: false })

  useEffect(() => {
    if (!isLoading) {
      if (loanData.length) {
        let val = loanData[0].status === 'submitted' ? 'is_review=1' : 'is_approve=1'
        if (isAllowed(currentUser?.permissions, resources_id.dashboard, action_id.dashboard.send_for_review)) {
          getUserRoleForReview(val)
            .then(res => {
              let d = [];
              res.forEach((item, i) => {
                d.push({
                  label: <div>{item.first_name} {item.last_name}</div>,
                  value: item.id
                })
              })
              setUserRole(d);
            })
            .catch(e => {
              console.log(e);
            })
        }
      }
    }
    if (loanData[0]?.application_state_id) {
      const re = status?.find(d => d.id == loanData[0]?.application_state_id)
      setSelectedStatus({ ...re, disabled: status !== 'loan_approval' } || {})
    }
  }, [status, loanData])

  const processLoan = loan => {
    let status, remarksObj = {};
    if (loan?.status?.toLowerCase() === 'submitted') {
      setLoading(true);
      status = 'loan_review';
      remarksObj.reviewer_id = user.value;
      remarksObj.review_remarks = remarks;
    } else if (loan?.status?.toLowerCase() === 'loan_review') {
      setLoading(true);
      status = 'loan_approval';
      remarksObj.approver_id = user.value;
      remarksObj.recommendation_remarks = remarks;
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
      
      <Table fz="xs" aria-label="Dealers">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Type</Table.Th>
            <Table.Th>Req</Table.Th>
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
              
              <Table.Td><Currency value={row.amount_requested} /></Table.Td>
              
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
                  <MSelect
                    fullWidth
                    native
                    placeholder={'Select status'}
                    value={selectedStatus?.id}
                    disabled={!isAllowed(currentUser?.permissions, resources_id?.loansList, action_id?.loansList?.applicationStatus)}
                    onChange={e => {
                      const d = status?.find(i => i.id == e.target.value)
                      setSelectedStatus(d)
                      updateApplicationStatus({
                        application_state: e.target.value
                      })
                    }}
                  >
                    <option value=''>-</option>
                    {
                      status?.map((item, i) => item.application_state !== row.application_state && <option key={i} value={item.id}>{item.application_state}</option>)
                    }
                  </MSelect>
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

      {loanData[0]?.status === 'disbursed' && isAllowed(currentUser?.permissions, resources_id?.loansList, action_id?.loansList?.statement) && (
        <div style={{ marginTop: 18 }}>
          <AccountStatement id={id} currentUser={currentUser} />
        </div>
      )}

      <Modal
        size="lg"
        centered
        open={dialogState.open}
        close={() => setDialogState({})}
        title={`Remarks: Send for ${dialogState.data?.status?.toLowerCase() === 'submitted' ? 'review' : dialogState.data?.status?.toLowerCase() === 'loan_review' ? 'Approval' : 'Disbursement Approval'}`}
      >
        <Stack mih="320" gap="md">
          {dialogState.data?.status?.toLowerCase() === 'submitted' && (
            <Stack gap="4">
              <Text id="approval-remarks-desc">Please choose whom did you want to sent for review</Text>
              <Select
                isClearable
                name='type'
                onChange={setUser}
                options={userRole}
                maxMenuHeight="200px"
              />
            </Stack>
          )}
            
          {dialogState.data?.status?.toLowerCase() === 'loan_review' && (
            <Stack gap="4">
              <Text id="approval-remarks-desc">Please choose whom did you want to sent for approval</Text>

              <Select
                isClearable
                name='review'
                onChange={setUser}
                options={userRole}
                maxMenuHeight="250px"
              />
            </Stack>
          )}

          <Stack gap="4">
            <Text id="approval-remarks-desc">Please enter your remarks for sending this for {dialogState.data?.status?.toLowerCase() === 'submitted' ? 'review' : dialogState.data?.status?.toLowerCase() === 'loan_review' ? 'Approval' : 'Disbursement Approval'}</Text>
            <TextEditor 
              setJSON={setRemarks} 
              toolBar={true} 
            />

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
          </Stack>
          
          <Flex
            align="center"
            justify="end"
            gap="xs"
            mt="auto"
          >
            <Button 
              colorScheme="secondary"
              variant="outline"
              size="md"
              onClick={() => setDialogState({})}
            >
              Cancel
            </Button>

            <Button 
              colorScheme="primary"
              variant="filled"
              size="md"
              onClick={submitRemarks}
              disabled={!remarks || loading} 
            >
              {loading ? 'Please wait...' : 'Confirm'}
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </>
  )
}

export default LoansList;