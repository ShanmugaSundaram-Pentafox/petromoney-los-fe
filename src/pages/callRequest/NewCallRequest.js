import { Button, Dialog, DialogContent, makeStyles, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import TextInput from '../../components/TextInput/TextInput';
import { resolveCallbackRequest } from '../../services/callrequest.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';

const useStyles = makeStyles({
  pill: {
    border: '1px solid #feaa82f2',
    marginLeft: 15,
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 3,
    backgroundColor: '#feaa82f2',
    color: 'white'
  }
})

const NewCallRequest = ({ callbackData, isLoading }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [rowData, setRowData] = useState();
  const [remark, setRemark] = useState();
  const [error, setError] = useState();

  const { mutate: resolve } = useMutation(data => resolveCallbackRequest(data, rowData?.request_id), {
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
    let body = { is_processed: 1, remarks: remark }
    if (!remark) {
      setError('Please enter valid remarks')
    }
    else {
      resolve(body);
      setRemark();
      setError();
    }
  }

  const column = [
    {
      key: 'dealer_id',
      header: 'Customer Code',
      cell: (value) => <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.getValue()}</div>
    }, {
      key: 'dealer_name',
      header: 'Cust Name / Request',
      cell: ({ row }) => {
        return (
          <div style={{ display: 'flex' }}>
            <Typography variant='body1'>{row?.original?.dealer_name?.toUpperCase()}</Typography>
            {
              row?.original?.count > 1 &&
              <Typography variant='body2' className={classes.pill}><strong>{row?.original?.count}</strong></Typography>
            }
          </div>
        )
      }
    }, {
      key: 'dealership_id',
      header: 'Dealership Id',
      cell: (value) => <div style={{ cursor: 'pointer', color: '#1976d2' }}>{value?.getValue()}</div>
    }, {
      key: 'dealership_name',
      header: 'Dealership Name',
    }, {
      key: 'created_date',
      header: 'Requested On',
    }, {
      key: 'region_value',
      header: 'Region',
    }, {
      key: 'mobile',
      header: 'Mobile',
    }, {
      key: 'request_id',
      header: 'Request Id',
      isHeaderDisplay: false,
    }, {
      key: 'action',
      header: 'Action',
      isHeaderDownload: false,
      cell: ({ row }) => <Button variant='outlined' size='small' color='secondary' onClick={() => setRowData(row?.original)}>Resolve</Button>
    }, {
      key: 'count',
      header: 'Count',
      isHeaderDisplay: false,
    }
  ]

  const options = {
    print: false,
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 20, 30],
  };

  return (
    <div>
      <DataTableViewer
        rowData={callbackData}
        column={column}
        title={'New Request'}
        filter={false}
        loading={isLoading}
      />
      <Dialog onClose={() => { setRowData(); setRemark(); setError() }} open={rowData} maxWidth='xs' fullWidth>
        <DialogContent>
          <Typography variant='h5' style={{ textAlign: 'center', marginBottom: 8 }}>Add Remarks</Typography>
          <TextInput
            fullWidth
            placeholder='Enter remarks and resolve...'
            name="remarks"
            multiline
            rows={4}
            value={remark}
            error={error}
            helperText={error}
            onChange={e => setRemark(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10, marginTop: 12 }}>
            <Button onClick={() => { setRowData(); setRemark(); setError() }} variant='outlined' style={{ marginRight: 16 }}>Cancel</Button>
            <Button onClick={handleResolve} variant="contained" color="secondary">Resolve</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewCallRequest
