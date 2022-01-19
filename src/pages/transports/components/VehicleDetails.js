import { Grid, makeStyles } from '@material-ui/core';
import React from 'react'
import { ViewData } from '../../../components/CommonComponents/FilePreview';
const useStyles = makeStyles((theme) => ({
  items: {
    '&.MuiGrid-item': {
      paddingTop: 0,
      paddingBottom: 2
    }
  }
}))

export const VehicleDetails = ({vehicleDetails}) => {
  const classes = useStyles();
  return(
    <Grid container spacing={2} style={{marginTop: 15}}>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Vehicle Description" value={vehicleDetails?.vehicleClassDescription} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Registration Date" value={vehicleDetails?.registrationDate} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Vehicle Category" value={vehicleDetails?.vehicleCatgory} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Registration No" value={vehicleDetails?.registrationNumber} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Engine No" value={vehicleDetails?.engineNumber} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Chassis No" value={vehicleDetails?.chassisNumber} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="No.of Cylinders" value={vehicleDetails?.numberOfCylinders} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Maker Description" value={vehicleDetails?.makerDescription} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Fuel Type" value={vehicleDetails?.fuelDescription} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Model" value={vehicleDetails?.makerModel} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Capacity" value={vehicleDetails?.cubicCapacity} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Color" value={vehicleDetails?.color} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Owner Name" value={vehicleDetails?.ownerName} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Insurance Upto" value={vehicleDetails?.insuranceUpto} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Insurance Policy No" value={vehicleDetails?.insurancePolicyNumber} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Fitness Upto" value={vehicleDetails?.fitnessUpto} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Manufactured Month Year" value={vehicleDetails?.manufacturedMonthYear} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Insurance Company" value={vehicleDetails?.insuranceCompany} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="PUC No" value={vehicleDetails?.pucNumber} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="PUC Exp Date" value={vehicleDetails?.pucExpiryDate} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Blacklist Status" value={vehicleDetails?.blackListStatus} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Rc Status" value={vehicleDetails?.rcStatus} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Rc Mob No" value={vehicleDetails?.rcMobileNo} style={{marginBottom: 0}} />
      </Grid>
      <Grid item md={6} className={classes.items}>
        <ViewData title="Blacklist Info" value={vehicleDetails?.blackListInfo} style={{marginBottom: 0}} />
      </Grid>
    </Grid>
  )
}