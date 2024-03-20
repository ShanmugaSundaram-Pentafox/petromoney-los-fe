import { Grid, Drawer, Paper, Tooltip, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import { DeleteOutlineRounded } from '@material-ui/icons';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import MUIDataTable from 'mui-datatables';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useMount } from 'react-use';
import AddBlackListForm from './AddBlackListForm';
import Button from '../../components/CommonComponents/Button/Button';
import { TextEditor } from '../../components/TextEditor/TextEditor';
import { action_id, resources_id } from '../../config/accessControl';
import { getAllDealership } from '../../services/dealerships.service';
import { deleteRemarks, getAllWithheldLoans, resolveRemarks } from '../../services/withheld.services';
import CheckAllowed from '../rbac/CheckAllowed';


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
  const { data = [], isLoading } = useQuery('withheld-loans', () => getAllWithheldLoans(0), { refetchOnWindowFocus: false })

  useMount(() => {
    getAllDealership()
      .then((data) => {
        setDealershipData(data.map(({ id }) => ({
          label: id,
          value: id
        })))
      })
      .catch((e) => {
        console.log(e);
      })
  })

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
        queryClient.invalidateQueries('withheld-loans')
      })
      .catch(e => {
        console.log(e);
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
        queryClient.invalidateQueries('withheld-loans')
      })
      .catch((e) => {
        console.log(e);
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

  const columns = useMemo(() => {
    return [
      {
        label: 'Dealership ID',
        name: 'id',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <div>{value}</div>
          },
        },
      },
      {
        label: 'Name',
        name: 'name',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <>{value?.toUpperCase()}</>
          },
        },
      },
      {
        label: 'Region',
        name: 'region',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: 'Withheld By',
        name: 'with_held_by',
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        label: 'Reason',
        name: 'comments',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({
            align: 'left',
          }),
          customBodyRender: (value, tableMeta) => {
            return (
              value?.map((remark, i) => {
                return (
                  <div style={{ marginBottom: 12, display: 'flex' }} key={i}>
                    <div style={{ minWidth: 250, maxWidth: 250 }}>{remark.comment && remark.comment}</div>
                    <CheckAllowed currentUser={currentUser} resource={resources_id?.withheld} action={action_id?.withheld?.resolve}>
                      <div onClick={() => { setWithheldModal({ modal: true, type: 'resolve', id: remark.id }) }} style={{ marginLeft: 12 }}>
                        <Tooltip title="Click to resolve">
                          <CheckOutlinedIcon style={{ color: green[200] }} fontSize={'small'} />
                        </Tooltip>
                      </div>
                    </CheckAllowed>
                    <CheckAllowed currentUser={currentUser} resource={resources_id?.withheld} action={action_id?.withheld?.delete}>
                      <div onClick={() => { setWithheldModal({ modal: true, type: 'delete', id: remark.id }) }} style={{ marginLeft: 12 }}>
                        <Tooltip title='Click to delete'>
                          <DeleteOutlineRounded style={{ color: '#ff6666' }} fontSize={'small'} />
                        </Tooltip>
                      </div>
                    </CheckAllowed>
                  </div>
                )
              })
            )
          },
        },
      },
    ]
  }, [])
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
    <>
      <Grid item md={12}>
        {Array.isArray(data) ? (
          <MUIDataTable
            title={
              <Typography className={classes.title} variant="h5" component="h5">
                Unresolved withheld loans
              </Typography>
            }
            data={data}
            columns={columns}
            options={options}
          />
        ) : (!isLoading && <Paper style={{ padding: 10 }}>No unresolved withheld loans found</Paper>)
        }
        {
          isLoading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
        }
      </Grid>
      <Drawer
        anchor="right"
        open={openModal}
        onClose={() => setOpenModal(false)}
        variant="temporary"
      >
        {
          <AddBlackListForm data={dealershipData} callback={() => setOpenModal(false)} />
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
    </>
  )
}
export default UnresolvedTable;