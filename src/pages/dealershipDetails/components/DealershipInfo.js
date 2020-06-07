import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextInput from '../../../components/TextInput/TextInput';
import { useFormik } from 'formik';
// import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  gridItemStyle: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  actionFooter: {
    justifyContent: 'flex-end'
  }
}));

/*
{
  "address": "HPC DEALER T.C.ROAD IRRITY 670703",
  "address_2": "None",
  "auto": "No",
  "business_property": "2",
  "business_type": "1",
  "created_date": "Sat, 28 Dec 2019 14:40:10 GMT",
  "deal_status": "",
  "district": "KL-KANNUR",
  "doi": "02-Dec-2010",
  "gst": "33FGSPM5019G2Z5",
  "id": 12830330,
  "is_microatm": "",
  "latitude": 0.0,
  "location": "IRRITY                   ",
  "longtitude": 0.0,
  "modified_date": "0000-00-00 00:00:00",
  "name": "MS HSD CANNANORE PETROLEUM PRODUCTS     ",
  "nhsh": "SH30",
  "pan": "FGSPM6019G",
  "pincode": "None",
  "region": "KOZHICODE (CALICUT) Retail RO",
  "sales_area": "Kannur Retail S.A.",
  "state": "Kerala",
  "urh": "Highway",
  "zone": "South"
}
*/

const DealershipInfo = ({ data, className }) => {
  const [readOnly, setReadOnly] = useState(true);
  const {values, handleChange: onChange} = useFormik({
    initialValues: data,
    onSubmit: values => {
      console.log('Form Values >> ', values);
    }
  });
  // const [values, setValues] = useState(data);
  const classes = useStyles();
  const gridProps = {
    item: true,
    xs: 12,
    className: classes.gridItemStyle
  }

  // const handleChange = event => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value
  //   });
  // };

  const fieldProps = {
    readOnly,
    onChange
  }

  return (
    <Card className={clsx(classes.root, className)}>
      <form
        autoComplete="off"
        noValidate
      >
        {/* <CardHeader title={`${values.id} - ${values.name}`} /> */}
        {/* <Divider /> */}
        <CardContent>
          <Grid container>
            <Grid {...gridProps}>
              <TextInput
                labelText="Name"
                name="name"
                defaultValue={values.name}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                multiline
                labelText="Address"
                name="address"
                defaultValue={values.address}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                labelText="Pincode"
                name="pincode"
                defaultValue={values.pincode}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput
                labelText="PAN"
                name="pan"
                defaultValue={values.pan}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps}>
              <TextInput 
                labelText="GST"
                name="gst"
                defaultValue={values.gst}
                {...fieldProps}
                />
            </Grid>
            <Divider />
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="Latitude"
                name="latitude"
                labelWidth={40}
                defaultValue={values.latitude}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="Longtitude"
                name="longtitude"
                labelWidth={40}
                defaultValue={values.longtitude}
                {...fieldProps}
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="District"
                labelWidth={40}
                defaultValue={values.district}
                readOnly
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="State"
                labelWidth={40}
                defaultValue={values.state}
                readOnly
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="Sales Area"
                labelWidth={40}
                defaultValue={values.sales_area}
                readOnly
                />
            </Grid>
            <Grid {...gridProps} xs={6}>
              <TextInput 
                labelText="Zone"
                labelWidth={40}
                defaultValue={values.zone}
                readOnly
                />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className={classes.actionFooter}>
          {!readOnly ? (
            <>
              <Button variant="contained" size="small">Cancel</Button>
              <Button variant="contained" size="small">Save</Button>
            </>
            ) : (
              <Button color="primary" variant="outlined" size="small" onClick={() => { setReadOnly(false); }}>Edit Details</Button>
            )}
        </CardActions>
      </form>
    </Card>
  );
};

export default DealershipInfo;
