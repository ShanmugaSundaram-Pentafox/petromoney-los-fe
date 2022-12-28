import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@material-ui/core';
import { Check, Clear, NavigateNextRounded } from '@material-ui/icons';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import AccessControlTable from './AccessControlTable';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import {
  tabA11yProps,
  TabPanel,
} from '../../components/CommonComponents/Tabs/TabPanel';
import TextInput from '../../components/TextInput/TextInput';
import {
  getRbacAccessDetails,
  getRbacResources,
  updateRbacAccess,
} from '../../services/rbac.service';
import { getAllUserRoles } from '../../services/users.service';
import { checkValue } from '../../utils/cerbos';

const useStyles = makeStyles((theme) => ({
  root: {
    height: window.innerHeight / 1.2,
    flexGrow: 1,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 120*2,
  },
  tab: {
    '& .MuiTab-wrapper': {
      alignItems: 'flex-end !important',
      marginRight: 15
    }
  },
  editButton: {
    marginRight: '8px',
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.white,
    },
    '&.MuiButton-contained:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

const UserControl = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [selectedRole, setRole] = useState();
  const [buffer, setBuffer] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);

  // fetch all resources and action for selected role
  const { data: accessControl = [], isLoading } = useQuery(
    ['rbac-access', selectedRole],
    () => getRbacAccessDetails(selectedRole),
    { refetchOnWindowFocus: false }
  );
  
  // fetch all resources list for selected role
  const { data: resources = [] } = useQuery(
    ['rbac-resources', selectedRole],
    () => getRbacResources(),
    { refetchOnWindowFocus: false }
  );

  // fetch all user roles
  const { data: roles = [] } = useQuery(
    ['user-roles'],
    () => getAllUserRoles(),
    { 
      refetchOnWindowFocus: false,
      // onSuccess: () => {
      // queryClient.invalidateQueries('rbac-access');
      // }
    },
  );

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setBuffer([]);
  };

  const handleAccessUpdate = () => {
    if (buffer) {
      setUpdateLoading(true);
      updateRbacAccess(buffer, selectedRole)
        .then((message) => {
          queryClient.invalidateQueries('rbac-access');
          setUpdateLoading(false);
          setUpdateDialog(false);
          setBuffer([]);
          enqueueSnackbar(message, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'success',
          });
        })
        .catch((e) => {
          setUpdateLoading(false);
          console.log(e);
        });
    }
  };

  return (
    <Paper>
      <div style={{ padding: 20, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h3" style={{ marginRight: 20 }}>
          Edit Role Access
        </Typography>
        <TextInput
          select
          label="Role"
          name="role"
          value={selectedRole}
          onChange={handleRoleChange}
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{ shrink: true }}
        >
          <option value="null">Select a Role</option>
          {roles?.map((role, i) => (
            <option key={i} value={role?.id}>
              {role?.role_name}
            </option>
          ))}
        </TextInput>
      </div>
      {selectedRole && (
        <div className={classes.root}>
          <Tabs
            value={tab}
            orientation="vertical"
            indicatorColor="primary"
            scrollButtons="desktop"
            variant="scrollable"
            textColor="primary"
            className={classes.tabs}
            onChange={(e, val) => setTab(val)}
          >
            {resources.map((res, i) => (
              <Tab key={i} label={res?.resource?.toUpperCase()} {...tabA11yProps(i)} className={classes.tab} />
            ))}
          </Tabs>
          {resources.map((res, i) => (
            <TabPanel activeTab={tab} index={i} key={i}>
              <AccessControlTable
                data={accessControl}
                selectedResource={resources[tab]?.resource}
                buffer={buffer}
                setBuffer={setBuffer}
                selectedRole={selectedRole}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  type="submit"
                  className={clsx(classes.btn, classes.editButton)}
                  startIcon={<NavigateNextRounded />}
                  onClick={() => setUpdateDialog(!updateDialog)}
                >
                  Save
                </Button>
              </div>
            </TabPanel>
          ))}
        </div>
      )}
      <Dialog
        open={updateDialog}
        onClose={() => setUpdateDialog(false)}
        fullWidth
      >
        <DialogTitle>
          Are you sure want to update these permissions?
        </DialogTitle>
        <DialogContent dividers>
          {buffer?.length ? (
            <Table stickyHeader>
              <TableHead>
                <TableCell>Action Name</TableCell>
                <TableCell>Resource Name</TableCell>
                <TableCell>Permission</TableCell>
              </TableHead>
              <TableBody>
                {buffer?.map((action, index) => (
                  <TableRow key={index}>
                    <TableCell>{action?.action_name}</TableCell>
                    <TableCell>{resources?.find(item => item?.id === action?.resource_id)?.resource}</TableCell>
                    <TableCell
                      style={
                        checkValue(action?.permission)
                          ? { color: 'green' }
                          : { color: 'red' }
                      }
                    >
                      {
                        checkValue(action?.permission) ? <Check /> : <Clear /> 
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <DialogContentText>
              There are no changes to update!
            </DialogContentText>
          )}
        </DialogContent>
        <div
          style={{
            padding: '12px 10px 12px 0px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
          {buffer?.length ? (
            <LoaderButton
              variant="contained"
              type="submit"
              loadingText="Updating..."
              isLoading={updateLoading}
              className={clsx(classes.btn, classes.editButton)}
              startIcon={<NavigateNextRounded />}
              onClick={handleAccessUpdate}
            >
              Update
            </LoaderButton>
          ) : null}
        </div>
      </Dialog>
    </Paper>
  );
};

export default UserControl;
