import { Flex, Button, Text, Box, Alert, Loader, Chip, Group, Select, Modal, Checkbox, Tooltip, ActionIcon, Stack, ScrollArea, Accordion, Textarea } from '@mantine/core';
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { action_id, resources_id } from '../../../config/accessControl';
import { sendLoanForEnhancement } from '../../../services/enhancement.service';
import { getLoanById, getLoanRejectReason, updateLoanApprovalStatusById, updateLoanStats, updateLoanStatusByLoanId } from '../../../services/loans.service';
import { isAllowed } from '../../../utils/cerbos';
import CheckAllowed from '../../rbac/CheckAllowed';
import RichTextEditorBox from '../../../components/RichTexEditor/RichTextEditorBox';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import classes from './SideDrawer.module.css';

const loanStatusList = [
  {
    label: 'Pre submit',
    value: 'pre_submit'
  }, {
    label: 'Submitted',
    value: 'submitted'
  }, {
    label: 'Pending Review',
    value: 'loan_review'
  }, {
    label: 'Pending Approval',
    value: 'loan_approval'
  }, {
    label: 'Approved',
    value: 'approved'
  }, {
    label: 'Disbursement Approval',
    value: 'disbursement_approval'
  },
]

const DrawerFooter = ({
  id,
  editable,
  currentUser,
  onClose,
  status,
  selectedLoanData,
  handleReviewModal,
  handleApprovalModal,
  handlePendingApprovalModal,
  updateApprovalStatus,
  disabled = false,
}) => {
  console.log('status : ',status)
  const history = useHistory();
  const { data: loanData = {}, isLoading: loanDataLoading } = useQuery(['loan-by-id', id], () => getLoanById(id, selectedLoanData?.id))
  const [reLoader, setReloader] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [pushback, setPushback] = useState(false);
  const [pushbackRemarks, setPushbackRemarks] = useState();
  const [optionsData, setOptionsData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState();
  const [activeTab, setActiveTab] = useState();
  const [reasonData, setReasonData] = useState()
  const [rejectReason, setRejectReason] = useState([])
  const [displayReason, setDisplayReason] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState();
  const [openEnhancementModal, setEnhancementModal] = useState(false)
  const [enhancementRemarks, setEnhancementRemarks] = useState();
  const [freeTextRemarks, setFreeTextRemarks] = useState();
  const [freeTextOpen, setFreeTextOpen] = useState(false);
  const [displayFreeTextRemarks, setDisplayFreeTextRemarks] = useState(false);
  const previousStatuses = useMemo(() => {
    const currentIndex = loanStatusList.findIndex(item => item.value === status);
    return currentIndex > 0 ? loanStatusList.slice(0, currentIndex) : loanStatusList;
  }, [status]);  
  useMount(() => {
    getLoanRejectReason()
      .then(data => {
        const optionsBuffer = []
        const dataBuffer = []
        data.map((data, index) => {
          optionsBuffer.push({ value: index, label: data.reason })
          dataBuffer.push([data.list.map((d) => { return ({ value: d.id, label: `${d.code} - ${d.description}` }) })])
        })
        setOptionsData(optionsBuffer)
        setReasonData(dataBuffer)
      })
      .catch(() => null)
  })

  const sortByKey = (a, b, key) => {
    if (a[key]?.trim() < b[key]?.trim()) {
      return -1;
    }
    if (a[key]?.trim() > b[key]?.trim()) {
      return 1;
    }
    return 0;
  }

  const handleResubmit = () => {
    setReloader(true);
    updateLoanStats(id, loanData.id)
      .then(res => {
        setReloader(false);
        displayNotification({
          message: res,
          variant: 'success',
        });
        setTimeout(() => {
          setReloader(false);
          window.location.reload();
        }, 2000)
      })
      .catch(() => {
        setReloader(false);
      })
  }
  const handlePushBack = () => {
    let reqBody = {
      ...pushback?.data,
      status: pushbackRemarks,
    }
    if (reqBody?.status) {
      if (reqBody?.remarks) {
        setLoading(true)
        updateLoanStatusByLoanId(loanData.id, reqBody)
          .then(res => {
            displayNotification({
              message: res,
              variant: 'success',
            });
            setTimeout(() => {
              window.location.reload();
              setLoading(false)
            }, 1500)
          })
          .catch(err => {
            setLoading(false)
            displayNotification({
              message: err,
              variant: 'error',
            });
          })
      } else {
        setErrorMsg('Please enter the Remarks')
      }
    }
    else {
      setErrorMsg('Please choose status')
    }
  }
  const removeItem = (item) => {
    setRejectReason(rejectReason.filter(value => value !== item.value))
    setDisplayReason(displayReason.filter(label => label.label !== item.label))
  }
  const handleReasonChange = (event) => {
    if (errorMsg) setErrorMsg()
    let reasonArray = [...displayReason, { label: event.target.name, value: event.target.value }];
    let arrayCheck = [...rejectReason, event.target.value];
    if (rejectReason.includes(event.target.value)) {
      arrayCheck = arrayCheck.filter(value => value !== event.target.value)
      reasonArray = reasonArray.filter(name => name.label !== event.target.name)
    }
    setDisplayReason(reasonArray)
    setRejectReason(arrayCheck)
  }

  const handlePushToEnhancement = () => {
    const { amount_approved, id, product_id, dealership_id } = selectedLoanData
    let reqBody = {
      loan_amount: amount_approved,
      loan_id: id,
      dealership_id: dealership_id,
      product_id: product_id,
      remarks: enhancementRemarks,
      category: loanData?.is_noc ? 'noc' : 'enhancement',
    }
    sendLoanForEnhancement(reqBody)
      .then(res => {
        displayNotification({
          message: res,
          variant: 'success',
        });
        setLoading(false)
        onClose()
        setEnhancementModal(false)
      })
      .catch(err => {
        setLoading(false)
        displayNotification({
          message: err,
          variant: 'error',
        });
      })
  }

  const updateLoanStatus = () => {
    let reqBody = {
      user_id: currentUser.id,
      reason_id: rejectReason,
    }
    if (displayFreeTextRemarks !== '' && displayFreeTextRemarks) {
      reqBody.reject_reason = displayFreeTextRemarks;
    }
    if (rejectReason?.length || (displayFreeTextRemarks !== '' && displayFreeTextRemarks)) {
      setLoading(true)
      updateLoanApprovalStatusById(id, loanData.id, 'reject', reqBody)
        .then(res => {
          displayNotification({
            message: res.message,
            variant: 'success',
          });
          setTimeout(() => {
            window.location.reload();
            setLoading(false)
          }, 1500)
        })
        .catch(err => {
          setLoading(false)
          displayNotification({
            message: err,
            variant: 'error',
          });
        })
    } else {
      setErrorMsg('Please Select a reason to reject this loan')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <>
      <Flex
        h="64"
        style={{
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: '#FFFFFF',
          borderTop: '1px solid #eaeaea',
          zIndex: 9
        }}
      >
        <Flex gap="xs">

          <CheckAllowed currentUser={currentUser} resource={resources_id?.dashboard} action={action_id?.dashboard.pushback}>
            {!['disbursed'].includes(status) ? (
              <Button
                variant="outline"
                size="xs"
                onClick={() => { setPushback({ ...pushback, open: true });['disbursed'].includes(status) && setPushbackRemarks('pre_submit') }}
              >
                Pushback
              </Button>
            ) : null}
          </CheckAllowed>

          {isAllowed(currentUser?.permissions, resources_id.dashboard, 'loan_resubmit') && status && ['loan_review', 'loan_approval', 'approved', 'rejected'].includes(status.toLowerCase()) && (
            <Button
              loading={reLoader}
              onClick={handleResubmit}
              size='xs'
            >
              Re-Submit
            </Button>
          )}

          {isAllowed(currentUser?.permissions, resources_id.dashboard, 'loan_resubmit') && status && ['disbursed'].includes(status.toLowerCase()) && (
            <Button
              loading={reLoader}
              onClick={() => setEnhancementModal(true)}
              size='xs'
            >
              Send for {loanData?.is_noc ? 'Re onboarding' : 'Enhancement'}
            </Button>
          )}
        </Flex>

        <Flex gap="xs">
          <Button
            variant="outline"
            size="xs"
            color="gray"
            onClick={() => history.push(`/dealership/${id}`)}
            disabled={loanDataLoading}
          >
            View more
          </Button>

          {status && ['submitted'].includes(status.toLowerCase()) && (
            <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'send_for_review'}>
              <Button
                variant="filled"
                size="xs"
                color="green"
                onClick={handleReviewModal}
                disabled={loanDataLoading}
              >
                Send for Review
              </Button>
            </CheckAllowed>
          )}

          {status && ['pre_submit'].includes(status.toLowerCase()) && (
            <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'loan_submit'}>
              <Button
                variant="filled"
                size="xs"
                color="green"
                onClick={handleReviewModal}
                disabled={loanDataLoading}
                loading={disabled}
              >
                Submit
              </Button>
            </CheckAllowed>
          )}

          {status && ['loan_approval', 'loan_review', 'disbursement_approval'].includes(status.toLowerCase()) && (
            <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'loan_reject'}>
              <Button
                variant="filled"
                size="xs"
                color="red"
                onClick={() => setRejectModal(true)}
                disabled={loanDataLoading}
              >
                Reject
              </Button>
            </CheckAllowed>
          )}

          {status && ['disbursement_approval'].includes(status.toLowerCase()) && (
            <CheckAllowed currentUser={currentUser} resource={resources_id.dashboard} action={'loan_approve'}>
              <Button
                variant="filled"
                size="xs"
                color="green"
                onClick={updateApprovalStatus}
                disabled={loanDataLoading}
              >
                Approve
              </Button>
            </CheckAllowed>
          )}

          {status && status.toLowerCase() === 'loan_approval' && (currentUser.id == loanData?.approver_id || isAllowed(currentUser?.permissions, resources_id.dashboard, 'loan_approve')) && (
            <Button
              variant="filled"
              size="xs"
              color="green"
              onClick={handlePendingApprovalModal}
              disabled={loanDataLoading}
            >
              Approve
            </Button>
          )}

          {status && ['loan_review'].includes(status.toLowerCase()) && (currentUser.id == loanData?.reviewer_id || isAllowed(currentUser?.permissions, resources_id.dashboard, 'send_for_approval')) && (
            <Button
              variant="filled"
              size="xs"
              color='green'
              onClick={handleApprovalModal}
              disabled={loanDataLoading}
            >
              Send for Approval
            </Button>
          )}
        </Flex>
      </Flex>

      <Modal
        opened={rejectModal}
        onClose={() => setRejectModal(false)}
        title={'Reject Remarks'}
        styles={{ root: { zIndex: 99999, position: 'absolute' } }}
        size={'lg'}
      >
        <>
          <ScrollArea.Autosize mah={400} mih={200} offsetScrollbars>
            <Box>
              {
                errorMsg &&
                  <Alert severity='error' style={{ marginBottom: 12 }}>{errorMsg}</Alert>
              }
              <Text mb={16} fz={'sm'}>Choose category and reasons for rejection.</Text>
              <Chip.Group
                onChange={(e) => {
                  setSelectedCategory({ label: e, value: optionsData?.find(i => i?.label === e)?.value })
                  setActiveTab(optionsData?.find(i => i?.label === e)?.value)
                }}
                value={optionsData?.find(i => i?.value === activeTab)?.label}
                multiple={false}
              >
                <Group gap={4} mt={'xs'} mb={'sm'}>
                  {
                    optionsData.map((item, i) => {
                      return <Chip variant='light' radius={'xs'} key={i} value={item?.label}>{item?.label}</Chip>
                    })
                  }
                </Group>
              </Chip.Group>
            </Box>
            {
              selectedCategory && (
                <Box>
                  <Checkbox.Group
                    value={rejectReason}
                    label={'Reason'}
                    description={'Select the reason to reject'}
                  >
                    <ScrollArea.Autosize mah={80} mih={25} my={'sm'} type="auto" scrollbars="y">
                      <Stack mah={80} mih={25}>
                        {
                          reasonData[selectedCategory.value][0].map((data, index) => {
                            return (
                              <Checkbox
                                key={`${index}-${data?.value}`}
                                styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
                                value={data.value}
                                size='xs'
                                onChange={handleReasonChange}
                                checked={rejectReason.includes(data.value)}
                                name={data.label}
                                label={data.label}
                              />
                            )
                          })
                        }
                      </Stack>
                    </ScrollArea.Autosize>
                  </Checkbox.Group>
                  {selectedCategory.value === 4 && (
                    <>
                      <Accordion 
                        styles={{
                          content: {
                            padding: '5px 0px',
                          },
                        }}
                        value={freeTextOpen}
                        onChange={e => setFreeTextOpen(e)}
                      >
                        <Accordion.Item value="Accordion Title" >
                          <Accordion.Control bg='blue.1'><Text fz={'sm'}>Additional Reason</Text></Accordion.Control>
                          <Accordion.Panel ><Textarea onChange={(e)=>{setFreeTextRemarks(e.target.value)}} autosize value={freeTextRemarks} minRows={6} placeholder='Type reason' onKeyDown={handleKeyDown}/>
                            <Group justify="flex-end" mb={'md'} mt={5} gap={8}>
                              <ActionIcon variant="default" onClick={() => {
                                setFreeTextRemarks('')}}>
                                <IconX color='red'/>
                              </ActionIcon>
                              <ActionIcon variant="default" onClick={()=> setDisplayFreeTextRemarks(freeTextRemarks)}>
                                <IconCheck color='green'/> 
                              </ActionIcon>
                            </Group>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion >
                    </>
                  )
                  }
                </Box>
              )
            }
            {
              displayReason.length != 0 && (
                <Box mb={'md'} className={classes.actions2} pt={'xs'}>
                  <Text fz={'sm'}>Selected Reasons</Text>
                  {
                    displayReason.sort((a, b) => sortByKey(a, b, 'label')).map((item, i) => {
                      return (
                        <Box key={i} className={classes.items}>
                          <p className={classes.eachItem}><span className={classes.itemNotation}>{i + 1}.</span> {item.label}</p>
                          <Tooltip label="Remove" color='gray' withArrow>
                            <ActionIcon size='xs' color='gray' onClick={() => removeItem(item)} variant="transparent">
                              <IconX />
                            </ActionIcon>
                          </Tooltip>
                        </Box>
                      )
                    })
                  }
                </Box>
              )
            }
            {
              displayFreeTextRemarks && (
                <Box mb={'md'} className={classes.actions2} pt={'xs'}>
                  <Text fz={'sm'}>Additional Reasons</Text>
                  {
                    <Box className={classes.items}>
                      <Text> {displayFreeTextRemarks}</Text>
                      <Tooltip label="Remove" color='gray' withArrow>
                        <ActionIcon size='xs' color='gray' onClick={() => setDisplayFreeTextRemarks(null)} variant="transparent">
                          <IconX />
                        </ActionIcon>
                      </Tooltip>
                    </Box>
                  }
                </Box>
              )
            }
            
          </ScrollArea.Autosize>
        </>
        <Group justify='flex-end' mt={'md'}>
          <Button variant='outline' size='xs' onClick={() => setRejectModal(false)}>Cancel</Button>
          <Button size='xs' color='red' onClick={updateLoanStatus} loading={loading}>Confirm</Button>
        </Group>
      </Modal>

      <Modal
        size="lg"
        withCloseButton={false}
        opened={pushback?.open}
        onClose={() => setPushback({})}
        styles={{ root: { zIndex: 99999, position: 'absolute' } }}
      >
        <Box>
          <Box mb="md">
            <Text>Please choose status where you want to push back.</Text>
            <Select
              clearable
              onChange={(e) => {
                setPushbackRemarks(e)}}
              value={pushbackRemarks}
              data={previousStatuses}
              styles={{ dropdown: { zIndex: 99999, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px' } }}
              comboboxProps={{ offset: 2 }}
            />
          </Box>

          <Box mb="md">
            <Text>Please Enter the reason for Push back.</Text>
            <RichTextEditorBox
              onChange={(data) => setPushback({
                ...pushback,
                data: {
                  ...pushback.data,
                  remarks: data
                }
              })}
              toolBar={true}
            />
          </Box>

          {errorMsg && (
            <Alert variant="light" color="red" radius="md" title={errorMsg} icon={<IconInfoCircle />} p="xs" mb="xl" />
          )}

          <Flex gap="xs" justify="end">
            {/* <Button variant='outlined' style={{ marginRight: 8 }} onClick={() => setPushback({ ...pushback, open: false })}>
              Cancel
            </Button>
            
            <LoaderButton
              color='primary'
              variant='contained'
              isLoading={loading}
              loadingText='Submitting...'
              onClick={handlePushBack}
            >
              Confirm
            </LoaderButton> */}

            <Button
              variant="outline"
              size="xs"
              onClick={() => setPushback({ ...pushback, open: false })}
            >
              Cancel
            </Button>

            <Button
              variant="filled"
              size="xs"
              color='green'
              onClick={handlePushBack}
              loading={loading}
            >
              Confirm

              {loading && (
                <Loader ml="md" color="rgba(255, 255, 255, 1)" size="xs" />
              )}
            </Button>
          </Flex>
        </Box>
      </Modal>

      {/* <Dialog
        open={pushback?.open}
        onClose={() => setPushback({})}
      >
        <DialogContent>
          <div style={{ marginBottom: 12 }}>
            <DialogContentText>
              Please choose status where you want to push back.
            </DialogContentText>
            <Select
              isClearable
              onChange={(e) => setPushbackRemarks(e?.value)}
              value={loanStatusList?.find(e => e.value === pushbackRemarks)}
              options={loanStatusList}
              menuPlacement='bottom'
              menuPosition='fixed'
              maxMenuHeight='200px'
            />
          </div>
          <DialogContentText>
            Please Enter the reason for Push back.
          </DialogContentText>
          <TextEditor
            setJSON={(data) => setPushback({
              ...pushback,
              data: {
                ...pushback.data,
                remarks: data
              }
            })}
            toolBar={true}
          />
          {
            errorMsg &&
              <Alert severity="error" style={{ padding: '0px 16px' }}>{errorMsg}</Alert>
          }
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 5 }}>
            <Button variant='outlined' style={{ marginRight: 8 }} onClick={() => setPushback({ ...pushback, open: false })}>Cancel</Button>
            <LoaderButton
              color='primary'
              variant='contained'
              isLoading={loading}
              loadingText='Submitting...'
              onClick={handlePushBack}
            >Confirm</LoaderButton>
          </div>
        </DialogContent>
      </Dialog> */}

      <Modal
        opened={openEnhancementModal}
        onClose={() => setEnhancementModal(false)}
        zIndex={99999}
        withCloseButton={false}
      >
        <Text>
          {`Are you sure want to move your loan for ${loanData?.is_noc ? 'Re onboarding' : 'Enhancement'}?`}
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <Button variant='outline' size='xs' style={{ marginRight: 8 }} onClick={() => setEnhancementModal(false)}>Cancel</Button>
          <Button
            loading={loading}
            size='xs'
            color='green'
            onClick={handlePushToEnhancement}
          >Yes</Button>
        </div>
      </Modal>
    </>
  )
}

export default DrawerFooter;