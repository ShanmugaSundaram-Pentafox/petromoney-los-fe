import {
  Checkbox,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';
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
}));

const AccessControlTable = ({ data, selectedResource, buffer, setBuffer, selectedRole }) => {
  const classes = useStyles();

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
    if (!buffer.includes(value)) {
      setBuffer([...buffer, value]);
    } else {
      const index = buffer.filter(item => item?.action_id != checkbox.action_id)
      setBuffer(index)
    }
  };

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
          </TableHead>
          <TableBody>
            {ResourceFilter?.actions?.map((action, index) => {
              return (
                <TableRow hover key={index}>
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
                  <TableCell>{action?.desc}</TableCell>
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
