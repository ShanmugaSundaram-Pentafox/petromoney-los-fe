import { Box, Flex, Image, Text } from '@mantine/core';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import AddIconButton from './AddIcon';
import CoApplicantsTable from './CoApplicantsTable';
import DealerEditSideWrapper from './DealerEditSideWrapper';
import DealersTable from './DealersTable';
import GuarantorsTable from './GuarantorsTable';
import { Button } from '../../../components/Mantine/Button/Button';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
import TextInput from '../../../components/TextInput/TextInput';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { action_id, resources_id } from '../../../config/accessControl';
import { rulesList } from '../../../config/userRules';
import { getAllApplicantsByDealershipId, updateApplicantDataById } from '../../../services/dealers.service';
import CheckAllowed from '../../rbac/CheckAllowed';

const DealersList = ({ id, titleAlign, currentUser }) => {
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showDealerEditForm, setShowDealerEditForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [modelType, setModelType] = useState('');
  const [rowData, setRowData] = useState({});
  const [updateApplicant, setUpdateApplicant] = useState({})
  const [activeApplicant, setActiveApplicant] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const { data: applicantsData, refetch } = useQuery(['dealership-applicants', id], () => getAllApplicantsByDealershipId(id), {
    initialData: [],
    refetchOnWindowFocus: false
  })
  useEffect(() => {
    if (applicantsData) {
      const res = applicantsData?.filter(d => ((d?.is_active == 1) && (d?.category === 'DEALER')))
      setActiveApplicant(res)
    }
  }, [applicantsData])

  const openCloseCreditForm = () => {
    setShowCreditForm(!showCreditForm);
  }

  const onClickAddMenu = (modelType) => {
    if (modelType === 'DEALER') {
      setModelType('DEALER')
    } else if (modelType === 'COAPPLICANT') {
      setModelType('COAPPLICANT')
    } else if (modelType === 'GUARANTOR') {
      setModelType('GUARANTOR')
    }
    setFormType('Add');
    setRowData({})
    setShowDealerEditForm(true);
    return null;
  }

  const dealersClickRow = (e, row, type) => {
    if (e.target.tagName === 'A') {
      return null;
    }
    const d = { ...row, pan_details: typeof (row.pan_details) === 'string' ? JSON.parse(row.pan_details) : (row.pan_details || {}) }
    setModelType(type);
    setFormType('Edit');
    setShowDealerEditForm(true);
    setRowData(d);
  }

  const editFormClose = (type) => {
    setShowDealerEditForm(false)
  }
  const updateApplicantData = () => {
    updateApplicantDataById(id, updateApplicant?.value)
      .then((res) => {
        refetch();
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        });
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        });
      })

  }

  const deletable = permissionCheck(currentUser.role_name, rulesList.applicant_delete);

  return (
    <>
      <Flex justify="end" mb="10">
        {activeApplicant?.length > 1 && (
          <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.applicantSwap}>
            <Flex align="center" gap="sm">
              <Flex align="center" gap="xs">
                <label>Change main Applicant</label>

                <TextInput
                  select
                  error={updateApplicant?.error}
                  helperText={updateApplicant?.error}
                  value={updateApplicant?.value}
                  onChange={(e) => setUpdateApplicant({ updateApplicant, value: e?.target?.value })}
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                >
                  <option value=''>choose applicant</option>
                  {activeApplicant?.map((item, i) => {
                    return <option key={i} value={item?.id}>{item.first_name}</option>
                  })}
                </TextInput>
              </Flex>

              {updateApplicant?.value ? (
                <Button onClick={updateApplicantData}>
                  Update
                </Button>
              ) : null}
            </Flex>
          </CheckAllowed>
        )}

        <CheckAllowed currentUser={currentUser} resource={resources_id?.dealer} action={action_id?.dealer?.dealerAdd}>
          <Flex ml="sm">
            <AddIconButton onClickAddMenu={onClickAddMenu} />
          </Flex>
        </CheckAllowed>
      </Flex>
      {(applicantsData?.filter(item => item.category === 'DEALER').length !== 0) && (
        <Box style={{ display: 'flex', }}>
          <Box style={{ flex: 1, overflowX: 'scroll', width: '700px' }}>
            <DealersTable
              id={id}
              deletable={deletable}
              data={applicantsData?.filter(item => item.category === 'DEALER')}
              formType={formType}
              rowData={rowData}
              titleAlign={titleAlign}
              showCreditForm={showCreditForm}
              openCloseCreditForm={openCloseCreditForm}
              editFormClose={editFormClose}
              dealersClickRow={dealersClickRow}
              onClickAddMenu={onClickAddMenu}
              currentUser={currentUser}
              showDealerEditForm={showDealerEditForm} />
          </Box>
        </Box>)}
      {(applicantsData?.filter(item => item.category === 'COAPPLICANT').length !== 0) && (
        <Box style={{ display: 'flex', }}>
          <Box style={{ flex: 1, overflowX: 'scroll', width: '700px' }}>
            <CoApplicantsTable
              id={id}
              deletable={deletable}
              titleAlign={titleAlign}
              coApplicantsData={applicantsData?.filter(item => item.category === 'COAPPLICANT')}
              formType={formType}
              rowData={rowData}
              showCreditForm={showCreditForm}
              openCloseCreditForm={openCloseCreditForm}
              editFormClose={editFormClose}
              dealersClickRow={dealersClickRow}
              onClickAddMenu={onClickAddMenu}
              currentUser={currentUser}
              showDealerEditForm={showDealerEditForm} />
          </Box>
        </Box>)}
      {(applicantsData?.filter(item => item.category === 'GUARANTOR').length !== 0) && (
        <Box style={{ display: 'flex', }}>
          <Box style={{ flex: 1, overflowX: 'scroll', width: '700px' }}>
            <GuarantorsTable
              id={id}
              deletable={deletable}
              titleAlign={titleAlign}
              guarantorsData={applicantsData?.filter(item => item.category === 'GUARANTOR')}
              formType={formType}
              rowData={rowData}
              showCreditForm={showCreditForm}
              openCloseCreditForm={openCloseCreditForm}
              editFormClose={editFormClose}
              dealersClickRow={dealersClickRow}
              onClickAddMenu={onClickAddMenu}
              currentUser={currentUser}
              showDealerEditForm={showDealerEditForm} />
          </Box>
        </Box>)}  
      {!(applicantsData?.filter(item => item.category === 'DEALER' || item.category === 'COAPPLICANT' || item.category === 'GUARANTOR').length) && (
        <Box
          mt="md"
          p="xl"
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 10,
            height: '60vh',
          }}
        >
          <Image
            src="https://i.imgur.com/A6KRQAV.png"
            w={150}
            h={100}
            radius="md"
          />
          <Box>
            <Text>No data yet!</Text>
            <Text size="sm" sx={{ color: 'rgb(0,0,0,0.4)' }}>
              No data found in this section
            </Text>
          </Box>
        </Box>)}
      <RightSideDrawer
        size="lg"
        opened={showDealerEditForm}
        onClose={() => setShowDealerEditForm(false)}
        title={modelType === 'DEALER' ? 'Dealer Edit Form' : modelType === 'GUARANTOR' ? 'Guarantor Edit Form' : 'CoApplicant Edit Form'}
      >
        <DealerEditSideWrapper
          id={id}
          dealersList={activeApplicant}
          isAdd={formType}
          modelType={modelType}
          dealershipId={id}
          data={rowData}
          currentUser={currentUser}
          onClose={() => editFormClose(modelType)}
        />
      </RightSideDrawer>
    </>
  )
}

export default DealersList;