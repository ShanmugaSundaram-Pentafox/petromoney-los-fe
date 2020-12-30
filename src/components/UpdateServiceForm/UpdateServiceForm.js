import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from "@material-ui/lab/Alert"
import Typography from '@material-ui/core/Typography';
import TextInput from '../TextInput/TextInput';
import Button from '../CommonComponents/Button/Button';
import { useMount } from 'react-use';
import FileUpload from '../FileUpload';
import styled from 'styled-components';

const OrderedList = styled.ol`
  li {
    margin-bottom: 24px;
    padding: 10px;
    &:nth-child(even) {
      background-color: rgba(50,50,50, 0.05);
      border-radius: 4px;
    }
  }
`;

const UpdateServiceForm = ({ data, callback }) => {
  const [apiStatus, setApiStatus] = useState({});
  const [depositFee, setDepositFee] = useState({});
  const [ftIssued, setFtIssued] = useState({});
  const [concentLetterStatus, setConcentLetterStatus] = useState(false);

  const inputProps = {
    direction: "column",
    alignTop: true,
  }

  return (
    <Box p={3} pt={0}>
      <OrderedList>
        <li>
          <Typography variant="h5">Consent letter</Typography>
          <Box mt={2}>
            {/* <Typography>Consent letter to raise the service request</Typography> */}
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => setConcentLetterStatus(true)}
            >
              Raise service request
            </Button>
          </Box>
        </li>
        <li>
          <Typography variant="h5">Deposit Fee</Typography>
          <Box mt={2}>
            <Grid container spacing={1}>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  money
                  type="number"
                  name="amount"
                  labelText="Amount"
                  value={depositFee.values?.amount}
                  error={depositFee.errors?.amount}
                  helperText={depositFee.errors?.amount}
                />
              </Grid>
              <Grid item md={6}>
                <TextInput
                  {...inputProps}
                  name="date"
                  labelText="Date"
                  value={depositFee.values?.date}
                  error={depositFee.errors?.date}
                  helperText={depositFee.errors?.date}
                />
              </Grid>
              <Grid item md={12}>
                <TextInput
                  {...inputProps}
                  name="utr"
                  labelText="UTR"
                  value={depositFee.values?.utr}
                  error={depositFee.errors?.utr}
                  helperText={depositFee.errors?.utr}
                />
              </Grid>
              <Grid item xs={4} justify="flex-end" alignItems="flex-end">
                <Button
                  fullWidth
                  size="small"
                  color="primary"
                  variant="contained"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </li>
        <li>
          <Typography variant="h5">Request Paytm</Typography>
          <Box mt={2}>
            {/* <Typography>Escalate the request to Paytm</Typography> */}
            <Button
              size="small"
              color="primary"
              variant="contained"
            >
              Escalate request to Paytm
            </Button>
          </Box>
        </li>
        <li>
          <Typography variant="h5">FastTAG Issued</Typography>
          <Box mt={2}>
            <Typography>Enter tag number if new fastTag is issued,</Typography>
            <Grid container spacing={1}>
              <Grid item md={12}>
                <TextInput
                  {...inputProps}
                  name="tar_number"
                  value={ftIssued.values?.tar_number}
                  error={ftIssued.errors?.tar_number}
                  helperText={ftIssued.errors?.tar_number}
                />
              </Grid>
              <Grid item md={4}>
                <Button
                  fullWidth
                  size="small"
                  color="primary"
                  variant="contained"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </li>
        <li>
          <Typography variant="h5">FastTAG Affixed</Typography>
          <Box mt={2}>
            <Typography>Upload photo of the FastTag affixed</Typography>
            <FileUpload inline handleSave={() => null}  />
          </Box>
        </li>
      </OrderedList>
      {apiStatus.type && (
        <Alert severity={apiStatus.type}>{apiStatus.message}</Alert>
      )}
    </Box>
  )
}

export default UpdateServiceForm;