import { ActionIcon, Grid, Group, Select, Text, Tooltip } from '@mantine/core';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button } from '../../../../components/Mantine/Button/Button';
import { useQuery } from 'react-query';
import { addDeferralDeviation, getAllDeferralApplicantsByDealershipId, getDocumentChecklistMaster } from '../../../../services/deferralDeviation.service';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';
import RichTextEditorBox from '../../../../components/RichTexEditor/RichTextEditorBox';
import FileUpload from '../../../../components/FileUpload';
import { IconUpload } from '@tabler/icons-react';

const DeviationForm = ({ dealershipId, dealershipName, refetch, close, }) => {
  const [loading, setLoading] = useState(false);
  const [fileUploadObj, setFileUploadObj] = useState({});
  const [error, setError] = useState();

  const { data: applicantsData, } = useQuery(['dealership-applicants-list', dealershipId], () => getAllDeferralApplicantsByDealershipId(dealershipId), {
    initialData: [],
    refetchOnWindowFocus: false,
    select: (data) => {
      return [...data, { label: dealershipName, value: dealershipId?.toString() }]
    }
  })

  const { data: checklist } = useQuery(['dealership-checklist-list'], () => getDocumentChecklistMaster(), {
    initialData: [],
    refetchOnWindowFocus: false
  })

  const handleClose = () => {
    close();
  };

  const { handleSubmit, setFieldValue, values } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      if (values?.remarks) {
        setLoading(true);
        let payload = {
          ...values,
          type: 'deviation',
          party_name: dealershipName,
          party_id: dealershipId,
          applicant_id: values?.applicantData?.value == dealershipId ? null : values?.applicantData?.value,
          applicant_type: values?.applicantData?.value == dealershipId ? null : values?.applicantData?.category,
          applicant_name: values?.applicantData?.value == dealershipId ? null : values?.applicantData?.label,
          checklist_id: values?.checkListData?.value,
          checklist_name: values?.checkListData?.label
        }
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
      } else {
        setError('Remarks is mandatory');
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Grid gutter="sm">
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Select size='xs' searchable label="Applicant" data={applicantsData || [{ label: dealershipName, value: dealershipId?.toString() }]} defaultValue={dealershipId?.toString()} value={values?.applicantData?.value} onChange={(_value, option) => setFieldValue('applicantData', option)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select size='xs' searchable label="Document Type" data={checklist} value={values?.checkListData?.value} onChange={(_value, option) => setFieldValue('checkListData', option)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 1 }} mt={20}>
          <Tooltip label={'Click to upload the file'} withArrow color='gray' onClick={() => setFileUploadObj({ modal: true })}>
            <ActionIcon variant='subtle'><IconUpload /></ActionIcon>
          </Tooltip>
        </Grid.Col>
        <Grid.Col>
          <RichTextEditorBox onChange={e => { setFieldValue('remarks', e); setError(); }} />
          {error ? <Text size='xs' c={'red'}>{error}</Text> : null}
        </Grid.Col>
      </Grid>
      <Group justify='flex-end' mt={'md'}>
        <Button
          size="xs"
          variant='outline'
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          color='green'
          size="xs"
          onClick={loading ? () => null : handleSubmit}
          loading={loading}
        >
          Add Deviation
        </Button>
      </Group>
      <FileUpload open={Boolean(fileUploadObj?.modal)} onCloseUploader={() => setFileUploadObj({})} />
    </form>
  )
}

export default DeviationForm;