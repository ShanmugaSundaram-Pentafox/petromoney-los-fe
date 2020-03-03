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
import TextField from '@material-ui/core/TextField';
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
  const [values, setValues] = useState(data);
  const classes = useStyles();
  const gridProps = {
    item: true,
    xs: 12,
    className: classes.gridItemStyle
  }

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

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
              <TextField fullWidth disabled label="Name" defaultValue={values.name} onChange={handleChange} />
            </Grid>
            <Grid {...gridProps}>
              <TextField
                fullWidth
                disabled
                label="Address"
                defaultValue={values.address}
                onChange={handleChange}
                multiline
                />
            </Grid>
            {
              values.pincode && (
                <Grid item xs={12}>
                  <TextField fullWidth disabled label="Pincode" defaultValue={values.pincode} onChange={handleChange} />
                </Grid>
              )
            }
            {
              values.pan && (
                <Grid {...gridProps}>
                  <TextField fullWidth disabled label="PAN" defaultValue={values.pan} onChange={handleChange} />
                </Grid>
              )
            }
            {
              values.gst && (
                <Grid {...gridProps}>
                  <TextField fullWidth disabled label="GST" defaultValue={values.gst} onChange={handleChange} />
                </Grid>
              )
            }
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className={classes.actionFooter}>
          <Button color="primary" variant="outlined" size="small">Edit Details</Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default DealershipInfo;
