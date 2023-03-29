import { Drawer, Grid, Paper, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, {useState} from 'react';
import AssignProducts from './AssignProducts';
import MasterCity from './MasterCity';
import MasterCollectionRemarks from './MasterCollectionRemarks';
import Contain from './MasterDataTable';
import MasterEmailGroup from './MasterEmailGroup';
import Products from './Products';
import Zones from './Zones';
import {resources_id, action_id} from '../../../config/accessControl';
import { ReactComponent as AssetIcon } from '../../../icons/assets.svg';
import { ReactComponent as BunkIcon } from '../../../icons/bunk.svg';
import { ReactComponent as BusinessIcon } from '../../../icons/business.svg';
import { ReactComponent as FuelIcon } from '../../../icons/fuelIcon.svg';
import { ReactComponent as InfrastructureIcon } from '../../../icons/infrastructure.svg';
import { ReactComponent as LoanIcon } from '../../../icons/loan.svg';
import { ReactComponent as CityIcon } from '../../../icons/locationIcon.svg';
import { ReactComponent as MailListIcon } from '../../../icons/MailList.svg';
import { ReactComponent as OtherIcon } from '../../../icons/other_icons.svg';
import { ReactComponent as RemarkIcon } from '../../../icons/remarkIcon.svg';
import { ReactComponent as RolesIcon } from '../../../icons/rolesIcon.svg';
import { ReactComponent as ZoneIcon } from '../../../icons/zoneIcon.svg';
import CheckAllowed from '../../rbac/CheckAllowed';

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

function MasterData({currentUser}) {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState()
  const [customForm, setCustomForm] = useState()

  return (
    <div>
      <Paper style={{padding: 10}}>
        <div style={{marginLeft: 20, width: '95%'}}>
          <Grid container spacing={1} className={classes.root}>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.zones}>
                <Tooltip title="Zone">
                  <div className={classes.content} onClick={() => setCustomForm('Zone')}>
                    <ZoneIcon width={35} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Zones</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.states}>
                <Tooltip title="States">
                  <div className={classes.content} onClick={() => setOpenForm('State')}>
                    <InfrastructureIcon width={35} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title}>States</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.regions}>
                <Tooltip title="Regions">
                  <div className={classes.content} onClick={() => setOpenForm('Region')}>
                    <OtherIcon width={35} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title}>Regions</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.city}>
                <Tooltip title="City">
                  <div className={classes.content} onClick={() => setCustomForm('city')}>
                    <CityIcon className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >City</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.omcs}>
                <Tooltip title="OMC details">
                  <div className={classes.content} onClick={() => setOpenForm('OMCs')}>
                    <BunkIcon width={35} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >OMCs</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.business}>
                <Tooltip title="Business Type">
                  <div className={classes.content} onClick={() => setOpenForm('Business Type')}>
                    <BusinessIcon width={35} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Business</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.loan}>
                <Tooltip title="Loan Type">
                  <div className={classes.content} onClick={() => setOpenForm('Loan Type')}>
                    <LoanIcon width={35} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Loan</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.asset}>
                <Tooltip title="Asset Type">
                  <div className={classes.content} onClick={() => setOpenForm('Asset Type')}>
                    <AssetIcon width={35} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Asset</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.products}>
                <Tooltip title="Products">
                  <div className={classes.content} onClick={() => setCustomForm('Products')}>
                    <FuelIcon width={40} className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Products</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.assign_role_products}>
                <Tooltip title="Role Products">
                  <div className={classes.content} onClick={() => setCustomForm('assign_products')}>
                    <RolesIcon className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Assign Role Products</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.collectionRemark}>
                <Tooltip title="Collection Remarks">
                  <div className={classes.content} onClick={() => setCustomForm('collection_remark')}>
                    <RemarkIcon className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Collection Remark</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
            </Grid>
            <Grid item md={2}>
              <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id?.settings?.emailGroup}>
                <Tooltip title="Email Groups">
                  <div className={classes.content} onClick={() => setCustomForm('email_groups')}>
                    <MailListIcon className={classes.icons} />
                    <Typography variant="h5" align='center' className={classes.title} >Email List</Typography>
                  </div>
                </Tooltip>
              </CheckAllowed>
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
          open={customForm === 'Products'}
          onClose={() => setCustomForm()}
          variant="temporary"
        >
          <Products currentUser={currentUser} title={customForm} callback={setCustomForm}/>
        </Drawer>
        <Drawer
          anchor="right"
          open={customForm === 'Zone'}
          onClose={() => setCustomForm()}
          variant="temporary"
        >
          <Zones currentUser={currentUser} title={customForm} callback={setCustomForm}/>
        </Drawer>
        <Drawer
          anchor="right"
          open={customForm === 'assign_products'}
          onClose={() => setCustomForm()}
          variant="temporary"
        >
          <AssignProducts currentUser={currentUser} title='Select Role to Assign Product' callback={setCustomForm} />
        </Drawer>
        <Drawer
          anchor="right"
          open={customForm === 'city'}
          onClose={() => setCustomForm()}
          variant="temporary"
        >
          <MasterCity currentUser={currentUser} title='City' callback={setCustomForm} />
        </Drawer>
        <Drawer
          anchor="right"
          open={customForm === 'collection_remark'}
          onClose={() => setCustomForm()}
          variant="temporary"
        >
          <MasterCollectionRemarks currentUser={currentUser} title='Collection Remarks' callback={setCustomForm} />
        </Drawer>
        <Drawer
          anchor="right"
          open={customForm === 'email_groups'}
          onClose={() => setCustomForm()}
          variant="temporary"
        >
          <MasterEmailGroup currentUser={currentUser} title='Email Groups' callback={setCustomForm} />
        </Drawer>
      </Paper>

    </div>
  );
}

export default MasterData;
