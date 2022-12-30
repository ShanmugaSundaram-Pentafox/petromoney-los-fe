import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Check, Clear, NavigateNextRounded } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import LoaderButton from '../../components/CommonComponents/Button/LoaderButton';
import { updateRbacAccess } from '../../services/rbac.service';
import { checkValue, parseValue } from '../../utils/cerbos';

const useStyles = makeStyles((theme) => ({
  root: {
    height: window.innerHeight / 1.3,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 15,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 120 * 2,
  },
  tab: {
    '& .MuiTab-wrapper': {
      alignItems: 'flex-end !important',
      marginRight: 15,
    },
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

const APIAccessPage = ({ accessControl, selectedRole, accessLoading }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [buffer, setBuffer] = useState([]);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // filter particular action from a resource with action_name [read, edit, delete]
  const findActionById = (array, action_name) => {
    return array?.actions?.find((val) => val.action_name == action_name);
  };

  // Handle checkbox onChange
  const handleAccessChange = (event, data) => {
    const checkbox = event.target;
    let value = findActionById(data, checkbox.id);
    value.permission = parseValue(checkbox.checked);
    value['resource_id'] = data?.resource?.id;
    value['resource_name'] = data?.resource?.kind;

    if (!buffer?.includes(value)) {
      setBuffer([...buffer, value]);
    } else {
      const index = buffer.filter(
        (item) => item?.action_id != checkbox.action_id
      );
      setBuffer(index);
    }
  };

  // handle policy update
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
  }

  // group actions based on resource id show updated fields before update
  const groupedActions = buffer.reduce((acc, curr) => {
    const { resource_id, resource_name, ...rest } = curr;
    const group = acc.find((g) => g.resource_id === resource_id);
    if (group) {
      group.actions.push(rest);
    } else {
      acc.push({
        resource_id,
        resource_name,
        actions: [rest],
      });
    }
    return acc;
  }, []);

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableCell>Resource</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Read</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableHead>
          <TableBody>
            { 
              accessLoading ? [1,2,1,1,2,1,2,1,2,1,2,1,2,1].map((a, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton variant='text' />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={10} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={10} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={10} />
                  </TableCell>
                </TableRow>
              )) :
            accessControl?.map((access, i) => {
              return (
                <TableRow key={i} hover>
                  <TableCell>
                    {accessLoading ? <Skeleton variant='text' /> : access?.resource?.kind}
                  </TableCell>
                  <TableCell>
                    {/* {access?.action?.find(val => val.action_id === 1)?.description} */}
                  </TableCell>
                  {
                    ['read', 'edit', 'delete'].map((act, i) => (
                      <TableCell component="th" scope="row" key={i}>
                        <Checkbox
                          size="small"
                          id={findActionById(access, act)?.action_name}
                          onChange={(event) => handleAccessChange(event, access)}
                          disabled={selectedRole == 1}
                          checked={checkValue(
                            findActionById(access, act)?.permission
                          )}
                        />
                      </TableCell>
                    ))
                  }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 20 }}>
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
                <TableCell>Resource</TableCell>
                <TableCell>Read</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableHead>
              <TableBody>
                {groupedActions?.map((action, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{action?.resource_name}</TableCell>
                      {['read', 'edit', 'delete']?.map((act, i) => (
                        <TableCell
                          key={i}
                          style={
                            checkValue(findActionById(action, act)?.permission)
                              ? { color: 'green' }
                              : { color: 'red' }
                          }
                        >
                          {findActionById(action, act)?.permission ==
                          undefined ? null : checkValue(
                              findActionById(action, act)?.permission
                            ) ? (
                              <Check />
                              ) : (
                                <Clear />
                              )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
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

export default APIAccessPage;
