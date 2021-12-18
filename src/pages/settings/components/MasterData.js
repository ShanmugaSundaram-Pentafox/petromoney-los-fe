import { Drawer, Grid, Paper, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, {useState} from 'react';
import Contain from './MasterDataTable';
import Zones from './Zones';
import { ReactComponent as AssetIcon } from '../../../icons/assets.svg';
import { ReactComponent as BunkIcon } from '../../../icons/bunk.svg';
import { ReactComponent as BusinessIcon } from '../../../icons/business.svg';
import { ReactComponent as InfrastructureIcon } from '../../../icons/infrastructure.svg';
import { ReactComponent as LoanIcon } from '../../../icons/loan.svg';
import { ReactComponent as OtherIcon } from '../../../icons/other_icons.svg';
import { ReactComponent as ZoneIcon } from '../../../icons/zoneIcon.svg';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginTop: 4,
    flexGrow: 1,
    // justifyContent: 'center'
  },
  title: {
    fontSize: 12,
    // paddingLeft: 8,
    marginBottom: 8
  },
  content: {
    textAlign: 'center',
    marginBottom: 10,
    borderRadius: 6,
    paddingTop: 16,
    paddingBottom: 12,
    cursor: 'pointer',
    transition: 'all 0.35s',
    '&:hover': {
      backgroundColor: '#e6e6e6',
    },
  },
  icons: {
    // textAlign: 'center',
  },
  header: {
    display: 'flex',
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 15
  },
  WrapperTitle: {
    fontSize: 18,
    marginBottom: 12
  },
})

function MasterData() {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState()
  const [customForm, setCustomForm] = useState()

  return (
    <div>
      <Paper style={{padding: 10}}>
        <div style={{marginLeft: 20, width: '95%'}}>
          <Grid container spacing={1} className={classes.root}>
            <Grid item md={2}>
              <Tooltip title="Zone">
                <div className={classes.content} onClick={() => setCustomForm('Zone')}>
                  <ZoneIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Zones</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="Regions">
                <div className={classes.content} onClick={() => setOpenForm('Region')}>
                  <OtherIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title}>Regions</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="States">
                <div className={classes.content} onClick={() => setOpenForm('State')}>
                  <InfrastructureIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title}>States</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="OMC details">
                <div className={classes.content} onClick={() => setOpenForm('OMCs')}>
                  <BunkIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >OMCs</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="Business Type">
                <div className={classes.content} onClick={() => setOpenForm('Business Type')}>
                  <BusinessIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Business</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="Loan Type">
                <div className={classes.content} onClick={() => setOpenForm('Loan Type')}>
                  <LoanIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Loan</Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip title="Asset Type">
                <div className={classes.content} onClick={() => setOpenForm('Asset Type')}>
                  <AssetIcon width={35} className={classes.icons} />
                  <Typography variant="h5" align='center' className={classes.title} >Asset</Typography>
                </div>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
        
        <Drawer
          anchor="right"
          open={openForm}
          onClose={() => setOpenForm()}
          variant="temporary"
        >
          <Contain title={openForm} label={'name'} setStateBtn={openForm === 'State' ? true : false} regionForm={openForm === 'Region' ? true : false} assetForm={openForm === 'Asset Type' ? true : false} callback={() => setOpenForm()}/>
        </Drawer>

        <Drawer
          anchor="right"
          open={customForm === 'Zone'}
          onClose={() => setCustomForm()}
          variant="temporary"
        >
          <Zones title={customForm} callback={setCustomForm}/>
        </Drawer>
      </Paper>

    </div>
  );
}

export default MasterData;
