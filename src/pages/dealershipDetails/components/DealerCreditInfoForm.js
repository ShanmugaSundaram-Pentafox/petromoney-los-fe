import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { useFormik } from 'formik';

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
          name="cibil"
          type="number"
          defaultValue={values.cibil}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="Total no.of loans"
          name="loans"
          defaultValue={values.loans}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="No of closed loans"
          name="loans_closed"
          defaultValue={values.loans_closed}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="No of overdue accounts"
          name="overdue_acc"
          defaultValue={values.overdue_acc}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          label="Overdue Amount"
          name="overdue_amount"
          defaultValue={values.overdue_amount}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          label="Current O/S amount"
          name="os_amount"
          defaultValue={values.os_amount}
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
          name="enquiries"
          defaultValue={values.enquiries}
          onChange={onChange}
          />
      </Grid>
      <Grid {...gridItem}>
        <Grid item md={6}>
          <TextInput
            select
            label="Loans in Bureau Report"
            name="loans_bureau"
            value={values.loans_bureau}
            onChange={onChange}
            SelectProps={{
              native: true,
            }}
            >
              <option value="NA">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
          </TextInput>
        </Grid>
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          select
          label="No of times of highest DPD"
          name="highest_dpd_count"
          value={values.highest_dpd_count}
          onChange={onChange}
          SelectProps={{
            native: true,
          }}
          >
          <option value="NA">NA</option>
          <option value="1">1 time</option>
          <option value="2">2 times</option>
          <option value="3">3 times</option>
          <option value=">3">>3 times</option>
        </TextInput>
      </Grid>
      <Grid {...gridItem} md={6}>
        <TextInput
          select
          label="Highest DPD bracket"
          name="highest_dpd"
          value={values.highest_dpd}
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
            name="credit_card"
            value={values.credit_card}
            onChange={onChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="NA">Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </TextInput>
        </Grid>
      </Grid>
      <Grid {...gridItem}>
        <TextInput
          select
          label="Status - For Loans & Credit Cards"
          name="status_loans"
          defaultValue={values.status_loans}
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
