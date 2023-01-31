import {
  Checkbox,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import TextInput from '../../components/TextInput/TextInput';
import { updateRbacActionsDescription } from '../../services/rbac.service';
import { checkValue, parseValue } from '../../utils/cerbos';

const useStyles = makeStyles((theme) => ({
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
  rowItem: {
    '&:hover': {
      backgroundColor: '#EEEEEE',
      '& $btn': {
        visibility: 'visible',
      },
    },
  },
  btn: {
    visibility: 'hidden',
    color: '#687980',
  },
}));

const AccessControlTable = ({ data, selectedResource, buffer, setBuffer, selectedRole }) => {
  const classes = useStyles();
  const [rowData, setRowData] = useState({edit: false});
  const queryClient = useQueryClient();

  // Filtered selected resource
  const ResourceFilter = data?.find(
    (res) => res?.resource?.kind === selectedResource
  );

  // Handle Checkbox onChange
  const handleAccess = (event) => {
    const checkbox = event.target;
    let value = ResourceFilter?.actions?.find(
      (value) => value.action_name === checkbox.value
    );
    value.permission = parseValue(checkbox.checked);
    value['resource_id'] = ResourceFilter?.resource?.id;
    value['resource_name'] = ResourceFilter?.resource?.kind;
    if (!buffer.includes(value)) {
      setBuffer([...buffer, value]);
    } else {
      const index = buffer.filter(item => item?.action_id != checkbox.action_id)
      setBuffer(index)
    }
  };

  const handleDescriptionChange = (event) => {
    setRowData({...rowData, data: {...rowData?.data, description: event.target.value}});
  }

  const handleDescriptionSave = () => {
    const body = {
      description: rowData?.data?.description
    }
    updateRbacActionsDescription(body, rowData?.data?.action_id)
      .then(() => {
        queryClient.invalidateQueries('rbac-access')
        setRowData({edit: false})
      })
      .catch((e) => console.log(e))
  }

  return (
    <div>
      <TableContainer
        style={{ height: window.innerHeight / 1.3, overflow: 'scroll' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableCell align="center">Access</TableCell>
            <TableCell>Action Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Action</TableCell>
          </TableHead>
          <TableBody>
            {ResourceFilter?.actions?.map((action, index) => {
              return (
                <TableRow className={classes.rowItem} key={index}>
                  <TableCell align="center">
                    <Checkbox
                      onChange={handleAccess}
                      checked={checkValue(action?.permission)}
                      size="small"
                      id={action?.id}
                      value={action?.action_name}
                      disabled={selectedRole == 1}
                    />
                  </TableCell>
                  <TableCell>{action?.action_name}</TableCell>
                  <TableCell>
                    {
                      rowData?.edit && rowData?.data?.action_id === action?.action_id ?
                        <div>
                          <TextInput
                            name="description"
                            value={rowData?.data?.description}
                            onChange={handleDescriptionChange}
                            InputProps={{
                              endAdornment: 
                          <div style={{padding: 8, display: 'flex'}}>
                            <IconButton size='small' onClick={handleDescriptionSave}>
                              <Tooltip title="Save" >
                                <Check fontSize='small' style={{color: '#4caf50'}} />
                              </Tooltip>
                            </IconButton>
                            <IconButton size='small' onClick={() => setRowData({edit: false})}>
                              <Tooltip title="Cancel" >
                                <Close fontSize='small' color='error' />
                              </Tooltip>
                            </IconButton>
                          </div>
                            }}
                          />
                        </div> :
                      action?.description
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" className={classes.btn} onClick={() => setRowData({edit: true, data: action})}>
                      <Tooltip title="Edit">
                        <EditIcon fontSize="small" style={{color: 'rgb(0,0,0,0.4)'}}/>
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AccessControlTable;
