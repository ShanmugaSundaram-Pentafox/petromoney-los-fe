import { Flex, Grid } from '@mantine/core';


import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button } from '../../../../components/Mantine/Button/Button';
import { Selector } from '../../../../components/CommonComponents/FilterCard';
import { useQuery } from 'react-query';
import { addDeferralDeviation, getAllDeferralApplicantsByDealershipId, getDocumentChecklistMaster } from '../../../../services/deferralDeviation.service';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';

const DeviationForm = ({ dealershipId, dealershipName, refetch, close, }) => {
  const [loading, setLoading] = useState(false);
  const [applicantData, setApplicantData] = useState()
  const [checkListData, setCheckListData] = useState()
  const { data: applicantsData, } = useQuery(['dealership-applicants', dealershipId], () => getAllDeferralApplicantsByDealershipId(dealershipId), {
    initialData: [],
    refetchOnWindowFocus: false
  })
  const { data: checklist } = useQuery(['dealership-checklist'], () => getDocumentChecklistMaster(), {
    initialData: [],
    refetchOnWindowFocus: false
  })

  const handleClose = () => {
    close();
  };

  const { handleSubmit, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      setLoading(true);
      let payload = { ...values, type: 'deviation', party_name: dealershipName, remarks: 'remakrs', party_id: dealershipId, applicant_id: applicantData.value, applicant_type: applicantData.category, applicant_name: applicantData?.label, checklist_id: checkListData?.value, checklist_name: checkListData.label }
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
          <Selector title="Applicant" width={300} isMulti={false} options={applicantsData} value={applicantData} setValue={setApplicantData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Selector title="Document Type" width={300} isMulti={false} options={checklist} value={checkListData} setValue={setCheckListData} />
        </Grid.Col>
        {/* <Grid.Col span={{ base: 12, sm: 6 }}>
          <label>Dealership agreement valid till</label>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              hideTabs={true}
              variant='inline'
              inputVariant='outlined'
              format='dd-MM-yyyy'
              maxDate={new Date('2050-01-01')}
              readOnly={readOnly}
              disabled={readOnly || editable}
              error={errors.due_date}
              helperText={errors.due_date}
              animateYearScrolling={true}
              // invalidDateMessage='Invalid Date Format'
              margin='normal'
              id='date-picker'
              autoOk={true}
              value={validDate}
              onChange={handleValidDateChange}
              keyboardButtonProps={{
                'aria-label': 'change date'
              }}
              PopoverProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center',
                }
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid.Col> */}
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
          Add Deviation
        </Button>
      </Flex>
    </form>
  )
}

export default DeviationForm;