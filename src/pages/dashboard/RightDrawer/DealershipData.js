import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { ViewData } from '../../../components/CommonComponents/FilePreview';

const useStyles = makeStyles(({
  root: {
    // backgroundColor: '#E7E7E7',
  }

}))

const DealershipData = ({ data }) => {
  const classes = useStyles();

  const gridProps = {
    item: true,
    xs: 12,
    md: 6,
    className: classes.gridItemStyle
  }

  return (
    <div className={classes.root}>
      {
        data && (
          <Grid container spacing={2}>
            <Grid {...gridProps}>
              <ViewData title='Name' value={data.name || '-'} />
              <ViewData title='Address' value={data.address || '-'} />
              <ViewData title='PAN' value={data.pan || '-'} />
            </Grid>
            <Grid {...gridProps}>
              <ViewData title='Region' value={data.region_name || '-'} />
              <ViewData title='Pincode' value={data.pincode || '-'} />
              <ViewData title='GST' value={data.gst || '-'} />
            </Grid>
          </Grid>
        )
      }
    </div >
  )
}
export default DealershipData;