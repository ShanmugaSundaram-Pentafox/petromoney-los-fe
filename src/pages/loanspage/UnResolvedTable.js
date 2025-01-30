import { Grid, Drawer, Tooltip, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { DeleteOutlineRounded } from '@material-ui/icons';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import AddBlackListForm from './AddBlackListForm';
import { TextEditor } from '../../components/TextEditor/TextEditor';
import { action_id, resources_id } from '../../config/accessControl';
import { deleteRemarks, getWithheldLoansData, resolveRemarks } from '../../services/withheld.services';
import CheckAllowed from '../rbac/CheckAllowed';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { Button, Group, Paper, Text } from '@mantine/core';
import moment from 'moment';
import { getSignedUrl } from '../../services/common.service';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import { useDebouncedState } from '@mantine/hooks';


const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 500,
  },
}))

const UnresolvedTable = ({ currentUser }) => {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState(false);
  const [dealershipData, setDealershipData] = useState([]);
  const [withheldModal, setWithheldModal] = useState(false);
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1)
  const [search, setSearch] = useDebouncedState('', 500);
  const { data: unResolvedData = [], isFetching } = useQuery(['withheld-loans-unresolved', search, page], () => getWithheldLoansData({is_resolved: 0, search, page}), { refetchOnWindowFocus: false })
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    page != 1 && setPage(1)
  }, [search])

  const downloadReport = () => {
    setDownloadLoading(true)
    getWithheldLoansData({is_resolved: 0,download: true})
      .then((res) => {
        getSignedUrl(res?.data?.[0]?.url)
          .then((res) => {
            window.open(res?.url, '_blank');
          })
          .catch(e => {
            displayNotification({
              message: e?.message || e,
              variant: 'error',
            })
          })
          .finally(() => {
            setDownloadLoading(false);
          })
      })
  }

  const handleResolve = (id) => {
    resolveRemarks(id, withheldModal?.json)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        queryClient.invalidateQueries('withheld-loans-unresolved')
      })
      .catch(e => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
      .finally(() => {
        setWithheldModal(false);
      })
  }

  const handleDelete = (id) => {
    deleteRemarks(id, withheldModal?.json)
      .then(res => {
        enqueueSnackbar(res, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
        })
        queryClient.invalidateQueries('withheld-loans-unresolved')
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
        })
      })
      .finally(() => {
        setWithheldModal(false);
      })
  }

  const handleOnclick = () => {
    if (withheldModal?.json?.length) {
      withheldModal?.type === 'resolve' ? handleResolve(withheldModal?.id) : handleDelete(withheldModal?.id);
    } else {
      setWithheldModal({ ...withheldModal, error: 'Please enter remarks' });
    }
  }

  const column = [
    {
      key: 'id',
      header: 'Dealership Id'
    }, {
      key: 'name',
      header: 'Name',
      cell: (value) => <span>{value?.getValue()}</span>
    }, {
      key: 'region',
      header: 'Region',
    }, {
      key: 'with_held_by',
      header: 'Withheld By',
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <div>{remark?.withheld_by || '-'}</div>
            )
          })
        )
      },
    }, {
      key: 'with_held_date',
      header: 'Withheld Date',
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <div>{remark?.withheld_date ? moment(remark?.withheld_date, 'YYYY-MM-DD').format('DD-MM-YYYY') : '-'}</div>
            )
          })
        )
      },
    }, {
      key: 'action',
      header: 'Reason',
      isHeaderDownload: false,
      cell: ({ row }) => {
        return (
          row?.original?.comments?.map((remark, i) => {
            return (
              <Group key={i}>
                <div style={{ width: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{remark.comment && remark.comment}</div>
                <Group gap={6}>
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.withheld} action={action_id?.withheld?.resolve}>
                    <div onClick={() => { setWithheldModal({ modal: true, type: 'resolve', id: remark.id, comment: remark.comment }) }} style={{ marginLeft: 12, width: 'fit-content' }}>
                      <Tooltip title="Click to resolve">
                        <CheckOutlinedIcon style={{ color: green[200] }} fontSize={'small'} />
                      </Tooltip>
                    </div>
                  </CheckAllowed>
                  <CheckAllowed currentUser={currentUser} resource={resources_id?.withheld} action={action_id?.withheld?.delete}>
                    <div onClick={() => { setWithheldModal({ modal: true, type: 'delete', id: remark.id, comment: remark.comment }) }} style={{ marginLeft: 12, width: 'fit-content' }}>
                      <Tooltip title='Click to delete'>
                        <DeleteOutlineRounded style={{ color: '#ff6666' }} fontSize={'small'} />
                      </Tooltip>
                    </div>
                  </CheckAllowed>
                </Group>
              </Group>
            )
          })
        )
      },
    },
  ]

  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    rowsPerPage: 10,
    viewColumns: false,
    print: false,
    download: true,
    filter: true,
    isRowSelectable: () => false,
    onDownload: (buildHead, buildBody, columns, data) => {
      let Data = () => {
        let tempArray = []
        data.map((item, index) => {
          let buffer = []
          item.data.map((data, i) => {
            if (typeof (data) !== 'object') {
              buffer.push(data)
            } else {
              let result = data.map(obj => `${obj.comment}\n`)
              buffer.push(result)
            }
          })
          tempArray.push({ index: index, data: buffer })
        })
        return tempArray
      }
      return '\uFEFF' + buildHead(columns) + buildBody(Data())
    },
    customToolbar: () => {
      return (
        // Withheld create permission check
        <CheckAllowed currentUser={currentUser} resource={resources_id?.withheld} action={action_id?.withheld?.create}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            Add
          </Button>
        </CheckAllowed>
      );
    },
  }

  return (
    <Paper>
      <Grid item md={12}>
        <DataTableViewer
          useAPIPagination
          rowData={unResolvedData?.data}
          filter={false}
          column={column}
          loading={isFetching}
          showAction={<CheckAllowed currentUser={currentUser} resource={resources_id?.withheld} action={action_id?.withheld?.create}>
            <Button
              size='xs'
              onClick={() => setOpenModal(true)}
            >
              Add
            </Button>
          </CheckAllowed>
          }
          title={'Unresolved Withheld Loans'}
          noDataText='No un-resolved loans found'
          downloadQuery={{ query: downloadReport, isLoading: downloadLoading }}
          excelDownload
          page={page}
          setPage={setPage}
          apiSearch={setSearch}
          totalNoOfPages={unResolvedData?.total_pages}
          totalNoOfRecords={unResolvedData?.total_records}
        />
      </Grid>
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        {
          <AddBlackListForm callback={() => setOpenModal(false)} />
        }
      </Drawer>
      <Dialog
        open={withheldModal?.modal}
        onClose={() => {
          setWithheldModal(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className={classes.dialog}>
            {withheldModal?.comment ? <>
              <Text c={'#546e7a'}>Comment</Text>
              <Text mb={'md'} fw={500} >{withheldModal?.comment}</Text>
            </> : null}
            <DialogContentText id="approval-remarks-desc">
              Please enter remarks to {withheldModal?.type === 'resolve' ? 'resolve' : 'delete'} this withheld.
            </DialogContentText>
            <TextEditor setJSON={(e) => { setWithheldModal({ ...withheldModal, json: e }) }} toolBar={true} remarkData={withheldModal?.json} />
            {
              withheldModal?.error ?
                <Alert severity="error" style={{ padding: '0px 16px' }}>{withheldModal?.error}</Alert> : null
            }
          </div>
        </DialogContent>
        <DialogActions style={{ marginBottom: 8 }}>
          <Button
            onClick={() => {
              setWithheldModal(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={handleOnclick}
            variant='contained'
            size='medium'
            style={{ color: 'white', marginLeft: 16, marginRight: 16, backgroundColor: withheldModal?.type === 'resolve' ? green[500] : 'red' }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
export default UnresolvedTable;