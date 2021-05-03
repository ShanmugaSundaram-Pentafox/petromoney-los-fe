import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import TextInput from '../../../components/TextInput/TextInput';
import FileUpload from '../../../components/FileUpload';
import { updateVehicleServiceDetails } from '../../../services/transports.service';

const inputProps = {
  direction: "column",
  alignTop: true,
}

const TrackerUpdateModal = ({ statusId, onClose, data, serviceData, completed }) => {
  const [status, setStatus] = useState(statusId);
  
  useEffect(() => {
    setStatus(statusId);
  }, [statusId]);

  if(!status) {
    return null;
  }

  const onCloseModal = (fetchStatus=false, d={}) => {
    setStatus(false);
    onClose(fetchStatus, d);
  }

  const postServiceStatus = (payload) => {

    updateVehicleServiceDetails(serviceData.vehicle_id, serviceData.credit_head_id, serviceData.loan_id, payload)
      .then(res => {
        console.log('postServiceStatus >> ', res);
        onCloseModal(true, serviceData);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const Actions = ({ btnText='OK', id }) => {
    return (
      <Box textAlign="right">
        <Button size="small" onClick={() => onCloseModal()}>Cancel</Button>
        <Button color="primary" size="small" onClick={() => {
          postServiceStatus({ status_id: id, details: { status: true } })
        }}>{btnText}</Button>
      </Box>
    )
  }

  if(status === 1) {
    return (
      <FormDialog
        open={status}
        title={'Consent Letter'}
        onClose={() => onCloseModal()}
        actions={!completed && <Actions id={status} data={data} />}
        >
          {
            completed ? (
              <p>Request raised for Consent letter.</p>
            ) : 
            <p>Raise request for consent letter</p>
          }

      </FormDialog>
    )
  }

  if(status === 2) {
    const d = JSON.parse(serviceData?.tracking_details?.[1]?.details || "{}");

    const _vSchema = Yup.object().shape({
      amount: Yup.number().required('Enter Amount'),
      date: Yup.string().required('Enter valid Date'),
      utr: Yup.string().required('Enter UTR'),
    });
    return (
      <FormDialog
        open={status}
        title={'Deposit Fee'}
        onClose={() => onCloseModal()}
        >
        <Formik validationSchema={_vSchema} initialValues={d} onSubmit={v => {
          postServiceStatus({ 
            status_id: status,
            details: v
          });
        }}>
          {
            ({ handleChange, handleSubmit, values, errors }) => (
              <Grid container spacing={1}>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    money
                    type="number"
                    name="amount"
                    labelText="Amount"
                    value={values?.amount}
                    error={errors?.amount}
                    helperText={errors?.amount}
                    disabled={completed}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextInput
                    {...inputProps}
                    name="date"
                    labelText="Date"
                    value={values?.date}
                    error={errors?.date}
                    helperText={errors?.date}
                    disabled={completed}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextInput
                    {...inputProps}
                    name="utr"
                    labelText="UTR"
                    value={values?.utr}
                    error={errors?.utr}
                    helperText={errors?.utr}
                    disabled={completed}
                    onChange={handleChange}
                  />
                </Grid>
                {
                  completed ? null : (
                    <Grid item xs={4} justify="flex-end" alignItems="flex-end">
                      <Button
                        fullWidth
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Grid>
                  )
                }
              </Grid>
            )
          }
        </Formik>
      </FormDialog>
    )
  }

  if(status === 3) {
    return (
      <FormDialog
        open={status}
        title={'Request Paytm'}
        onClose={() => onCloseModal()}
        actions={!completed && <Actions id={status} />}
        >
          {
            completed ? (
              <p>Already escalated this request to Paytm</p>
            ) : 
              <p>Escalate this request to Paytm</p>
          }
      </FormDialog>
    )
  }

  if(status === 4) {
    const d = JSON.parse(serviceData?.tracking_details?.[3]?.details || "{}");
    const _vSchema = Yup.object().shape({
      tag_number: Yup.string().required('Enter tag number'),
    });

    return (
      <FormDialog
        open={status}
        title={'FASTag Issued'}
        onClose={() => onCloseModal()}
        >
        <Typography>Enter tag number if new FASTag is issued,</Typography>
        <Formik validationSchema={_vSchema} initialValues={d} onSubmit={v => {
          postServiceStatus({
            status_id: status,
            details: v
          })
        }}>
          {
            ({ handleChange, handleSubmit, values, errors }) => (
              <Grid container spacing={1}>
                <Grid item md={12}>
                  <TextInput
                    {...inputProps}
                    name="tag_number"
                    // labelText="Tag Number"
                    value={values?.tag_number}
                    error={errors?.tag_number}
                    helperText={errors?.tag_number}
                    disabled={completed}
                    onChange={handleChange}
                  />
                </Grid>
                {
                  completed ? null : (
                    <Grid item md={4}>
                      <Button
                        fullWidth
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Grid>
                  )
                }
              </Grid>
            )
          }
        </Formik>
      </FormDialog>
    )
  }

  if(status === 5) {
    return (
      <FormDialog
        open={status}
        title={'FASTag Affixed'}
        onClose={() => onCloseModal()}
        >
        <div style={{ minWidth: '40vw' }}>
          <Typography>Upload photo of the FASTag affixed</Typography>
          <Formik initialValues={{}} onSubmit={v => {
            const formData = new FormData();
            formData.append(`status_id`, status);
            v.map((file, i) => {
              const fileName = file.name.replace(/[()%.,+\-&]/g, '').toLowerCase().replace(/\s/g, '_');
              formData.append(`file-${i}`, file);
              formData.append(`fileName`, fileName);
            });
            postServiceStatus(formData);
          }}>
            {
              ({ setFieldValue, handleSubmit }) => (
                <>
                  <FileUpload inline handleSave={v => { setFieldValue('files', v); }}  />
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </>
              )
            }
          </Formik>
        </div>
      </FormDialog>
    )
  }

}

export default TrackerUpdateModal;