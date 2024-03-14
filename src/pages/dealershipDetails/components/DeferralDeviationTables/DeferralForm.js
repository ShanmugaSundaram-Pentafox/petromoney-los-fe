import DateFnsUtils from '@date-io/date-fns';
import { Flex, Grid } from '@mantine/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Button } from '../../../../components/Mantine/Button/Button';
import { Selector } from '../../../../components/CommonComponents/FilterCard';
import { useQuery,useQueryClient  } from 'react-query';
import { addDeferralDeviation, getAllDeferralApplicantsByDealershipId, getDocumentChecklistMaster } from '../../../../services/deferralDeviation.service';
import moment from 'moment';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';


const DeferralForm = ({ dealershipId, dealershipName, close, callback, editable }) => {
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const [validDate, setValidDate] = useState(new Date())
  const [applicantData, setApplicantData] = useState()
  const [checkListData, setCheckListData] = useState()
  const { data: applicantsData, refetch } = useQuery(['dealership-applicants', dealershipId], () => getAllDeferralApplicantsByDealershipId(dealershipId), {
    initialData: [],
    refetchOnWindowFocus: false
  })
  const { data: checklist } = useQuery(['dealership-checklist'], () => getDocumentChecklistMaster(), {
    initialData: [],
    refetchOnWindowFocus: false
  })

  const handleEdit = () => {
    setReadOnly(!readOnly)
  };
  const handleClose = () => {
    close();
  };

  const handleValidDateChange = (date) => {
    setValidDate(date)
  }
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, handleChange, handleSubmit, isSubmitting, setSubmitting, setValues } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      let payload = { ...values, type: 'deferral', party_name: dealershipName, remarks: 'testing with remarks', due_date: moment(validDate).format('YYYY-MM-DD'), party_id: dealershipId, applicant_id: applicantData.value, applicant_type: applicantData.category, applicant_name: applicantData?.label, checklist_id: checkListData?.value, checklist_name: checkListData.label }
      addDeferralDeviation(payload)
        .then((res) => {
          queryClient.invalidateQueries(['get-deferral','get-deferral-stats','data-status-list']);
          handleClose();
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
    }
  });

  const inputProps = {
    direction: 'column',
    alignTop: true,
    onChange: handleChange,
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid gutter="sm">
        {/* <Grid.Col span={{ base: 12, sm: 6 }}>
					<TextInput
						{...inputProps}
						label="Mode Call/Mail"
						name="communication_mode"
						disabled={readOnly || editable}
						readOnly={readOnly}
						value={values.communication_mode}
						error={errors.communication_mode}
					/>
				</Grid.Col> */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Selector title="Applicant" width={300} isMulti={false} options={applicantsData} value={applicantData} setValue={setApplicantData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Selector title="Document Type" width={300} isMulti={false} options={checklist} value={checkListData} setValue={setCheckListData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
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
          size="md"
          variant='transparent'
          onClick={handleClose}
          loading={loading}
        >
          Cancel
        </Button>
        <Button
          // colorScheme="primary"
          color='green'
          size="md"
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