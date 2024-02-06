import { Box, Paper, SimpleGrid, Text } from '@mantine/core';
import { Drawer, makeStyles } from '@material-ui/core';
import React, {useState} from 'react';
import AssignProducts from './AssignProducts';
import MasterCity from './MasterCity';
import MasterCollectionRemarks from './MasterCollectionRemarks';
import Contain from './MasterDataTable';
import MasterEmailGroup from './MasterEmailGroup';
import Products from './Products';
import Zones from './Zones';
import { RightSideDrawer } from '../../../components/Mantine/RightSideDrawer/RightSideDrawer';
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: '16px 0',
    height: 96,
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.35s',

    '&:hover': {
      backgroundColor: '#e6e6e6',
    },
  },
})

function MasterData({currentUser}) {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState()
  const [customForm, setCustomForm] = useState()

  return (
    <Paper p="lg">
      <SimpleGrid cols={{ base: 3, sm: 4, md: 5, lg: 6 }} spacing="lg">
        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.zones}>
            <Box className={classes.content} onClick={() => setCustomForm('Zone')}>
              <ZoneIcon width={35} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Zones</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.zones}>
            <Box className={classes.content} onClick={() => setOpenForm('State')}>
              <InfrastructureIcon width={35} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">States</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.regions}>
            <Box className={classes.content} onClick={() => setOpenForm('Region')}>
              <OtherIcon width={35} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Regions</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.city}>
            <Box className={classes.content} onClick={() => setCustomForm('city')}>
              <CityIcon className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">City</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.omcs}>
            <Box className={classes.content} onClick={() => setOpenForm('OMCs')}>
              <BunkIcon width={35} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">OMCs</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.business}>
            <Box className={classes.content} onClick={() => setOpenForm('Business Type')}>
              <BusinessIcon width={35} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Business</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.loan}>
            <Box className={classes.content} onClick={() => setOpenForm('Loan Type')}>
              <LoanIcon width={35} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Loan</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.asset}>
            <Box className={classes.content} onClick={() => setOpenForm('Asset Type')}>
              <AssetIcon width={35} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Asset</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.products}>
            <Box className={classes.content} onClick={() => setCustomForm('Products')}>
              <FuelIcon width={32} height={32} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Products</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.assign_role_products}>
            <Box className={classes.content} onClick={() => setCustomForm('assign_products')}>
              <RolesIcon className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Assign Role Products</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id.settings.collectionRemark}>
            <Box className={classes.content} onClick={() => setCustomForm('collection_remark')}>
              <RemarkIcon width={32} height={32} className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Collection Remark</Text>
            </Box>
          </CheckAllowed>
        </div>

        <div>
          <CheckAllowed currentUser={currentUser} resource={resources_id.settings} action={action_id?.settings?.emailGroup}>
            <Box className={classes.content} onClick={() => setCustomForm('email_groups')}>
              <MailListIcon className={classes.icons} />
              <Text size="xs" fw="bold" ta="center">Email List</Text>
            </Box>
          </CheckAllowed>
        </div>
      </SimpleGrid>

      <RightSideDrawer
        title={openForm} 
        opened={openForm}
        onClose={() => setOpenForm()}
      >
        <Contain 
          title={openForm} 
          label={'name'} 
          setStateBtn={openForm === 'State' ? true : false} 
          regionForm={openForm === 'Region' ? true : false} 
          assetForm={openForm === 'Asset Type' ? true : false} 
          callback={() => setOpenForm()}
        />
      </RightSideDrawer>
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
  );
}

export default MasterData;
