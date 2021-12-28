import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import TextInput from '../../components/TextInput/TextInput';
import usePageTitle from '../../hooks/usePageTitle';
import { resolveCallbackRequest } from '../../services/callrequest.service';

const NewCallRequest = ({callbackData}) => {
  usePageTitle('Call Request');
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState()
  const [remark, setRemark] = useState()

  const { mutate: resolve } = useMutation(data => resolveCallbackRequest(data, rowData[4]) , {
    onSuccess: (message) => {
      setRowData()
      queryClient.invalidateQueries('new-request')
      queryClient.invalidateQueries('processed-request')
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    },
    onError: (message) => {
      enqueueSnackbar(message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
  })

  const handleResolve = () => {
    let body = {is_processed: 1, remarks: remark}
    resolve(body)
  }

  const columns = useMemo(() => {
    return [
      {
        name: 'dealer_id',
        label: 'Cust Code',
        options: {
          customBodyRender: (value) => {
            return <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value}</div>
          }
        }
      },
      {
        name: 'dealer_name',
        label: 'Cust Name',
        options: {
          customBodyRender: (value, tableMeta) => {
            return <div>{value?.toUpperCase()} {tableMeta.rowData[2]?.toUpperCase()}</div>
          }
        }
      },
      {
        name: 'region_value',
        label: 'Region',
        options: { filter: false }
      },
      {
        name: 'mobile',
        label: 'Mobile',
        options: { filter: false }
      },
      {
        name: 'request_id',
        label: 'Request ID',
        options: { 
          filter: false,
          display: false
        }
      },
      {
        name: 'call',
        label: 'Action',
        setCellProps: () => ({
          align: 'right',
        }),
        options: { 
          filter: false,
          customBodyRender: (value, tableValue) => {
            return <Button variant='outlined' size='small' color='secondary' onClick={() => setRowData(tableValue?.rowData)}>Resolve</Button>
          }
        }
      }
    ];
  });

  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  return (
    <div>
      <MUIDataTable
        title={'New Request'}
        columns={columns}
        options={options}
        data={callbackData}
      />
      <Dialog onClose={() => setRowData()} open={rowData}>
        <DialogContent style={{minWidth: '300px'}}>
          <label>Remark</label>
          <TextInput
            fullWidth
            name="remarks"
            value={remark}
            onChange={e => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setRowData()}>Cancel</Button>
          <Button onClick={handleResolve} variant="outlined" color="primary" size="small">Resolve</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default NewCallRequest
