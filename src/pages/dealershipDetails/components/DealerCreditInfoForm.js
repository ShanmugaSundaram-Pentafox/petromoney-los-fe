import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextInput from '../../../components/TextInput/TextInput';

const useStyles = makeStyles({
  row: {
    paddingRight: 12,
    paddingBottom: 14
  }
});

const DealerCreditInfoForm = ({ data, values, errors, onChange }) => {
  
  const classes = useStyles();
  const gridItem = {
    md: 12,
    item: true,
    className: classes.row
  };
  
  return (
    <Grid container>
      <Grid {...gridItem}>
        <TextInput
          label="CIBIL Score"
          name="cibil_score"
          type="number"
          defaultValue={values.cibil_score}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="Total no.of loans"
          name="loans_count"
          defaultValue={values.loans_count}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="No of closed loans"
          name="closed_loans_count"
          defaultValue={values.closed_loans_count}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="No of overdue accounts"
          name="od_accounts_count"
          defaultValue={values.od_accounts_count}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="Overdue Amount"
          name="od_amount"
          defaultValue={values.od_amount}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          label="Current O/S amount"
          name="current_os_amount"
          defaultValue={values.current_os_amount}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          label="Vintage with CIBIL bureau"
          name="cibil_vintage"
          defaultValue={values.cibil_vintage}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          label="No of enquiries last 6 months"
          name="no_of_enquiries"
          defaultValue={values.no_of_enquiries}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <Grid item md={6}>
          <TextInput
            select
            label="Loans in Bureau Report"
            name="is_loan_in_bureau"
            value={values.is_loan_in_bureau}
            onChange={onChange}
            SelectProps={{
              native: true,
            }}
            >
              <option value="NA">Select</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
          </TextInput>
        </Grid>
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          select
          label="No of times of highest DPD"
          name="highest_dpd"
          value={values.highest_dpd}
          onChange={onChange}
          SelectProps={{
            native: true,
          }}
          >
          <option value="NA">NA</option>
          <option value="1">1 time</option>
          <option value="2">2 times</option>
          <option value="3">3 times</option>
          <option value=">3">&gt;3 times</option>
        </TextInput>
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          select
          label="Highest DPD bracket"
          name="highest_dpd_bracket"
          value={values.highest_dpd_bracket}
          onChange={onChange}
          SelectProps={{
            native: true,
          }}
          >
          <option value="0">0</option>
          <option value="01-29">01 - 29</option>
          <option value="30-59">30 - 59</option>
          <option value="60-89">60 - 89</option>
          <option value="STD">STD</option>
          <option value="SUB">SUB</option>
          <option value="SMA">SMA</option>
          <option value="90+">90+</option>
        </TextInput>
      </Grid>
      <Grid {...gridItem}>
        <Grid item md={6}>
          <TextInput
            select
            label="Credit Card in Bureau Report"
            name="is_cc_in_cibil"
            value={values.is_cc_in_cibil}
            onChange={onChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="NA">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </TextInput>
        </Grid>
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          select
          label="Status - For Loans & Credit Cards"
          name="status"
          defaultValue={values.status}
          onChange={onChange}
          SelectProps={{
            native: true,
          }}
        >
          <option value="NA">Select</option>
          <option value="Clean Track">Clean Track</option>
          <option value="Written-off">Written-off</option>
          <option value="Suit Filed">Suit Filed</option>
          <option value="Wilful Default Post [WO] Settled">Wilful Default Post [WO] Settled</option>
          <option value="Settled">Settled</option>
          <option value="Restructured loan">Restructured loan</option>
        </TextInput>
      </Grid>
    </Grid>
  )
}

export default DealerCreditInfoForm;
