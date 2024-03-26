import { ActionIcon, Grid, Group, Select, Text, Tooltip } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button } from '../../../../components/Mantine/Button/Button';
import { useQuery, } from 'react-query';
import { addDeferralDeviation, getAllDeferralApplicantsByDealershipId, getDocumentChecklistMaster } from '../../../../services/deferralDeviation.service';
import moment from 'moment';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';
import RichTextEditorBox from '../../../../components/RichTexEditor/RichTextEditorBox';
import { IconUpload } from '@tabler/icons-react';
import FileUpload from '../../../../components/FileUpload';
import { URL } from '../../../../config/serverUrls';


const DeferralForm = ({ dealershipId, dealershipName, close, refetch, currentUser }) => {
  const [loading, setLoading] = useState(false)
  const [fileUploadObj, setFileUploadObj] = useState({});

  const { data: applicantsData } = useQuery(['dealership-applicants-list', dealershipId], () => getAllDeferralApplicantsByDealershipId(dealershipId), {
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

  const handleSave = (files) => {
    const formData = new FormData();
    const docID = 35;
    files.map(file => {
      const fileName = file.name.replace(/[()%.,+\-&]/g, '').toLowerCase().replace(/\s/g, '_');
      formData.append(`file-${dealershipId}`, file);
      formData.append('fileName', fileName);
      formData.append('id', docID);
    });
    fetch(`${URL.base}${URL.checklist}/${dealershipId}/doc/${docID}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        setFileUploadObj({ modal: false, files: data.data.url })
        displayNotification({
          message: 'File Upload Success',
          variant: 'success',
        });
        refetch();
      })
      .catch(error => {
        displayNotification({
          message: 'File Upload error',
          variant: 'error',
        });

      })
  };

  const { handleSubmit, setFieldError, errors, values, setFieldValue } = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => {
      if (values?.remarks) {
        setLoading(true);
        let payload = {
          ...values,
          type: 'deferral',
          party_name: dealershipName,
          remarks: values?.remarks,
          due_date: moment(values?.validDate)?.format('YYYY-MM-DD'),
          party_id: dealershipId,
          applicant_id: values?.applicantData?.value === dealershipId ? null : values?.applicantData?.value,
          applicant_type: values?.applicantData?.value === dealershipId ? null : values?.applicantData?.category,
          applicant_name: values?.applicantData?.value === dealershipId ? null : values?.applicantData?.label,
          checklist_id: values?.checkListData?.value,
          checklist_name: values?.checkListData?.label,
          document_urls: fileUploadObj?.files,
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
        setFieldError('remarks', 'Please enter remarks');
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Grid gutter="sm">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select searchable data={applicantsData || [{ label: dealershipName, value: dealershipId?.toString() }]} defaultValue={dealershipId?.toString()} size='xs' label={'Applicant'} value={values?.applicantData?.value} onChange={(_value, option) => setFieldValue('applicantData', option)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select searchable data={checklist} size='xs' label={'Document Type'} value={values?.checkListData?.value || null} onChange={(_value, option) => setFieldValue('checkListData', option)} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <DateInput value={values?.validDate} onChange={(e) => setFieldError('validDate', e)} minDate={new Date()} size='xs' label={'Submission date'} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }} mt={20}>
          <Tooltip label={'Click to upload the file'} withArrow color='gray' onClick={() => setFileUploadObj({ modal: true, files: [] })}>
            <ActionIcon variant='subtle'><IconUpload /></ActionIcon>
          </Tooltip>
        </Grid.Col>
        <Grid.Col span={12}>
          <label>Remarks</label>
          <RichTextEditorBox onChange={(e) => { setFieldValue('remarks', e); errors?.remarks && setFieldError('remarks', null); }} />
          <Text size='xs' c={'red'}>{errors?.remarks}</Text>
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
          Add Deferral
        </Button>
      </Group>
      <FileUpload open={Boolean(fileUploadObj?.modal)} onCloseUploader={() => setFileUploadObj({ ...fileUploadObj, modal: false })} handleSave={handleSave} />
    </form>
  )
}

export default DeferralForm;