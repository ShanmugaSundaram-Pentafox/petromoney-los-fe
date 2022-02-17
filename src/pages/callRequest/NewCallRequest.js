import { Button, Dialog, DialogActions, DialogContent, makeStyles, Typography } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import TextInput from '../../components/TextInput/TextInput';
import { resolveCallbackRequest } from '../../services/callrequest.service';

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

const NewCallRequest = ({callbackData}) => {
  const classes = useStyles();
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
        label: 'Cust Name / Requestes',
        options: {
          customBodyRender: (value, tableMeta) => {
            return (
              <div style={{display: 'flex'}}>
                <Typography variant='body1'>{value?.toUpperCase()}</Typography>
                {
                  tableMeta.rowData[7] > 1 &&
                    <Typography variant='body2' className={classes.pill}><strong>{tableMeta.rowData[7]}</strong></Typography>
                }
              </div>
            )
          }
        }
      },
      {
        name: 'created_date',
        label: 'Requested On',
        options: { filter: false }
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
      },
      {
        name: 'count',
        label: 'Count',
        options: { 
          filter: false,
          display: false
        }
      },
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
