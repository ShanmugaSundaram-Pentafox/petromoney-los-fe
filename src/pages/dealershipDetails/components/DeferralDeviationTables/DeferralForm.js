import { Flex, Grid, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button } from '../../../../components/Mantine/Button/Button';
import { useQuery, } from 'react-query';
import { addDeferralDeviation, getAllDeferralApplicantsByDealershipId, getDocumentChecklistMaster } from '../../../../services/deferralDeviation.service';
import moment from 'moment';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';


const DeferralForm = ({ dealershipId, dealershipName, close, refetch }) => {
  const [loading, setLoading] = useState(false)
  const [validDate, setValidDate] = useState(new Date())
  const [applicantData, setApplicantData] = useState()
  const [checkListData, setCheckListData] = useState()
  const { data: applicantsData } = useQuery(['dealership-applicants-list', dealershipId], () => getAllDeferralApplicantsByDealershipId(dealershipId), {
    initialData: [],
    refetchOnWindowFocus: false
  })
  const { data: checklist } = useQuery(['dealership-checklist-list'], () => getDocumentChecklistMaster(), {
    initialData: [],
    refetchOnWindowFocus: false
  })

  const handleClose = () => {
    close();
  };

  const { errors, handleSubmit, isValid } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    // validationSchema: Yup.object().shape({
    //   applicant_id: Yup.string().nullable('Choose Proper User Role').required('Choose Proper User Role'),
    //   due_date: Yup.string().nullable('Enter first name').matches(/^[A-Za-z_ ]+$/, 'Enter valid name').required('Enter first name'),
    //   last_name: Yup.string().nullable('Enter last name').min(1).matches(/^[A-Za-z_ ]+$/, 'Enter valid name').required('Enter last name'),
    //   mobile: Yup.string().nullable('Enter mobile number').matches(/^\d{10}$/, 'Enter valid mobile number').required('Enter mobile number'),
    //   email: Yup.string().nullable('Enter email').email('Enter valid email').required('Enter email'),
    //   password: Yup.string(),
    // }),
    onSubmit: values => {
      setLoading(true);
      let payload = { ...values, type: 'deferral', party_name: dealershipName, remarks: 'testing with remarks', due_date: moment(validDate)?.format('YYYY-MM-DD'), party_id: dealershipId, applicant_id: applicantData?.value, applicant_type: applicantData?.category, applicant_name: applicantData?.label, checklist_id: checkListData?.value, checklist_name: checkListData?.label }
      addDeferralDeviation(payload)
        .then((res) => {
          handleClose();
          refetch();
          displayNotification({
            message: res,
            variant: 'success',
          });

        })
        .catch((err) => {
          displayNotification({
            message: err,
            variant: 'error',
          });
        })
        .finally(() => {
          setLoading(false);
        })
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Grid gutter="sm">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select data={applicantsData} size='xs' label={"Applicant"} value={applicantData?.value || null} onChange={(_value, option) => setApplicantData(option)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select data={checklist} size='xs' label={"Document Type"} value={checkListData?.value || null} onChange={(_value, option) => setCheckListData(option)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DateInput value={validDate} onChange={setValidDate} minDate={new Date()} size='xs' label={'Dealership agreement valid till'} />
        </Grid.Col>
      </Grid>
      <Flex
        gap="md"
        mt={48}
        justify="flex-end"
        align="flex-end"
        direction="row">
        <Button
          // colorScheme="primary"
          size="xs"
          variant='outline'
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          // colorScheme="primary"
          color='green'
          size="xs"
          onClick={loading ? () => null : handleSubmit}
          loading={loading}
        >
          Add Deferral
        </Button>
      </Flex>
    </form>
  )
}

export default DeferralForm;